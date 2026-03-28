-- Create custom types
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE advice_type AS ENUM ('insight', 'alert', 'recommendation');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  risk_profile TEXT,
  financial_goals JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  type transaction_type NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  payment_method TEXT,
  receipt_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create budgets table
CREATE TABLE public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  limit_amount NUMERIC NOT NULL,
  period TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ai_advice table
CREATE TABLE public.ai_advice (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type advice_type NOT NULL,
  content TEXT NOT NULL,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_advice ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions." ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions." ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions." ON public.transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own budgets." ON public.budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budgets." ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budgets." ON public.budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budgets." ON public.budgets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advice." ON public.ai_advice FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own advice." ON public.ai_advice FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to automatically create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Phase 7: Proprietary Health Score & Couples Sync Additions
ALTER TABLE public.profiles ADD COLUMN household_id UUID DEFAULT gen_random_uuid();
ALTER TABLE public.profiles ADD COLUMN assets NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN debt NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN emergency_fund NUMERIC DEFAULT 0;

-- Phase 8: Premium Billing Constraints
ALTER TABLE public.profiles ADD COLUMN tier TEXT DEFAULT 'free';

-- Security: Prevent unauthorized updates to the 'tier' column
CREATE OR REPLACE FUNCTION public.protect_tier_column()
RETURNS trigger AS $$
BEGIN
  -- If the requester is not using the service_role, prevent tier changes
  IF (TG_OP = 'UPDATE' AND NEW.tier IS DISTINCT FROM OLD.tier AND current_setting('role') <> 'service_role') THEN
    NEW.tier := OLD.tier; -- Revert the tier change
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_tier_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.protect_tier_column();
