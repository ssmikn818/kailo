import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "질문으로 나를 세우다, KaiLo",
  description: "남의 목표가 아닌 진짜 내 삶을 설계하는 시간, KaiLo",
  keywords: ["KaiLo", "질문", "자기계발", "만다라트", "2026", "목표설정", "AI 프롬프트"],
  authors: [{ name: "KaiLo" }],
  icons: {
    icon: [
      { url: '/images/KaiLo_로고_원_무배경.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/KaiLo_로고_원_무배경.png', type: 'image/png', sizes: '64x64' },
      { url: '/images/KaiLo_로고_원_무배경.png', type: 'image/png', sizes: '96x96' },
      { url: '/images/KaiLo_로고_원_무배경.png', type: 'image/png', sizes: '128x128' },
    ],
    shortcut: '/images/KaiLo_로고_원_무배경.png',
    apple: [
      { url: '/images/KaiLo_로고_원_무배경.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "질문으로 나를 세우다, KaiLo",
    description: "남의 목표가 아닌 진짜 내 삶을 설계하는 시간, KaiLo",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kailo.kr",
    siteName: "KaiLo",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kailo.kr'}/images/KaiLo_로고_원_무배경.png`,
        width: 1200,
        height: 1200,
        alt: 'KaiLo 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "질문으로 나를 세우다, KaiLo",
    description: "남의 목표가 아닌 진짜 내 삶을 설계하는 시간, KaiLo",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://kailo.kr'}/images/KaiLo_로고_원_무배경.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixelId = "856078390546701";

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
