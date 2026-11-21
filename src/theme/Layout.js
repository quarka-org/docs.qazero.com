import React, { useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';

// 2026-11-21：ユーザーガイドは https://qazero.com/guide/ へ移転した。
// 旧ページ（/docs/user-manual/… と /ja/docs/user-manual/…）は、新しいガイドの同じ記事へ転送する。
// 記事の URL は「章/記事」の形をそのまま引き継いでいる。旧ページの原稿はこのリポジトリに凍結して残す（ここでは編集しない）。
const GUIDE = 'https://qazero.com/guide/';
const CHAPTERS = ['deployment', 'tracking-setup', 'using', 'support', 'terms'];
const RENAMED = {'start-guide': 'tracking-setup', 'screens-operations': 'using'};

function guideUrl(pathname) {
  const m = pathname.match(/^\/(?:ja\/)?docs\/user-manual(?:\/(.*?))?\/?$/);
  if (!m) return null;
  const parts = (m[1] || '').split('/').filter(Boolean);
  if (parts.length === 0) return GUIDE + 'manual/';
  if (parts[0] === 'introduction') return GUIDE + 'introduction/overview/';
  const chapter = RENAMED[parts[0]] || parts[0];
  if (!CHAPTERS.includes(chapter)) return GUIDE + 'manual/';
  return GUIDE + chapter + '/' + (parts[1] ? parts[1] + '/' : '');
}

export default function Layout(props) {
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const gtmScript = siteConfig.customFields?.gtmScript;
  const movedTo = guideUrl(location.pathname);

  useEffect(() => {
    if (movedTo && typeof window !== 'undefined') {
      window.location.replace(movedTo + (location.hash || ''));
    }
  }, [movedTo]);

  useEffect(() => {
    if (typeof window !== 'undefined' && gtmScript) {
      const script = document.createElement('script');
      script.innerHTML = gtmScript;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      {movedTo && (
        <Head>
          <meta httpEquiv="refresh" content={`0; url=${movedTo}`} />
          <link rel="canonical" href={movedTo} />
          <meta name="robots" content="noindex" />
        </Head>
      )}
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
