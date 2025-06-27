
import React from 'react';
import { Shield, Mail, Phone, MapPin, Clock, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-health-600" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-GB')}
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-health-600" />
          1. Introduction
        </h2>
        <p className="text-gray-700 leading-relaxed">
          My Health Hub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you visit our website or use our health comparison services. 
          We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Name and contact details (email, phone number)</li>
              <li>Health-related search queries and preferences</li>
              <li>Account information and preferences</li>
              <li>Communication records</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Technical Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>IP address and browser information</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Website usage analytics</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">Provide and improve our health comparison services</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">Personalise your experience and recommendations</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">Communicate with you about our services</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">Comply with legal obligations</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">4. Your Rights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Access & Portability</h3>
            <p className="text-sm text-gray-600">Request a copy of your personal data</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Rectification</h3>
            <p className="text-sm text-gray-600">Correct inaccurate information</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Erasure</h3>
            <p className="text-sm text-gray-600">Request deletion of your data</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Objection</h3>
            <p className="text-sm text-gray-600">Object to processing of your data</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
        <p className="text-gray-700 mb-4">
          We implement appropriate technical and organisational measures to protect your personal data against 
          unauthorised access, alteration, disclosure, or destruction.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Security Measures Include:</h3>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Staff training on data protection</li>
          </ul>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-health-600" />
          6. Contact Information
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">privacy@myhealthhub.co.uk</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">+44 (0) 20 1234 5678</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-gray-500 mt-1" />
            <div className="text-gray-700">
              <p>Data Protection Officer</p>
              <p>My Health Hub Ltd</p>
              <p>123 Health Street</p>
              <p>London, UK SW1A 1AA</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center pt-8">
        <Button 
          onClick={() => window.print()}
          variant="outline"
          className="mr-4"
        >
          Print Policy
        </Button>
        <Button className="bg-health-600 hover:bg-health-700">
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
