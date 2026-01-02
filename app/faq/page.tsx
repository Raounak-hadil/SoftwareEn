'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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

const FAQ_ITEMS: FAQItem[] = Array.from({ length: 7 }, (_, index) => {
  const faqs = [
    {
      question: 'What is the purpose of the BBMS?',
      answer: 'The BBMS (Blood Bank Management System) helps manage blood donations, storage, and distribution efficiently across hospitals.',
    },
    {
      question: 'How can I donate blood?',
      answer: 'You can donate blood by registering at a nearby blood bank or using the BBMS platform to schedule an appointment.',
    },
    {
      question: 'Who can receive blood donations?',
      answer: 'Blood donations are available to patients in need, based on compatibility and hospital requirements.',
    },
    {
      question: 'How is blood stored safely?',
      answer: 'BBMS ensures blood is stored under controlled temperatures and regularly monitored to maintain safety and quality.',
    },
    {
      question: 'Can I track my donation history?',
      answer: 'Yes, the BBMS allows donors to track their donation history and receive notifications for future donation opportunities.',
    },
    {
      question: 'How are emergencies handled?',
      answer: 'BBMS prioritizes urgent requests and ensures blood is quickly allocated to hospitals during emergencies.',
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Absolutely. BBMS encrypts and securely stores donor information to maintain privacy and data security.',
    },
  ];
  return { id: index + 1, ...faqs[index] };
});

export default function FAQ(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const [formData, setFormData] = useState<ContactForm>({
    fullName: '',
    phoneNumber: '',
    position: '',
    description: '',
  });

  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const toggleFAQ = (index: number): void => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleInputChange = (field: keyof ContactForm, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    // Basic validation
    if (!formData.fullName || !formData.phoneNumber || !formData.description) {
      setSubmitStatus('error');
      setStatusMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

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

      setSubmitStatus('success');
      setStatusMessage('Your question has been submitted successfully! We will get back to you soon.');

      setFormData({
        fullName: '',
        phoneNumber: '',
        position: '',
        description: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                  { field: 'fullName', placeholder: 'Full Name', width: '100%', type: 'text' },
                  { field: 'phoneNumber', placeholder: 'Phone Number', width: '92%', type: 'number' },
                  { field: 'position', placeholder: 'Your position', width: '84%', type: 'text' },
                  { field: 'description', placeholder: 'Describe your matter ...', width: '76%', type: 'text' },
                ] as const).map((input) => (
                  <div key={input.field} className='transform -skew-y-2 overflow-hidden' style={{ width: input.width }}>
                    <input
                      type={input.type}
                      value={formData[input.field]}
                      onChange={(event) => handleInputChange(input.field, event.target.value)}
                      placeholder={input.placeholder}
                      className='w-full px-4 py-2.5 bg-[#C50000] text-white placeholder-white/80 font-medium text-center transform skew-y-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                      disabled={isSubmitting}
                    />
                  </div>
                ))}
              </div>

              {submitStatus && (
                <div className={`flex items-center gap-3 p-4 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${submitStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              <div className='pt-4'>
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='w-full sm:w-auto bg-[#C50000] text-white px-8 py-3 rounded font-semibold hover:bg-[#A00000] transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
