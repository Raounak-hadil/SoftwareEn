'use client';
import { useState } from 'react';
import { default as Donors } from '../donors/page';
import { default as FAQ } from '../faq/page';
import { default as Footer } from '../footer/page';
import { default as Hero } from '../hero/page';
import { default as Hospitals } from '../hospitals/page';
import LoginModal from '@/components/ui/LoginModal';
import { default as Mission } from '../mission/page';
import Navbar from '@/components/ui/Navbar';
import { default as Statistics } from '../statistics/page';
import { useRouter } from "next/navigation";
const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  return (
    <>
      <Navbar onLoginClick={() => router.push("/auth/login")} />
      <main className='pt-16 transition-all duration-300'>
        <Hero />
        <Mission />
        <Donors />
        <Hospitals />
        <Statistics />
        <FAQ />
      </main>
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};
export default HomePage;
