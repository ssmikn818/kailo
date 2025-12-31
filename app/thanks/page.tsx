'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ThanksPage() {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Meta Pixel Lead 이벤트 전송
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f1eb] text-[#2c2416] font-sans flex items-center justify-center px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 로고 */}
        <div className="flex justify-center pt-8 md:pt-12">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image
              src="/images/KaiLo_로고_원_무배경.png"
              alt="KaiLo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* 메인 문구 */}
        <div className="space-y-4 pt-4 md:pt-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            KaiLo에 오신 걸 환영해요.
          </h1>
          <div className="pt-8 md:pt-12">
            <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
              당신의 생각이 궁금했습니다.
            </p>
          </div>
          <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
            조금만 기다리면 이메일로 도착해요.
          </p>
          <p className="text-base md:text-lg text-[#5a5248] italic">
            (스팸함도 한번 확인해주세요!)
          </p>
          <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed mt-6">
            2026년엔 우리가 진짜 원하는 방향으로 :)
          </p>
          <p className="text-base md:text-lg text-[#2c2416] font-medium mt-4">
            - KaiLo
          </p>
        </div>

        {/* GIF 이미지 - 이미지가 있을 때만 표시 */}
        {!imageError && (
          <div className="flex justify-center my-8">
            <div className="relative w-full max-w-md h-64 md:h-80">
              <Image
                src="/images/bill-murray-celebration.gif"
                alt=""
                fill
                className="object-contain rounded-lg"
                unoptimized
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        )}

        {/* 스레드 링크 */}
        <div className="pt-8">
          <a
            href="https://threads.net/@talk.kailo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[#5a5248] hover:text-[#2c2416] text-base md:text-lg transition-colors duration-200 font-medium"
          >
            스레드 구경하기 👉 <span className="text-[#2c2416]">@talk.kailo</span>
          </a>
        </div>
      </div>
    </div>
  );
}

