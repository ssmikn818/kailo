'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  mainQuote: string;
  hashtag: string;
  supportingQuote: string;
  additionalText?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    mainQuote: "1:1 대화 코너가 예상보다 훨씬 좋았고요, 제가 가진 좁은 세계를 인식하게 되면서 관점이 확장되는 걸 느꼈어요.",
    hashtag: "#관점확장",
    supportingQuote: "제가 저만의 작은 세계에 갇혀 있었다는 걸 알았어요.",
  },
  {
    id: 2,
    mainQuote: "완벽주의를 내려놓고 실행에 집중하니까, 오히려 저를 조금 더 다듬어 갈 수 있었어요. 멈췄다 가는 법을 배운 시간이었어요.",
    hashtag: "#실행의용기",
    supportingQuote: "완벽보다 일단 실행하는 게 저를 더 다듬어준다는 걸 알았어요.",
  },
  {
    id: 3,
    mainQuote: "막연한 다짐보다, 실질적인 움직임이 훨씬 중요하더라고요. 과정 속의 저를 잘 돌보는 법을 배웠어요.",
    hashtag: "#실질적변화",
    supportingQuote: "결국 변화는 실질적인 행동으로부터 온다는 걸 알았어요.",
  },
  {
    id: 4,
    mainQuote: "디지털 노마드 같은 도구에 매몰되지 않고, 진짜 제 방향을 잡는 법을 알게 되었어요.",
    hashtag: "#본질찾기",
    supportingQuote: "도구보다 진짜 내 방향을 잡는 게 중요하다는 걸 알았어요.",
  },
];

export default function TestimonialsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PostHog: 후기 섹션 조회 추적
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('testimonials_section_view', {
        section: 'testimonials',
        timestamp: Date.now(),
      });
    }

    // 자동 스크롤 (왼쪽으로 계속 움직임)
    const autoScroll = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = 0.5; // 스크롤 속도 조절
        container.scrollLeft += scrollAmount;
        
        // 첫 번째 세트의 끝에 도달하면 처음으로 돌아가기 (무한 루프)
        const firstSetWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= firstSetWidth) {
          container.scrollLeft = 0;
        }
      }
    }, 16); // 16ms마다 스크롤 (60fps 부드러운 움직임)

    return () => clearInterval(autoScroll);
  }, []);

  const handleTestimonialClick = (testimonialId: number, hashtag: string) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('testimonial_click', {
        testimonial_id: testimonialId,
        hashtag: hashtag,
      });
    }
  };

  return (
    <section 
      id="testimonials"
      className="py-20 md:py-32 px-4 md:px-8 bg-[#faf8f5]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            먼저 다녀온 동료들의 진짜 후기
          </h2>
          <p className="text-base md:text-lg text-[#5a5248] mt-4">
            단순히 모여서 떠드는 게 아니라, 막연했던 생각들이 구체적인 문장으로 정리된 기록입니다.
          </p>
        </div>

        {/* 가로 스크롤 가능한 박스들 (무한 스크롤을 위해 복제) */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* 원본 박스들 */}
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`original-${testimonial.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleTestimonialClick(testimonial.id, testimonial.hashtag)}
              className="flex-shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] bg-white rounded-lg p-8 md:p-10 transition-all cursor-pointer"
            >
              <blockquote className="space-y-6 h-full flex flex-col">
                <div className="bg-[#f5f1eb] rounded-lg p-6 md:p-8 flex-1">
                  <p className="text-lg md:text-xl text-[#2c2416] leading-relaxed">
                    {testimonial.mainQuote}
                  </p>
                </div>
                <div className="pt-4">
                  <p className="text-sm md:text-base text-[#5a5248] mb-3">{testimonial.hashtag}</p>
                  <p className="text-base md:text-lg text-[#d97706] italic font-medium">
                    "{testimonial.supportingQuote}"
                  </p>
                  {testimonial.additionalText && (
                    <p className="text-base md:text-lg text-[#5a5248] mt-4 leading-relaxed">
                      {testimonial.additionalText}
                    </p>
                  )}
                </div>
              </blockquote>
            </motion.div>
          ))}
          {/* 무한 스크롤을 위한 복제 박스들 */}
          {testimonials.map((testimonial) => (
            <div
              key={`duplicate-${testimonial.id}`}
              onClick={() => handleTestimonialClick(testimonial.id, testimonial.hashtag)}
              className="flex-shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] bg-white rounded-lg p-8 md:p-10 transition-all cursor-pointer"
            >
              <blockquote className="space-y-6 h-full flex flex-col">
                <div className="bg-[#f5f1eb] rounded-lg p-6 md:p-8 flex-1">
                  <p className="text-lg md:text-xl text-[#2c2416] leading-relaxed">
                    {testimonial.mainQuote}
                  </p>
                </div>
                <div className="pt-4">
                  <p className="text-sm md:text-base text-[#5a5248] mb-3">{testimonial.hashtag}</p>
                  <p className="text-base md:text-lg text-[#d97706] italic font-medium">
                    "{testimonial.supportingQuote}"
                  </p>
                  {testimonial.additionalText && (
                    <p className="text-base md:text-lg text-[#5a5248] mt-4 leading-relaxed">
                      {testimonial.additionalText}
                    </p>
                  )}
                </div>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
