import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// This is designed to be triggered by a Vercel Cron job (daily)
export async function GET(req: Request) {
  try {
    // Note: In a production environment with strict RLS, we would use an admin Service Role Key here.
    // For this MVP mock, we will query budgets generically.
    const { data: budgets } = await supabase.from('budgets').select('*');
    
    if (!budgets || budgets.length === 0) {
      return NextResponse.json({ message: "No budgets found to monitor." });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    
    // Simulate Daily Job
    console.log('\n[Cron] Running daily budget threshold monitor...');
    let emailsSent = 0;

    for (const budget of budgets) {
      const { data: tData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('category', budget.category)
        .eq('user_id', budget.user_id)
        .eq('type', 'expense')
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      const totalSpend = tData ? tData.reduce((sum, t) => sum + Number(t.amount), 0) : 0;
      const percentage = (totalSpend / budget.limit_amount) * 100;

      if (percentage >= 100) {
         // Mock sending Email via Resend/SendGrid
         console.log(`\n====== 📧 MOCK EMAIL SENT ======`);
         console.log(`To: User ID ${budget.user_id}`);
         console.log(`Subject: 🚨 FinGenius Alert: ${budget.category} Budget Exceeded!`);
         console.log(`Body: You have spent ₹${totalSpend} on ${budget.category}, which is over your limit of ₹${budget.limit_amount}. Please review your AI Coach for savings advice.`);
         console.log(`=================================\n`);
         emailsSent++;
      } else if (percentage >= 80) {
         console.log(`\n====== 📧 MOCK EMAIL SENT ======`);
         console.log(`To: User ID ${budget.user_id}`);
         console.log(`Subject: ⚠️ FinGenius Warning: Nearing ${budget.category} Limit`);
         console.log(`Body: You have consumed ${Math.round(percentage)}% of your ${budget.category} budget.`);
         console.log(`=================================\n`);
         emailsSent++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Daily notification job completed.", 
      emails_dispatched: emailsSent 
    });

  } catch(e: any) {
    console.error('[Cron] Error running notifications:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
