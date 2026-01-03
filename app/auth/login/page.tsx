"use client";
import LogIn from './LogIn';
import '../../../assets/styles/LogIn.css';
import { Suspense } from 'react';

function LoginContent() {
  return (
    <div className="body">
      <LogIn />
    </div>
  );
}

export default function LogInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
