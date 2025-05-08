import React, { useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Layout(props) {
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const gtmScript = siteConfig.customFields?.gtmScript;

  useEffect(() => {
    if (typeof window !== 'undefined' && gtmScript) {
      const script = document.createElement('script');
      script.innerHTML = gtmScript;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      {typeof window !== 'undefined' && (
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TSMMZM4X"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
      )}
      <OriginalLayout {...props} />
    </>
  );
}
