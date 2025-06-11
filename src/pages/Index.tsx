
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SVGConverter from '@/components/SVGConverter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />
      
      <main className="container mx-auto px-4">
        <div className="animate-fade-in">
          <Hero />
          <SVGConverter />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
