'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonLabel: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: '당연했던 정답',
    subtitle: '비우기',
    description: '질문하기 전, KaiLo는 낯설게 바라보기를 통해\n굳은 사고를 유연하게 풀어줍니다.',
    image: '/images/step1_undraw_social-serenity_x9vq.svg',
    buttonLabel: '정답 비우기',
  },
  {
    id: 2,
    title: '날카로운 질문으로',
    subtitle: '서로 흔들기',
    description: 'KaiLo만의 하브루타식 문답을 통해 질문은 또 다른 질문을 낳고,\n주제를 파고드는 힘을 키웁니다.',
    image: '/images/step2_undraw_solution-mindset_pit7.svg',
    buttonLabel: '질문으로 흔들기',
  },
  {
    id: 3,
    title: '무너진 자리에서',
    subtitle: '나를 다시 세우기',
    description: 'KaiLo에서는 불편했던 순간,\n관점의 전환을 통한 메타인지 과정을 기록하고 피드백합니다.',
    image: '/images/step3_undraw_new-ideas_nk4n.svg',
    buttonLabel: '나를 다시 세우기',
  },
  {
    id: 4,
    title: '생각이 삶이 되는',
    subtitle: '\'작은 실행\'의 시작',
    description: '"이 생각으로 무엇을 해볼 수 있을까?"\nKaiLo는 사유의 끝에 \'작은 실행\'을 설계합니다.',
    image: '/images/step4_undraw_light-the-fire_u2zp.svg',
    buttonLabel: '\'작은 실행\'의 시작',
  },
];

export default function InteractiveSteps() {
  const [currentStep, setCurrentStep] = useState(3); // 4번째 버튼이 기본 활성화

  const currentStepData = steps[currentStep];

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 상단 제목 섹션 */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#2c2416]">
            비우고, 질문으로 흔들리고, 나를 발견하는 경험
          </h2>
          <p className="text-lg md:text-xl text-[#5a5248]">
            감각의 복구를 위한 사유 프로토콜
          </p>
        </div>

        {/* 네비게이션 버튼들 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`px-6 py-3 rounded-lg transition-all duration-300 text-base md:text-lg font-medium ${
                  isActive
                    ? 'bg-[#2c2416] text-[#f5f1eb]'
                    : 'bg-white text-[#5a5248] hover:bg-[#faf8f5]'
                }`}
              >
                {step.buttonLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* 현재 활성 카드 */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg p-10 md:p-16"
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* 이미지 */}
              <div className="relative w-full h-64 md:h-80 order-2 md:order-1">
                <Image
                  src={currentStepData.image}
                  alt={currentStepData.title}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>

              {/* 텍스트 콘텐츠 */}
              <div className="space-y-6 order-1 md:order-2">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-[#2c2416]">
                    {currentStepData.title}
                  </h3>
                  <h4 className="text-xl md:text-2xl font-semibold text-[#5a5248] mb-6">
                    {currentStepData.subtitle}
                  </h4>
                </div>
                <p className="text-lg md:text-xl text-[#5a5248] leading-relaxed whitespace-pre-line">
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
