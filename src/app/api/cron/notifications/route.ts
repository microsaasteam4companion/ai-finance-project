import { adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

// This is designed to be triggered by a Vercel Cron job (daily)
export async function GET(req: Request) {
  try {
    // 1. Get all users
    const usersSnapshot = await adminDb.collection('users').get();
    
    if (usersSnapshot.empty) {
      return NextResponse.json({ message: "No users found." });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    // Simulate Daily Job
    console.log('\n[Cron] Running daily budget threshold monitor across all users...');
    let emailsSent = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // 2. Get budgets for this user
      const budgetsSnapshot = await adminDb.collection('users').doc(userId).collection('budgets').get();
      
      if (budgetsSnapshot.empty) continue;

      for (const budgetDoc of budgetsSnapshot.docs) {
        const budget = budgetDoc.data();
        
        // 3. Get transactions for this category this month
        const transactionsSnapshot = await adminDb.collection('users').doc(userId).collection('transactions')
          .where('category', '==', budget.category)
          .where('type', '==', 'expense')
          // Firestore doesn't support easy date string gte without ISO strings or Timestamps
          // Assuming 'date' is stored consistently
          .where('date', '>=', startOfMonth.toISOString().split('T')[0])
          .get();

        const totalSpend = transactionsSnapshot.docs.reduce((sum, t) => sum + Number(t.data().amount), 0);
        const percentage = (totalSpend / budget.limit_amount) * 100;

        if (percentage >= 100) {
           console.log(`\n====== 📧 MOCK EMAIL SENT ======`);
           console.log(`To: User ID ${userId}`);
           console.log(`Subject: 🚨 FinGenius Alert: ${budget.category} Budget Exceeded!`);
           console.log(`Body: You have spent ₹${totalSpend} on ${budget.category}, which is over your limit of ₹${budget.limit_amount}.`);
           console.log(`=================================\n`);
           emailsSent++;
        } else if (percentage >= 80) {
           console.log(`\n====== 📧 MOCK EMAIL SENT ======`);
           console.log(`To: User ID ${userId}`);
           console.log(`Subject: ⚠️ FinGenius Warning: Nearing ${budget.category} Limit`);
           console.log(`Body: You have consumed ${Math.round(percentage)}% of your ${budget.category} budget.`);
           console.log(`=================================\n`);
           emailsSent++;
        }
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
