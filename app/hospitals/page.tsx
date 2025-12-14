'use client';

import { useEffect, useRef, useState } from 'react';

type Hospital = {
  id: number;
  name: string;
};

const HOSPITALS: Hospital[] = [
  { id: 1, name: 'NCC' },
  { id: 2, name: 'NSS' },
  { id: 3, name: 'YMCA' },
  { id: 4, name: 'Hospital A' },
  { id: 5, name: 'Hospital B' },
  { id: 6, name: 'Hospital C' },
  { id: 7, name: 'Hospital D' },
  { id: 8, name: 'Hospital E' },
];

const Hospitals = (): JSX.Element => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [hospitalsList, setHospitalsList] = useState<any[]>([]);
  const [hospitalsLoading, setHospitalsLoading] = useState<boolean>(true);
  const [hospitalsError, setHospitalsError] = useState<string | null>(null);

  const checkScrollability = (): void => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);
    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, []);

  useEffect(() => {
    // Fetch hospital stock for the logged-in hospital. The server should
    // identify the hospital (e.g., from auth cookies) and return relevant stock.
    const fetchStock = async () => {
      try {
        const res = await fetch('/api/hospital/stock/mystock', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        if (!res.ok) {
          console.warn('Failed to fetch stock:', res.status);
          return;
        }
        const json = await res.json();
        // Expecting an array in `json.data` or the root `json`.
        const items = json?.data ?? json;
        if (Array.isArray(items)) setStockItems(items);
      } catch (err) {
        console.error('Error fetching stock:', err);
      }
    };

    fetchStock();
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      setHospitalsLoading(true);
      setHospitalsError(null);
      console.log('[Hospitals] fetchHospitals start');
      try {
        const res = await fetch('/api/hospitals_list', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        console.log('[Hospitals] fetch status', res.status);
        if (!res.ok) {
          const msg = `Failed to fetch hospitals list: ${res.status}`;
          console.warn(msg);
          setHospitalsError(msg);
          return;
        }
        const json = await res.json();
        console.log('[Hospitals] raw json', json);
        const list = json?.hospitals ?? json?.data ?? json;
        if (Array.isArray(list)) {
          setHospitalsList(list);
        } else if (list && typeof list === 'object') {
          // handle case where API returns { hospitals: { ... } }
          const arr = Array.isArray(list.hospitals) ? list.hospitals : Object.values(list);
          setHospitalsList(arr);
        } else {
          setHospitalsList([]);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Error fetching hospitals list:', msg);
        setHospitalsError(msg);
      }
      finally {
        setHospitalsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const scroll = (direction: 'left' | 'right'): void => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 400;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id='hospitals' className='bg-white py-16 md:py-24 w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12'>
          <div className='w-1 h-8 sm:h-10 bg-[#C50000]' />
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#C50000]'>Our Hospitals</h2>
        </div>
        {/* Debug banner: shows fetch status while diagnosing */}
        <div className='mb-4 text-sm text-gray-600'>
          {hospitalsLoading ? 'Loading hospitals...' : hospitalsError ? `Error: ${hospitalsError}` : `Hospitals: ${hospitalsList.length}`}
        </div>

        <div className='relative'>
          {canScrollLeft && (
            <button
              type='button'
              onClick={() => scroll('left')}
              className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-[#C50000] rounded-full p-3 shadow-lg hover:bg-[#C50000] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95'
              aria-label='Scroll left'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className='flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(() => {
              const isStock = stockItems.length > 0;
              const isLoading = hospitalsLoading && !isStock;
              const isError = !!hospitalsError && !isStock;

              if (isStock) {
                return stockItems.map((hospital: any, idx: number) => {
                  const key = hospital?.id ?? hospital?.ID ?? idx;
                  if (hospital?.blood_type || hospital?.bloodType || hospital?.type) {
                    const bt = hospital?.blood_type ?? hospital?.bloodType ?? hospital?.type;
                    const qty = hospital?.quantity ?? hospital?.qty ?? hospital?.count ?? 0;
                    return (
                      <div
                        key={key}
                        className='flex-shrink-0 bg-white border border-gray-200 rounded-lg p-8 w-64 h-32 flex items-center justify-center shadow-sm hover:shadow-xl hover:border-[#C50000] transition-all duration-300 hover:scale-105 cursor-pointer'
                      >
                        <span className='text-gray-800 font-semibold text-xl'>{`${bt} (${qty})`}</span>
                      </div>
                    );
                  }
                  const name = hospital?.name || hospital?.hospital_name || hospital?.label || hospital?.item || `Hospital ${key}`;
                  return (
                    <div
                      key={key}
                      className='flex-shrink-0 bg-white border border-gray-200 rounded-lg p-8 w-64 h-32 flex items-center justify-center shadow-sm hover:shadow-xl hover:border-[#C50000] transition-all duration-300 hover:scale-105 cursor-pointer'
                    >
                      <span className='text-gray-800 font-semibold text-xl'>{name}</span>
                    </div>
                  );
                });
              }

              if (isLoading) {
                return Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className='flex-shrink-0 bg-white border border-gray-200 rounded-lg p-8 w-64 h-32 flex items-center justify-center shadow-sm'
                  >
                    <div className='w-40 h-6 bg-gray-200 rounded animate-pulse' />
                  </div>
                ));
              }

              if (isError) {
                return (
                  <div className='flex-shrink-0 bg-white border border-red-200 rounded-lg p-6 w-full flex items-center justify-center shadow-sm'>
                    <span className='text-red-600 font-medium'>Failed to load hospitals: {hospitalsError}</span>
                  </div>
                );
              }

              const previewList = hospitalsList.length ? hospitalsList : HOSPITALS;
              return previewList.map((hospital: any, idx: number) => {
                const key = hospital?.id ?? hospital?.ID ?? idx;
                const name =
                  hospital?.hosname || hospital?.hos_name || hospital?.name || hospital?.hospital_name || hospital?.label || hospital?.item || `Hospital ${key}`;
                return (
                  <div
                    key={key}
                    className='flex-shrink-0 bg-white border border-gray-200 rounded-lg p-8 w-64 h-32 flex items-center justify-center shadow-sm hover:shadow-xl hover:border-[#C50000] transition-all duration-300 hover:scale-105 cursor-pointer'
                  >
                    <span className='text-gray-800 font-semibold text-xl'>{name}</span>
                  </div>
                );
              });
            })()}
          </div>

          {canScrollRight && (
            <button
              type='button'
              onClick={() => scroll('right')}
              className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-[#C50000] rounded-full p-3 shadow-lg hover:bg-[#C50000] hover:text-white transition-all duration-300 hover:scale-110 active:scale-95'
              aria-label='Scroll right'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          )}

          <div className='flex justify-center gap-2 mt-6'>
            {(() => {
              const previewList = stockItems.length ? stockItems : hospitalsList.length ? hospitalsList : HOSPITALS;
              return previewList.map((_: any, i: number) => <div key={i} className='w-2 h-2 rounded-full bg-gray-300' />);
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hospitals;
