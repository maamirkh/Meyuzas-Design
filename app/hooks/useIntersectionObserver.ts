'use client';

import { useState, useEffect, RefObject, useMemo } from 'react';

interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

const useIntersectionObserver = (
  ref: RefObject<HTMLElement | null>,
  options: IntersectionObserverOptions = { threshold: 0.1, rootMargin: '0px', triggerOnce: true }
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observerOptions = useMemo(() => {
    return {
      threshold: options.threshold,
      rootMargin: options.rootMargin,
    };
  }, [options.threshold, options.rootMargin]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (options.triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      observerOptions
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, observerOptions, options.triggerOnce]);

  return isIntersecting;
};

export default useIntersectionObserver;
