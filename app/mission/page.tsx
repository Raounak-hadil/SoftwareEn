import type { JSX } from 'react';
import Image from 'next/image';

export default function Mission(): JSX.Element {
  return (
    <section id='mission' className='bg-white py-16 md:py-24 w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center'>
          <div className='order-2 md:order-1'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-[#C50000] mb-6'>
              Our Mission
            </h2>
            <p className='text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl'>
              We unite donors, hospitals, and medical professionals on a secure platform to make blood management simple and effective. Our commitment to transparency and rapid response ensures that life-saving care is always available when it matters most.
              <br className="mb-2" />
              <strong>Safe Donations, Trusted Hospitals and Protected Data!</strong>
            </p>
          </div>
          <div className='flex justify-end order-1 md:order-2'>
            <div className='relative w-[340px] sm:w-[400px] h-[240px] sm:h-[280px]'>
              <div className='absolute top-0 right-0 w-full h-full bg-[#C50000]' />
              <Image
                src='/images/Donation.png'
                alt='Donation awareness'
                width={450}
                height={320}
                className='absolute -bottom-4 -left-4 w-full h-full object-cover z-10 rounded-sm'
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
