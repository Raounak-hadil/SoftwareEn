import type { JSX } from 'react';

import Image from 'next/image';

export function Mission(): JSX.Element {
  return (
    <section id='mission' className='bg-white py-16 md:py-24 w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start'>
          <div className='order-2 md:order-1'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#C50000] mb-4 sm:mb-6'>
              Our Mission
            </h2>
            <p className='text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed'>
              We bring together donors, hospitals, and medical professionals on one secure and compassionate platform to
              make blood management simple, safe, and effective. Whether you are donating, receiving, or working to save
              lives, we stand with you at every step.
            </p>
            <p className='text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed'>
              Our dedication to transparency, trust, and rapid response drives us to advance the future of blood banking
              and transfusion services. From local community blood drives to international partnerships, our vision is a
              world where no patient ever suffers or dies due to a shortage of blood. Safe, timely, and life-saving care
              is our commitment to every patient, every hospital, and every person who believes in the power of giving.
              <strong> Safe Donations, Trusted Hospitals and Protected Data!</strong>
            </p>
          </div>

          <div className='flex justify-end order-1 md:order-2'>
            <div className='relative w-[320px] h-[220px]'>
              <div className='absolute top-0 right-0 w-full h-full bg-[#C50000]' />
              <Image
                src='/images/Donation.png'
                alt='Donation awareness'
                width={400}
                height={300}
                className='absolute -bottom-4 -left-4 w-full h-full object-cover z-10'
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mission;
