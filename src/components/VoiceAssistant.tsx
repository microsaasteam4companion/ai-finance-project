'use client';

import { useState, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function VoiceAssistant({ onActionComplete }: { onActionComplete?: () => void }) {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Your browser doesn't natively support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English optimizations

    recognition.onstart = () => {
      setIsListening(true);
      toast('Listening...', { icon: '🎙️', id: 'voice-toast' });
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setIsProcessing(true);
      toast.loading(`Processing: "${transcript}"`, { id: 'voice-toast' });

      try {
        const res = await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: transcript, userId: user?.id })
        });
        
        const data = await res.json();
        setIsProcessing(false);

        if (data.error) {
           toast.error('Voice failed: ' + data.error, { id: 'voice-toast' });
        } else {
           toast.success(data.reply, { id: 'voice-toast', duration: 4000 });
           
           // Speak it out loud
           if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(data.reply);
              utterance.lang = 'en-IN';
              window.speechSynthesis.speak(utterance);
           }

           if (onActionComplete && data.action === 'add_transaction') {
              onActionComplete();
           }
        }

      } catch (err) {
        setIsProcessing(false);
        toast.error('Server error processing voice.', { id: 'voice-toast' });
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setIsProcessing(false);
      toast.error('Voice recognition failed: ' + event.error, { id: 'voice-toast' });
    };

    recognition.onend = () => {
      if (isListening) setIsListening(false);
    };

    recognition.start();
  };

  if (!user) return null;

  return (
    <button 
      onClick={isListening ? () => {} : startListening}
      disabled={isProcessing}
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all z-50 ${isListening ? 'bg-red-500 scale-110 shadow-red-500/50 animate-pulse' : 'bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:scale-105 shadow-indigo-500/30'} text-white border-[3px] border-white`}
      title={isListening ? "Listening..." : "Tap to Speak (e.g., 'Add 300 for dinner')"}
    >
      {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Mic className={`w-7 h-7 ${isListening ? 'animate-bounce' : ''}`} />}
    </button>
  );
}
