import React from 'react';
import { Shield, Users, CheckCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ModernSlaveryStatement = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <p className="text-gray-600 mt-4">
          Effective Date: 01/08/2025
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          <strong>Company:</strong> myhealthcheckup Ltd
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-health-600" />
          Our Commitment
        </h2>
        <p className="text-gray-700 leading-relaxed">
          myhealthcheckup Ltd is committed to preventing modern slavery, human trafficking, and unethical practices within our operations and supply chains.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Partner Standards</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <p className="text-gray-700">We only partner with UKAS-accredited, CQC-regulated, ISO 15189-certified providers who meet strict ethical and regulatory standards.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
            <p className="text-gray-700">We conduct due diligence on all partners to ensure compliance with the Modern Slavery Act 2015.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Zero Tolerance Policy</h2>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-gray-700 font-medium">
            We maintain a zero‑tolerance policy towards slavery, forced labour, and exploitation.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-health-600" />
          Annual Review
        </h2>
        <p className="text-gray-700">
          We review and update our ESG commitments annually to ensure we continue to meet the highest ethical standards.
        </p>
      </Card>
    </div>
  );
};

export default ModernSlaveryStatement;