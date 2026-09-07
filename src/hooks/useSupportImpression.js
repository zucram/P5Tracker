import { useEffect, useRef } from 'react';
import { trackEvent } from '../lib/analytics';

const viewedLocations = new Set();

export function useSupportImpression(location) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || viewedLocations.has(location) || typeof IntersectionObserver === 'undefined') return;
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(timer);
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || viewedLocations.has(location)) return;
      timer = setTimeout(() => {
        viewedLocations.add(location);
        trackEvent('support_card_view', { location });
        observer.disconnect();
      }, 1000);
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [location]);
  return ref;
}
