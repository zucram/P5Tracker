import React, { useEffect, useState, useMemo } from 'react';
import { Heart, X, Coffee, Zap } from 'lucide-react';

const MESSAGES = {
  mission: {
    icon: Zap,
    color: "text-red-500",
    btn: "bg-red-600 hover:bg-red-500",
    variants: [
      { title: "Mission Update", text: "Another Palace secured! 🏰 If P5 Tracker helped your heist, consider supporting the dev." },
      { title: "Target Secured", text: "Making good progress? If the tracker is helping you save time, a small tip keeps it ad-free." },
      { title: "Route Confirmed", text: "Target confirmed and route secured! 🎭 Consider buying the dev a coffee to celebrate." },
      { title: "Heist Success", text: "The Treasure is within reach! 💎 If this guide made the infiltration easier, support is appreciated." },
      { title: "Mission Complete", text: "A flawless heist! 🃏 Your support helps us keep building tools for future Phantom Thieves." },
      { title: "Phantom Victory", text: "Mission complete! 🏆 If we've made your journey to the True Ending smoother, consider a small tip." },
      { title: "Hearts Changed", text: "Hearts changed, stats maxed. ❤️ If you're loving the app, support helps keep it online!" },
      { title: "Coffee Break", text: "Stealing hearts is hard work. ☕ Buy the dev a coffee to keep the updates flowing?" },
      { title: "Safe Room", text: "The Metaverse is dangerous, but our guide is safe. 🛡️ Support the project to keep it ad-free." },
      { title: "Ahead of Schedule", text: "Palace cleared with time to spare! ⏳ If we saved you a deadline, consider supporting the dev." }
    ]
  },
  casual: {
    icon: Coffee,
    color: "text-yellow-500",
    btn: "bg-yellow-600 hover:bg-yellow-500",
    variants: [
      { title: "Take Your Time", text: "Thanks for making us your companion. 👋 Enjoying the app? Buying a coffee keeps us ad-free." },
      { title: "Phantom Breather", text: "Taking a break? If you love the app, consider fueling the next update with a coffee." },
      { title: "Welcome Back", text: "Welcome back, Joker. 🃏 If the tracker is your go-to second screen, consider a small donation." },
      { title: "Daily Routine", text: "\"Take Your Time\" – but also support the dev if you can! ☕ Every bit helps." },
      { title: "System Check", text: "Checking the schedule again? 📅 Glad to be of service. Support keeps the updates coming!" },
      { title: "Social Bonds", text: "Building bonds and making memories. 🤝 If you like our \"Soft-Guide\" approach, let us know!" },
      { title: "Long Journey", text: "The journey is long, but you're doing great. 🚶‍♂️ Consider a tip if you find the app useful." },
      { title: "Tokyo Life", text: "Tokyo life is busy! 🚉 If we're helping you manage your stats, consider a coffee for the dev." },
      { title: "Project Support", text: "Another session in the books. 📖 Your support ensures P5 Tracker stays free for everyone." },
      { title: "Friendly Nudge", text: "Just a friendly reminder: we are 100% community-funded. 💖 Thanks for using the app!" }
    ]
  },
  value: {
    icon: Heart,
    color: "text-blue-500",
    btn: "bg-blue-600 hover:bg-blue-500",
    variants: [
      { title: "Phantom Support", text: "You've been tracking a lot! 📝 If we saved you time today, a small tip goes a long way." },
      { title: "Dedicated Thief", text: "Wow, look at those stats! Thanks for being a power user. Consider supporting if you can." },
      { title: "Data Mastery", text: "Consistency is key! 🔑 You've ticked off so many tasks. Support helps us add more features." },
      { title: "Time Optimization", text: "Time is the ultimate currency. ⏳ If we saved you some today, consider a small reciprocal tip." },
      { title: "Stat Grinding", text: "Maxing out those social stats? 🧠 Proficiency, Charm, and maybe a little support for the dev?" },
      { title: "High Ranking", text: "Your progress is impressive! 📈 If the tracker is an essential tool for you, consider a donation." },
      { title: "The 100% Run", text: "Dedicated to the cause! ✊ 100% completion is closer than ever. Support helps us get there." },
      { title: "Privacy First", text: "Your progress stays in your browser. If the tracker helps your playthrough, an optional tip supports its maintenance." },
      { title: "Team Building", text: "Building the ultimate Persona team? 🐲 If our resources helped, a coffee would be amazing." },
      { title: "Power User", text: "Finding the tracker useful? An optional tip helps support fixes and updates." }
    ]
  }
};

export function SupportToast({ show, type, onDismiss, onSupport }) {
  const [visible, setVisible] = useState(false);

  // Pick a random variant when the toast is shown
  const content = useMemo(() => {
    if (!show) return null;
    const category = MESSAGES[type] || MESSAGES.mission;
    const variantIndex = Math.floor(Math.random() * category.variants.length);
    const variant = category.variants[variantIndex];
    return { ...category, ...variant };
  }, [show, type]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setVisible(true), 100); // Small delay to allow mount
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show]);

  // Keep it mounted while fading out (use previous content if hiding)
  if (!show && !visible) return null;
  
  // If fading out, we need to render SOMETHING, so we fall back to a safe default if content is null.
  // But usually content is memoized based on 'show', so when 'show' becomes false, content becomes null.
  // We need to persist the content during the exit animation.
  // Actually, let's just not reset content on hide. 
  // Refactor: Move randomness to a separate state that only updates when show=true.
  
  return (
    <ToastUI 
      visible={visible} 
      type={type} 
      onDismiss={onDismiss} 
      onSupport={onSupport} 
    />
  );
}

// Sub-component to handle state persistence during exit animation
function ToastUI({ visible, type, onDismiss, onSupport }) {
  const [activeContent, setActiveContent] = useState(null);

  useEffect(() => {
    if (visible) {
      const category = MESSAGES[type] || MESSAGES.mission;
      const variant = category.variants[Math.floor(Math.random() * category.variants.length)];
      setActiveContent({ ...category, ...variant });
    }
  }, [visible, type]);

  if (!activeContent) return null;

  const Icon = activeContent.icon;

  return (
    <div className={`fixed bottom-20 md:bottom-8 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8 z-[60] w-[92vw] max-w-sm transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
      <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${activeContent.btn.split(' ')[0]}`} />
        
        <div className={`p-2.5 md:p-3 rounded-xl bg-black/50 h-fit border border-neutral-800 ${activeContent.color}`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>

        <div className="flex-1 pr-2">
          <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-wider mb-1">{activeContent.title}</h4>
          <p className="text-[11px] md:text-xs text-neutral-400 font-medium leading-tight md:leading-relaxed mb-3">{activeContent.text}</p>
          
          <button 
            onClick={onSupport}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${activeContent.btn}`}
          >
            <Heart className="w-3 h-3 fill-current" /> Support
          </button>
        </div>

        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1.5 text-neutral-600 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
