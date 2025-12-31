'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import InteractiveSteps from './components/InteractiveSteps';
import TestimonialsCarousel from './components/TestimonialsCarousel';

export default function Home() {
  useEffect(() => {
    // PostHog 초기화
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (typeof window !== 'undefined' && posthogKey) {
      const script = document.createElement('script');
      script.src = 'https://app.posthog.com/static/array.js';
      script.async = true;
      script.onload = () => {
        if (window.posthog && posthogKey) {
          window.posthog.init(posthogKey, {
            api_host: 'https://app.posthog.com',
            loaded: (posthog: any) => {
              if (process.env.NODE_ENV === 'development') console.log('PostHog loaded');
            }
          });
        }
      };
      document.head.appendChild(script);
    }

    // 섹션 도달 감지
    const sections = ['hero', 'problem', 'contrast', 'solution', 'the-log', 'testimonials'];
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && typeof window !== 'undefined' && (window as any).posthog) {
                (window as any).posthog.capture(`${sectionId}_section_view`, {
                  section: sectionId,
                  timestamp: Date.now(),
                });
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(section);
      }
    });
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('lead_magnet_signup', {
        email: email,
        source: 'landing_page'
      });
    }

    const zapierUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL;
    if (!zapierUrl) {
      alert('서비스가 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const response = await fetch(zapierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          source: 'KaiLo Landing Page',
          lead_magnet: 'AI 소크라테스: 나를 파고드는 질문 프롬프트 키트'
        }),
      });

      if (response.ok) {
        alert('감사합니다! 이메일을 확인해주세요.');
        (e.target as HTMLFormElement).reset();
      } else {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Zapier webhook error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1eb] text-[#2c2416] font-sans">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 lg:px-12 py-3 md:py-4 bg-[#f5f1eb]/98 backdrop-blur-md border-b border-[#e8e0d6]/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="inline-block">
            <div className="relative w-40 h-12 md:w-48 md:h-14 lg:w-56 lg:h-16">
              <Image
                src="/images/KaiLo_로고_텍스트_가로_무배경.png"
                alt="KAILO"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>
          <a
            href="https://tally.so/r/BzKrZ7"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 bg-[#2c2416] text-[#f5f1eb] rounded-full text-xs md:text-sm lg:text-base font-semibold hover:bg-[#3d3428] transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).posthog) {
                (window as any).posthog.capture('header_cta_click', { cta: 'KaiLo 모임 대기 신청' });
              }
            }}
          >
            KaiLo 모임 대기 신청
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="hero"
        className="relative flex items-center justify-center px-4 md:px-8 pt-32 md:pt-40 pb-20 md:pb-32"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Logo Circle */}
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <Image
                src="/images/KaiLo_로고_원_무배경.png"
                alt="KaiLo Logo"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
          </div>

          {/* Right: Title and CTA */}
          <div className="space-y-6 md:space-y-8 order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              질문으로 나를 세우다,
              <br />
              <span className="text-5xl md:text-6xl lg:text-7xl">KaiLo</span>
            </h2>
            <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
              뻔한 공감보다 나를 파고드는 서늘한 질문을 만날 때,
              <br />
              KaiLo에서 내 삶의 진짜 방향을 마주하게 됩니다.
            </p>
            <a
              href="https://tally.so/r/BzKrZ7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-8 py-4 bg-[#2c2416] text-[#f5f1eb] rounded-full text-lg font-medium hover:bg-[#3d3428] transition-all shadow-md hover:shadow-lg"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).posthog) {
                  (window as any).posthog.capture('hero_cta_click', { cta: 'KaiLo 모임 대기 신청' });
                }
              }}
            >
              KaiLo 모임 대기 신청
            </a>
          </div>
        </div>
      </section>

      {/* Main Question Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12">
            당신의 생각은 어디에서 자라나요?
          </h2>
        </div>
      </section>

      {/* Problem Sections with Images */}
      <section 
        id="problem"
        className="py-16 md:py-24 px-4 md:px-8 bg-[#faf8f5]"
      >
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
          {/* Problem 1: 가벼운 대화 */}
          <div 
            id="thirst-section"
            className="flex flex-col md:flex-row items-center gap-12 md:gap-20 py-8 md:py-12"
          >
            <div className="flex-1 order-2 md:order-1 space-y-6 md:space-y-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed text-[#2c2416]">
                "가십만 넘치는 대화 속에서,
                <br />
                내 생각의 밑바닥을 들여다본 적이 언제인가요?"
              </h2>
              <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                진지한 대화를 나누고 싶지만,
                <br />
                현실은 입과 가십, 감정 토요뿐.
                <br />
                <span className="font-semibold text-[#2c2416]">KaiLo는 생각하는 사람들의 갈증에서 출발했습니다.</span>
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2 flex justify-center px-4 md:px-8">
              <motion.div 
                className="relative w-full max-w-md h-80 md:h-96 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).posthog) {
                    (window as any).posthog.capture('thirst_section_image_click', {
                      section: 'thirst_section',
                      image: 'undraw_hacker-mind_j91b'
                    });
                  }
                }}
              >
                <Image
                  src="/images/undraw_hacker-mind_j91b.svg"
                  alt="깊이 있는 생각"
                  fill
                  className="object-contain rounded-lg transition-all duration-300 group-hover:scale-105"
                  style={{ 
                    filter: 'sepia(15%) saturate(85%) brightness(98%) opacity(0.95)',
                  }}
                  onLoad={() => {
                    if (typeof window !== 'undefined' && (window as any).posthog) {
                      (window as any).posthog.capture('reflection_storage_view', {
                        section: 'thirst_section',
                        image: 'undraw_hacker-mind_j91b',
                        timestamp: Date.now(),
                      });
                    }
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Problem 2: 눈치 보며 공감 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="flex-1 order-2 md:order-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed mb-6">
                "영혼 없는 '저도요' 뒤에 숨어,
                <br />
                진짜 던지고 싶은 질문을 삼키고 있지는 않나요?"
              </h2>
              <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                질문이 불편한 사회에서
                <br />
                자기 생각을 드러내는 일이 어색해졌죠.
                <br />
                <span className="font-semibold text-[#2c2416]">KaiLo에서 질문은 대화의 시작입니다.</span>
              </p>
            </div>
            <div className="flex-1 order-1 md:order-1 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Image
                  src="/images/undraw_conversation_15p8.svg"
                  alt="대화"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Problem 3: 세상은 빠르게 변하는데 */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 order-2 md:order-1">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed mb-6">
                "세상의 속도에 내 기준을 맞추느라,
                <br />
                나만의 판단 기준이 고장 난 건 아닐까요?"
              </h2>
              <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                KaiLo에서는 놓쳐버린 '예'를 다시 붙잡고,
                <br />
                비움 → 흔들림 → 자각 → 발견을 통해
                <br />
                <span className="font-semibold text-[#2c2416]">'진짜 내 생각'을 처음 만납니다.</span>
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Image
                  src="/images/undraw_memory-storage_x93l.svg"
                  alt="아이디어"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Problem 4: 토론을 하고 싶어도 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="flex-1 order-2 md:order-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed mb-6">
                "이기기 위해 상처 주는 토론 말고,
                <br />
                내 생각이 기분 새롭게 흔들리는 대화가 필요했나요?"
              </h2>
              <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                KaiLo는 말 잘하는 사람이 이기는 토론이 아니라,
                <br />
                서로를 발전시키는 공진화적 토론을 지향합니다.
                <br />
                <span className="font-semibold text-[#2c2416]">'내가 바뀌는 순간'을 경험하세요.</span>
              </p>
            </div>
            <div className="flex-1 order-1 md:order-1 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Image
                  src="/images/undraw_collaborating_mayd.svg"
                  alt="협업"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Contrast */}
      <section 
        id="contrast"
        className="py-12 md:py-20 px-8 md:px-16 lg:px-24 bg-black text-white"
      >
        <div className="max-w-[90rem] mx-auto text-center space-y-6 md:space-y-8">
          {/* 첫 번째 문장: 숫자 대비 강조 */}
          <div className="text-xl md:text-2xl lg:text-3xl leading-relaxed">
            우리는 하루에{' '}
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-300 inline-block mx-2">
              300m
            </span>
            의 스크롤을 내리지만, 단{' '}
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-red-400 inline-block mx-2">
              1cm
            </span>
            도 내면으로 들어가지 못합니다.
          </div>
          
          {/* 두 번째 문장: 해결책 강조 */}
          <div className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-100 italic font-light">
            <span className="font-normal not-italic text-white">KaiLo</span>는{' '}
            <span className="font-normal not-italic">1초</span> 만에 지나칠 문장의 여운을 온전히 감각하는 곳입니다.
          </div>
        </div>
      </section>

      {/* Interactive Steps Section */}
      <section 
        id="solution"
        className="py-20 md:py-32 px-4 md:px-8 bg-[#f5f1eb]"
      >
        <InteractiveSteps />
      </section>

      {/* Section B: The Log */}
      <section 
        id="the-log"
        className="py-8 md:py-12 px-8 md:px-16 lg:px-24 bg-[#faf8f5] relative"
      >
        {/* 화이트보드 이미지 - 섹션 전체 배경 (헤더 제외) */}
        <div className="absolute inset-0 top-24 md:top-32 overflow-hidden pointer-events-none">
            <Image
            src="/images/KakaoTalk_20251222_172146700_06.jpg"
            alt="화이트보드 기록"
            fill
            className="object-cover"
            style={{ 
              filter: 'brightness(1.1) contrast(0.9)',
              opacity: 0.12,
              objectPosition: 'center center'
            }}
          />
        </div>

        <div className="max-w-[90rem] mx-auto relative z-10">
          {/* 섹션 헤더 */}
          <div className="pt-20 md:pt-24 mb-12 md:mb-16 text-center relative z-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#2c2416]">
              실제로 우리가 마주했던 치열한 질문들
            </h2>
          </div>

          {/* 질문들 - 앞에 배치 */}
          <div className="relative z-10 space-y-12 md:space-y-16">
            {/* AI 대체 */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 justify-center max-w-5xl mx-auto">
              <div className="relative bg-white rounded-2xl p-4 md:p-5 flex-shrink-0 w-full md:w-[420px] shadow-md border border-gray-100 ml-4 md:ml-0" style={{ paddingLeft: '1.5rem' }}>
                <div className="absolute -left-3 top-5 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[12px] border-transparent border-r-white"></div>
                <div className="absolute -left-4 top-[18px] w-0 h-0 border-t-[14px] border-b-[14px] border-r-[14px] border-transparent border-r-gray-100"></div>
                <h3 className="text-lg md:text-xl font-semibold text-[#2c2416] leading-relaxed whitespace-nowrap text-center">
                  "내 직업이 AI로 대체될까?"
                </h3>
              </div>
              <div className="flex-1 max-w-xl text-left">
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed mb-4">
                  막연한 두려움 뒤에 숨은 진짜 질문은 무엇일까.
                  <br />
                  단순히 대체되는 것을 막는 게 아니라,
                  <br />
                  AI 시대에 나만의 가치를 찾는 방법을 함께 탐구했어요.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">AI 대체</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">직업의 미래</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">나만의 가치</span>
                </div>
              </div>
            </div>

            {/* 높은 기준 */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 justify-center max-w-5xl mx-auto">
              <div className="relative bg-white rounded-2xl p-4 md:p-5 flex-shrink-0 w-full md:w-[420px] shadow-md border border-gray-100 ml-4 md:ml-0" style={{ paddingLeft: '1.5rem' }}>
                <div className="absolute -left-3 top-5 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[12px] border-transparent border-r-white"></div>
                <div className="absolute -left-4 top-[18px] w-0 h-0 border-t-[14px] border-b-[14px] border-r-[14px] border-transparent border-r-gray-100"></div>
                <h3 className="text-lg md:text-xl font-semibold text-[#2c2416] leading-relaxed whitespace-nowrap text-center">
                  "나에게 거는 높은 기대는 고통일까?"
                </h3>
              </div>
              <div className="flex-1 max-w-3xl text-left">
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed mb-4">
                  완벽주의의 함정에서 벗어나, 나만의 기준을 다시 세우는 과정을 함께했어요.
                  <br />
                  타인의 기준이 아닌, 내가 정한 기준의 의미를 되묻는 시간이었어요.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">높은 기준</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">완벽주의</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">나만의 기준</span>
                </div>
              </div>
            </div>

            {/* 자유 vs 안정 */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 justify-center max-w-5xl mx-auto">
              <div className="relative bg-white rounded-2xl p-4 md:p-5 flex-shrink-0 w-full md:w-[420px] shadow-md border border-gray-100 ml-4 md:ml-0" style={{ paddingLeft: '1.5rem' }}>
                <div className="absolute -left-3 top-5 w-0 h-0 border-t-[12px] border-b-[12px] border-r-[12px] border-transparent border-r-white"></div>
                <div className="absolute -left-4 top-[18px] w-0 h-0 border-t-[14px] border-b-[14px] border-r-[14px] border-transparent border-r-gray-100"></div>
                <h3 className="text-lg md:text-xl font-semibold text-[#2c2416] leading-relaxed whitespace-nowrap text-center">
                  "자유와 안정 사이의 균형점은 어디일까?"
                </h3>
              </div>
              <div className="flex-1 max-w-xl text-left">
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed mb-4">
                  재정적 불안을 외면할 수 없는 현실 속에서,
                  <br />
                  진짜 자유가 무엇인지, 안정이란 무엇인지 함께 질문했어요.
                  <br />
                  두 가지를 대립으로 보지 않고, 새로운 가능성을 찾는 대화였어요.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">자유 vs 안정</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">재정적 불안</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-[#5a5248] border border-[#e8e0d6]">균형점</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section: The Filter - Don't / Come */}
      <section 
        id="the-filter"
        className="py-20 md:py-32 px-8 md:px-16 lg:px-24 bg-[#faf8f5]"
      >
        <div className="max-w-[90rem] mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#2c2416]">
              누구와 사유를 나눌 것인가
            </h2>
            <p className="text-base md:text-lg text-[#5a5248] mt-4">
              KaiLo는 질문의 무게를 견디고 자기 존재를 재설계할 의지가 있는 분들로만 벙커의 밀도를 채웁니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* 좌측: 정중히 사양합니다 */}
            <div className="bg-white rounded-lg p-8 md:p-10 border-l-4 border-red-200">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#2c2416]">
                정중히 사양합니다
              </h3>
              <ul className="space-y-4">
                <li className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  쉽고 빠르게 정답만 얻으려는 분
                </li>
                <li className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  내 생각이 흔들리는 것을 경계하는 분
                </li>
                <li className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  '좋아요'라는 안전한 대화에만 머물고 싶은 분
                </li>
                <li className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  지식을 수집하는 것만으로 만족하는 분
                </li>
              </ul>
            </div>

            {/* 우측: 이런 분만 모십니다 */}
            <div className="bg-[#2c2416] rounded-lg p-8 md:p-10 border-l-4 border-yellow-400">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                이런 분만 모십니다
              </h3>
              <ul className="space-y-4">
                <li className="text-lg md:text-xl text-[#f5f1eb] leading-relaxed">
                  하나의 질문을 집요하게 파고들 준비가 된 분
                </li>
                <li className="text-lg md:text-xl text-[#f5f1eb] leading-relaxed">
                  자신의 생각을 유연하게 다듬으며 성장하고 싶은 분
                </li>
                <li className="text-lg md:text-xl text-[#f5f1eb] leading-relaxed">
                  서늘한 질문으로 본연의 목소리를 확인하고 싶은 분
                </li>
                <li className="text-lg md:text-xl text-[#f5f1eb] leading-relaxed">
                  사유가 실제 삶의 변화로 이어지길 바라는 분
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* Founder Section */}
      <section 
        id="founder"
        className="py-24 md:py-36 px-8 md:px-16 lg:px-24 bg-[#faf8f5] relative"
      >
        {/* 배경 이미지 - 연하게 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/새벽 어스름_KakaoTalk_20251228_215657210.jpg"
            alt="새벽 어스름"
            fill
            className="object-cover"
            style={{ 
              filter: 'brightness(1.1) contrast(0.9)',
              opacity: 0.08,
            }}
          />
        </div>
        
        <div className="max-w-[90rem] mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-[#2c2416] leading-relaxed">
              "지식 쇼핑은 끝났습니다. 이제 당신이라는 존재를 재설계할 시간입니다."
            </h2>
          </div>

          <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                우리는 하루 종일 타인의 생각을 소비합니다.
                <br />
                알고리즘이 짜준 편리함 속에서 '나'라는 주체는 점점 희미해지죠.
                <br />
                저는 깨달았습니다. 인간의 본질은 결국 소프트웨어고, 업데이트되지 않는 생각은 낡은 매뉴얼일 뿐이라는 것을요.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                KaiLo는 당신에게 정답을 주지 않습니다.
                <br />
                대신 디지털은 절대 줄 수 없는 <strong className="text-[#2c2416] font-semibold italic">'불편한 밀도의 질문'</strong>을 던집니다.
                <br />
                생각이 흔들리는 날 것의 감각을 즐기세요. 그 무너진 자리에서 비로소 당신만의 새로운 세계관이 창조됩니다.
              </p>
            </div>

            <div className="pt-10 md:pt-12 border-t border-[#e8e0d6]">
              <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                단순한 참가자를 찾는 게 아닙니다.
                <br />
                질문으로 자기 삶을 재설계할 동료를 찾습니다.
                <br />
                당신이 새롭게 정의되는 그 모든 시작을 함께하고 싶습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: My 2026 Strategy Kit */}
      <section 
        id="strategy-kit"
        className="py-20 md:py-32 px-8 md:px-16 lg:px-24 bg-[#faf8f5]"
      >
        <div className="max-w-[90rem] mx-auto">
          {/* 상단 메인 타이틀 */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-[#2c2416]">
              [무료 증정] KaiLo의 밀도를 직접 경험할 멤버를 모집합니다.
            </h2>
          </div>

          {/* 중간 본문 카피 */}
          <div className="max-w-4xl mx-auto mb-12 md:mb-16 space-y-6">
            <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
              지금 모임 대기 신청을 완료하신 분들께만,<br />
              오프라인 참가자 전용 [2026 커스텀 만다라트 세트]를 전송해 드립니다.
            </p>
            <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
              도구가 똑똑해져도 인생의 방향은 내가 정해야 합니다.<br />
              KaiLo가 제안하는 사유의 방식을 간접적으로 경험해보며,<br />
              혼자서도 질문에 답하는 가벼운 사유를 통해 최적화된 2026년을 설계해 보세요.
            </p>
            <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
              프롬프트와 만다라트는 도구일 뿐, 당신의 답을 대신 찾아주지 않습니다.<br />
              다만 당신이 스스로 답을 내릴 수 있을 때까지 집요하게 질문할 뿐입니다.<br />
              자신의 삶을 직접 대면할 준비가 된 분들은 대기 신청하시고<br />
              [2026년 커스텀 만다라트 프롬프트 & 노션 템플릿 세트]를 받아가세요.
            </p>
          </div>

          {/* 중앙 영상/이미지 영역 */}
          <div className="max-w-5xl mx-auto mb-12 md:mb-16">
            <div className="flex justify-center">
              {/* 비디오: 노션 템플릿 화면 */}
              <div className="relative w-full max-w-4xl h-96 md:h-[600px] bg-white rounded-lg border border-[#e8e0d6] overflow-hidden">
                <video
                  src="/images/2026 커스텀 만다라트 프롬프트 & 템플릿1.mp4"
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>

          {/* 하단 CTA 버튼 */}
          <div className="text-center">
            <a
              href="https://tally.so/r/BzKrZ7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-5 bg-[#2c2416] text-[#f5f1eb] rounded-full text-lg md:text-xl font-medium hover:bg-[#3d3428] transition-all shadow-lg hover:shadow-xl"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).posthog) {
                  (window as any).posthog.capture('strategy_kit_cta_click', {
                    cta: 'KaiLo 모임 대기 신청',
                    link: 'https://tally.so/r/BzKrZ7'
                  });
                }
              }}
            >
              KaiLo 모임 대기 신청
            </a>
          </div>
        </div>
      </section>

      {/* Q&A Section */}
      <section 
        id="qa"
        className="py-20 md:py-32 px-8 md:px-16 lg:px-24 bg-[#faf8f5]"
      >
        <div className="max-w-[90rem] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#2c2416]">
              자주 묻는 질문
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
            {/* Q1 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#2c2416] flex-shrink-0">Q:</span>
                <p className="text-lg md:text-xl text-[#2c2416] font-semibold leading-relaxed">
                  "그냥 모여서 수다 떠는 거 아닌가요? 일반적인 대화랑 뭐가 달라요?"
                </p>
              </div>
              <div className="flex items-start gap-4 ml-8 md:ml-12">
                <span className="text-2xl md:text-3xl font-bold text-[#5a5248] flex-shrink-0">A:</span>
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  KaiLo는 단순한 친목이나 지식 전달을 목적으로 하지 않습니다. 책은 핵심 도구가 아니며, 별도의 독서도 필요 없습니다. 오직 '질문'을 통해 흩어져 있던 당신의 생각을 단단한 '기준'으로 벼려내는 설계의 시간입니다.
                </p>
              </div>
            </div>

            {/* Q2 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#2c2416] flex-shrink-0">Q:</span>
                <p className="text-lg md:text-xl text-[#2c2416] font-semibold leading-relaxed">
                  "저... 낯가림이 심한데 가서 말 한마디 못 하고 오는 건 아니겠죠?"
                </p>
              </div>
              <div className="flex items-start gap-4 ml-8 md:ml-12">
                <span className="text-2xl md:text-3xl font-bold text-[#5a5248] flex-shrink-0">A:</span>
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  걱정 마세요. KaiLo는 말을 잘하는 사람을 뽑는 대회가 아닙니다. 오히려 침묵 속에서 자기 생각을 깊게 고르는 분들을 환영합니다. 말을 뱉기 전, 당신의 사유가 정리될 때까지 충분히 기다려 드립니다.
                </p>
              </div>
            </div>

            {/* Q3 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#2c2416] flex-shrink-0">Q:</span>
                <p className="text-lg md:text-xl text-[#2c2416] font-semibold leading-relaxed">
                  "질문을 받는 게 조금 무섭기도 해요. 공격받는 느낌이면 어떡하죠?"
                </p>
              </div>
              <div className="flex items-start gap-4 ml-8 md:ml-12">
                <span className="text-2xl md:text-3xl font-bold text-[#5a5248] flex-shrink-0">A:</span>
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  KaiLo의 질문은 상대를 이기기 위한 공격이 아닙니다. 서로의 논리가 기분 좋게 흔들리도록 돕는 '건설적인 자극'입니다. 안전한 환경에서 당신의 소프트웨어가 업데이트되는 즐거움을 느끼게 될 거예요.
                </p>
              </div>
            </div>

            {/* Q4 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#2c2416] flex-shrink-0">Q:</span>
                <p className="text-lg md:text-xl text-[#2c2416] font-semibold leading-relaxed">
                  "모임 한 번 한다고 진짜 인생이 바뀔까요?"
                </p>
              </div>
              <div className="flex items-start gap-4 ml-8 md:ml-12">
                <span className="text-2xl md:text-3xl font-bold text-[#5a5248] flex-shrink-0">A:</span>
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  한 번에 모든 게 바뀌지는 않겠지만, '질문하는 감각'은 남습니다. 모임이 끝나고 손에 쥐어지는 '나만의 판단 기준 리스트'가 당신의 일상을 조금씩 재설계하기 시작할 겁니다.
                </p>
              </div>
            </div>

            {/* Q5 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#2c2416] flex-shrink-0">Q:</span>
                <p className="text-lg md:text-xl text-[#2c2416] font-semibold leading-relaxed">
                  "준비물이나 미리 공부해야 할 게 있나요?"
                </p>
              </div>
              <div className="flex items-start gap-4 ml-8 md:ml-12">
                <span className="text-2xl md:text-3xl font-bold text-[#5a5248] flex-shrink-0">A:</span>
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed">
                  열린 마음 하나면 충분합니다. 정답을 찾으려는 강박은 집에 두고 오셔도 됩니다. KaiLo가 준비한 질문들을 따라오다 보면, 어느새 당신만의 답을 적어 내려가는 자신을 발견하게 될 거예요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto text-center space-y-8 md:space-y-12">
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Ask.</h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Shake.</h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Meet yourself.</h2>
          </div>
          <p className="text-lg md:text-xl text-[#5a5248] mt-8">
            질문으로 나를 만나는 여정,
            <br />
            함께 시작하시겠어요?
          </p>
          <a
            href="https://tally.so/r/BzKrZ7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-10 py-5 bg-[#2c2416] text-[#f5f1eb] rounded-full text-xl font-medium hover:bg-[#3d3428] transition-all shadow-lg hover:shadow-xl"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).posthog) {
                (window as any).posthog.capture('final_cta_click', { cta: 'KaiLo 모임 대기 신청' });
              }
            }}
          >
            KaiLo 모임 대기 신청
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 bg-[#e8e0d6]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="/" className="inline-block">
            <div className="relative w-32 h-10 md:w-40 md:h-12">
              <Image
                src="/images/KaiLo_로고_원_무배경.png"
                alt="KAILO"
                fill
                className="object-contain"
              />
            </div>
          </a>
          <p className="text-sm md:text-base text-[#5a5248]">
            Made with ❤️ by KaiLo
          </p>
        </div>
      </footer>
    </div>
  );
}
