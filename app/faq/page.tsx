'use client';

import { useState } from 'react';

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

type ContactForm = {
  fullName: string;
  phoneNumber: string;
  position: string;
  description: string;
};

const FAQ_ITEMS: FAQItem[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  question: 'What is the purpose of the BBMS?',
  answer:
    'The BBMS (Blood Bank Management System) helps manage blood donations, storage, and distribution efficiently across hospitals.',
}));

export function FAQ(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ContactForm>({
    fullName: '',
    phoneNumber: '',
    position: '',
    description: '',
  });

  const toggleFAQ = (index: number): void => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleInputChange = (field: keyof ContactForm, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNum: formData.phoneNumber,
          Description: formData.description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit question');
      }

      alert('Question submitted successfully!');
      setFormData({
        fullName: '',
        phoneNumber: '',
        position: '',
        description: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <section id='faq' className='bg-white py-16 md:py-24 w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12'>
          <div className='w-1 h-8 sm:h-10 bg-[#C50000]' />
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#C50000]'>Frequently asked questions</h2>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16'>
          <div className='space-y-2'>
            {FAQ_ITEMS.map((faq, index) => (
              <div key={faq.id} className='border-l-4 border-[#C50000] rounded-lg overflow-hidden'>
                <button
                  type='button'
                  onClick={() => toggleFAQ(index)}
                  className='w-full px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50 transition border border-l-0 border-gray-200 rounded-r-lg'
                >
                  <span className='text-left text-gray-800 text-sm'>{faq.question}</span>
                  <span className='text-lg text-gray-500 ml-4'>{openIndex === index ? '-' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className='px-4 py-3 bg-gray-50 border border-t-0 border-l-0 border-gray-200'>
                    <p className='text-gray-600 text-sm'>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className='flex flex-col'>
            <div className='flex items-start gap-1 mb-8'>
              <span className='text-7xl md:text-8xl text-black font-serif leading-none'>?</span>
              <div className='mt-6'>
                <h3 className='text-xl md:text-2xl font-bold text-gray-900'>More</h3>
                <h3 className='text-xl md:text-2xl font-bold text-gray-900'>questions ?</h3>
              </div>
            </div>

            <form className='space-y-3 max-w-sm' onSubmit={(event) => event.preventDefault()}>
              <div className='flex flex-col items-start space-y-3'>
                {([
                  { field: 'fullName', placeholder: 'Full Name', width: '100%' },
                  { field: 'phoneNumber', placeholder: 'Phone Number', width: '92%' },
                  { field: 'position', placeholder: 'Your position', width: '84%' },
                  { field: 'description', placeholder: 'Describe your matter ...', width: '76%' },
                ] as const).map((input) => (
                  <div key={input.field} className='transform -skew-y-2 overflow-hidden' style={{ width: input.width }}>
                    <input
                      type='text'
                      value={formData[input.field]}
                      onChange={(event) => handleInputChange(input.field, event.target.value)}
                      placeholder={input.placeholder}
                      className='w-full px-4 py-2.5 bg-[#C50000] text-white placeholder-white/80 font-medium text-center transform skew-y-2 focus:outline-none'
                    />
                  </div>
                ))}
              </div>
              <div className='pt-4'>
                <button
                  type='button'
                  onClick={handleSubmit}
                  className='bg-[#C50000] text-white px-8 py-3 rounded font-semibold hover:bg-[#A00000] transition-all duration-300 hover:scale-105'
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
