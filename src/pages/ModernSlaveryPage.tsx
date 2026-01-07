import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import ModernSlaveryStatement from '@/components/compliance/ModernSlaveryStatement';

const ModernSlaveryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb 
            segments={[
              { label: "Home", href: "/" },
              { label: "Modern Slavery Statement" }
            ]}
            backLabel="Back to Home"
          />
        </div>
        <ModernSlaveryStatement />
      </main>
      <Footer />
    </div>
  );
};

export default ModernSlaveryPage;