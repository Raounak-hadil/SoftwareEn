'use client';

import type { JSX } from 'react';
import { type FormEvent, type ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginModalProps = {
  onClose: () => void;
};

const LoginModal = ({ onClose }: LoginModalProps): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    router.push('/doctor-profile');
  };

  const handleChange = (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>): void => {
    setter(event.target.value);
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50' onClick={onClose}>
      <div
        className='relative bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl'
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className='text-2xl font-bold text-[#C50000] mb-6 text-center'>Log In</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='email'>
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={handleChange(setEmail)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C50000] focus:border-transparent outline-none'
              placeholder='Enter your email'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={handleChange(setPassword)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C50000] focus:border-transparent outline-none'
              placeholder='Enter your password'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-[#C50000] text-white py-3 rounded-lg font-semibold hover:bg-[#A00000] transition-all duration-300'
          >
            Log In
          </button>
        </form>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl'
          aria-label='Close login modal'
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
