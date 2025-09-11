import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.1,
      easing: 'ease',
      speed: 500,
      template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
    });

    // Start NProgress when pathname or searchParams change (indicating a route change)
    NProgress.start();

    // Clean up NProgress when the component unmounts or before the next effect runs
    return () => {
      NProgress.done();
    };
  }, [pathname, searchParams]); // Re-run effect when pathname or searchParams change

  return null;
}