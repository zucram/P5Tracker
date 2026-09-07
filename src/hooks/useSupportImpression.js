import { useEffect, useRef } from 'react';
import { trackEvent } from '../lib/analytics';

const viewedLocations = new Set();

export function useSupportImpression(location, game) {
  const ref = useRef(null);
  useEffect(() => {
    const key = `${game || 'royal'}:${location}`;
    if (!ref.current || viewedLocations.has(key) || typeof IntersectionObserver === 'undefined') return;
    let timer;
    let visible = false;
    const update = () => {
      clearTimeout(timer);
      if (!visible || document.hidden || viewedLocations.has(key)) return;
      timer = setTimeout(() => {
        viewedLocations.add(key);
        trackEvent(game === 'persona-3-reload' ? 'p3_support_card_view' : 'support_card_view', { location, ...(game ? { game } : {}) });
        observer.disconnect();
      }, 1000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      update();
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    document.addEventListener('visibilitychange', update);
    return () => { clearTimeout(timer); observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [location, game]);
  return ref;
}
