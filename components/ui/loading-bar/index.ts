'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isNavigating, setIsNavigating] = useState(false);
  
  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      minimum: 0.1,
      easing: 'ease',
      speed: 500,
    });
  }, []);

  useEffect(() => {
    setIsNavigating(true);
    NProgress.start();
    
    const timeoutId = setTimeout(() => {
      NProgress.done();
      setIsNavigating(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  return null;
}