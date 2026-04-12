"use client";

import { useState } from 'react';
import Navbar from '@/sections/Navbar';
import Hero from '@/sections/Hero';
import Features from '@/sections/Features';
import HowItWorks from '@/sections/HowItWorks';
import Pricing from '@/sections/Pricing';
import Testimonials from '@/sections/Testimonials';
import FAQ from '@/sections/FAQ';
import Footer from '@/sections/Footer';
import LoginModal from '@/components/LoginModal'; 
import Dashboard from '@/pages/Dashboard';

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // لو المستخدم مسجل دخول، اعرض الداشبورد
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // لو مش مسجل، اعرض اللاندنج بيج
  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
      <Hero onLoginClick={() => setIsLoginModalOpen(true)} />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}