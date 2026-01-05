import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ModernSlaveryStatement from '@/components/compliance/ModernSlaveryStatement';

const ModernSlaveryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <ModernSlaveryStatement />
      </main>
      <Footer />
    </div>
  );
};

export default ModernSlaveryPage;