import React from 'react';
import { DollarSign, Shield, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AffiliateDisclosure = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <p className="text-gray-600 mt-4">
          Effective Date: 01/08/2025
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          <strong>Company:</strong> myhealthcheckup Ltd<br/>
          <strong>CMA & ASA Compliant</strong>
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-health-600" />
          Transparency Statement
        </h2>
        <p className="text-gray-700 leading-relaxed">
          myhealthcheckup Ltd may earn a commission when you purchase services via links on our Website.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Our Standards</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <p className="text-gray-700">We only work with UKAS-accredited, CQC-regulated, and ISO 15189-certified providers.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <p className="text-gray-700">Commission does not affect the price you pay or compromise the independence of our comparisons.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <p className="text-gray-700">This arrangement helps support the operation of our platform at no additional cost to you.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <p className="text-gray-700">For transparency, any affiliate links are clearly marked.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-50">
        <p className="text-gray-700 text-center">
          We are committed to providing you with unbiased, accurate information to help you make informed health decisions.
        </p>
      </Card>
    </div>
  );
};

export default AffiliateDisclosure;