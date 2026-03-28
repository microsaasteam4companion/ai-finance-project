'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Script from 'next/script';

export default function UpvoteWidget() {
  const { user } = useAuth();
  const userId = user?.uid;
  const email = user?.email;
  
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    // Force hard remount for cleanup when identity changes
    setRemountKey(k => k + 1);
    
    // Proactive cleanup of existing floating elements
    // @ts-ignore
    if (window.__upvote_cleanup) window.__upvote_cleanup();
  }, [userId, email]);

  if (!user) return null;

  return (
    <div key={remountKey}>
      <div className="upvote-widget"
           data-application-id="69c16f424fa9731c0441a765"
           data-user-id={userId || ''}
           data-email={email || ''}
           data-position="right"
           data-theme="light"
           data-logo-url="/logo.png"         // Optional: your logo
           data-product-overview="FinGenius - AI Personal Finance Mentor" 
           data-about-text="Help us build the ultimate financial assistant."
           // @ts-ignore
           data-faqs='[{"question":"Is my data secure?","answer":"Yes, we use Google Firebase with bank-grade encryption."},{"question":"How is the health score calculated?","answer":"It uses our proprietary algorithm across 6 financial dimensions."}]'>
      </div>
      <Script src="https://upvote.entrext.com/widget.js" />
    </div>
  );
}
