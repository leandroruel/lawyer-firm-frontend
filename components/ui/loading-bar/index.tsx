'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Componente interno que usa useSearchParams
function LoadingBarContent() {
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

// Componente principal que envolve o conteúdo em um Suspense
export default function LoadingBar() {
  return (
    <Suspense fallback={null}>
      <LoadingBarContent />
    </Suspense>
  );
} 