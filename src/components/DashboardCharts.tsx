import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function DashboardCharts({ transactions }: { transactions: any[] }) {
  // 1. Prepare Pie Chart Data (Expenses by Category)
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = expenses.reduce((acc: any, t) => {
    const cat = t.category.toLowerCase();
    acc[cat] = (acc[cat] || 0) + Number(t.amount);
    return acc;
  }, {});
  
  const pieData = Object.keys(categoryTotals).map((key, index) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: categoryTotals[key],
    color: COLORS[index % COLORS.length]
  })).sort((a, b) => b.value - a.value);

  // 2. Prepare Line/Area Chart Data (Income vs Expense Trends over the last 6 months)
  // Aggregate by Month-Year 'Jan 2024'
  const monthlyDataMap = transactions.reduce((acc: any, t) => {
     const date = new Date(t.date);
     const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
     if (!acc[monthStr]) acc[monthStr] = { month: monthStr, income: 0, expense: 0, timestamp: date.getTime() };
     
     if (t.type === 'income') acc[monthStr].income += Number(t.amount);
     if (t.type === 'expense') acc[monthStr].expense += Number(t.amount);
     return acc;
  }, {});

  const trendData = Object.values(monthlyDataMap)
    .sort((a: any, b: any) => a.timestamp - b.timestamp)
    .slice(-6); // Only strictly last 6 months

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
      
      {/* Chart 1: Month-over-Month Income vs Expense */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">Savings Trends</h3>
        <div className="h-72 w-full">
           {trendData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <Tooltip 
                   formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 />
                 <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                 <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                 <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
               </AreaChart>
             </ResponsiveContainer>
           ) : (
             <div className="flex h-full items-center justify-center text-slate-400">Add transactions to see trends</div>
           )}
        </div>
      </div>

      {/* Chart 2: Category Breakdown Pie Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Expense Breakdown</h3>
        <div className="h-72 w-full flex-1 flex items-center justify-center relative">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  labelLine={false}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="text-slate-400">Add expenses to view breakdown</div>
          )}
        </div>
      </div>

    </div>
  );
}
