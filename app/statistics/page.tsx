'use client';

import { useEffect, useRef, useState } from 'react';

type Stat = {
  value: number;
  label: string;
  prefix: string;
  suffix: string;
};

const STATS: Stat[] = [
  { value: 35000, label: 'Lives saved', prefix: '+ ', suffix: '' },
  { value: 1200, label: 'Partnered hospitals', prefix: '+ ', suffix: '' },
  { value: 10000, label: 'Successful donations', prefix: '', suffix: '' },
];

export function Statistics(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(1);
  const [displayValues, setDisplayValues] = useState<number[]>([0, 0, 0]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const target = STATS[activeIndex].value;
    const duration = 2000;

    setDisplayValues((prev) => {
      const next = [...prev];
      next[activeIndex] = 0;
      return next;
    });

    startTimeRef.current = null;

    const animate = (timestamp: number): void => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * eased);

      setDisplayValues((prev) => {
        const next = [...prev];
        next[activeIndex] = currentValue;
        return next;
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const timeoutId = window.setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      window.clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeIndex]);

  return (
    <section id='statistics' className='bg-white py-16 md:py-24 w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12'>
          <div className='w-1 h-8 sm:h-10 bg-[#C50000]' />
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#C50000]'>
            Join us and discover more!
          </h2>
        </div>

        <div className='relative'>
          <div className='flex items-center justify-center'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center w-full max-w-5xl mx-auto'>
              {STATS.map((stat, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={stat.label}
                    type='button'
                    onClick={() => setActiveIndex(index)}
                    className='relative text-center cursor-pointer rounded-2xl transition-all duration-500'
                    style={{
                      transform: isActive ? 'scale(1.08)' : 'scale(0.88)',
                      zIndex: isActive ? 10 : 1,
                      backgroundColor: isActive ? '#C50000' : '#951515',
                      padding: isActive ? '3.5rem 2rem' : '2rem 1.5rem',
                      opacity: isActive ? 1 : 0.6,
                      filter: isActive ? 'none' : 'blur(1px)',
                      boxShadow: isActive ? '0 25px 50px -12px rgba(197, 0, 0, 0.4)' : 'none',
                    }}
                  >
                    <p
                      className='font-bold mb-2 text-white transition-all duration-500'
                      style={{ fontSize: isActive ? '3rem' : '2rem' }}
                    >
                      {stat.prefix}
                      {displayValues[index].toLocaleString('en-US')}
                      {stat.suffix}
                    </p>
                    <p
                      className='font-semibold text-white transition-all duration-500'
                      style={{ fontSize: isActive ? '1.25rem' : '1rem', opacity: isActive ? 1 : 0.7 }}
                    >
                      {stat.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Statistics;
