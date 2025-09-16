import React from 'react';
import { Shield, Mail, Phone, MapPin, Clock, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
const PrivacyPolicy = () => {
  return <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-health-600" />
          <h1 className="text-3xl font-bold text-[#1a1b34]">Privacy Policy</h1>
        </div>
        <p className="text-gray-600">
          Effective Date: 01/08/2025
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          <strong>Company:</strong> myhealthcheckup Ltd (trading as myhealth checkup)<br />
          <strong>Company Registration Number:</strong> 16589056<br />
          <strong>Registered Office:</strong> Flat 2/369 Clapham Road, London, United Kingdom, SW9 9BT
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-health-600" />
          1. Introduction
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          myhealthcheckup Ltd ("we", "our", "us") is committed to protecting your personal data. This Privacy Policy explains how we collect, 
          process, and protect your personal information when you use myhealthcheckup.co.uk ("Website"). We comply fully with the UK General Data Protection Regulation (UK GDPR), 
          the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR).
        </p>
        <p className="text-gray-700 leading-relaxed">
          By using our Website, you agree to this Privacy Policy.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">2. Data We Collect</h2>
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">We may collect the following categories of data:</p>
          <div>
            <h3 className="font-medium mb-2">Personal identifiers:</h3>
            <p className="text-gray-700 text-sm">Name, email address, phone number.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">User preferences:</h3>
            <p className="text-gray-700 text-sm">Tests of interest, saved searches, selections.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Technical data:</h3>
            <p className="text-gray-700 text-sm">IP address, browser type, device information, cookies.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Special category data:</h3>
            <p className="text-gray-700 text-sm">Limited health-related preferences (e.g., interest in fertility or hormone tests).</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Marketing data:</h3>
            <p className="text-gray-700 text-sm">Your communication preferences and interactions with our emails or Website.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">3. How We Collect Data</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">Directly from you when you create an account, sign up for emails, or interact with the Website.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">Automatically via cookies and analytics tools.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">From third parties where you interact with our referral partners (subject to their consent and agreements).</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">4. Lawful Basis for Processing</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700"><strong>Consent:</strong> For email marketing and processing any health-related preferences.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700"><strong>Legitimate interests:</strong> For Website functionality, service improvement, and fraud prevention.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700"><strong>Legal obligations:</strong> To comply with regulatory or legal requirements.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">5. Special Category Data</h2>
        <p className="text-gray-700">
          When you indicate preferences related to tests (e.g., fertility, cancer screening), this may amount to processing special category health data. 
          We only process such data with your explicit consent, which you can withdraw at any time.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">6. How We Use Your Data</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">To provide our comparison and referral services.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">To personalise your experience.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">To send you relevant communications (if you have consented).</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700">To improve our Website and protect its security.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">7. Data Sharing</h2>
        <p className="text-gray-700 mb-4">We may share your data with:</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700"><strong>Service providers:</strong> To provide Website functionality (e.g., hosting, analytics).</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700"><strong>Referral partners:</strong> Where you select a third-party provider (subject to explicit consent).</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-health-600 rounded-full mt-2"></div>
            <p className="text-gray-700"><strong>Regulators or legal authorities:</strong> Where required by law.</p>
          </div>
        </div>
        <p className="text-gray-700 mt-4 font-medium">We do not sell your personal data.</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">8. Your Rights</h2>
        <p className="text-gray-700 mb-4">You have the following rights under UK GDPR:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Access your data</h3>
            <p className="text-sm text-gray-600">Request a copy of your personal data</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Correct inaccurate data</h3>
            <p className="text-sm text-gray-600">Update or fix incorrect information</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Request deletion</h3>
            <p className="text-sm text-gray-600">"Right to be forgotten"</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Restrict or object</h3>
            <p className="text-sm text-gray-600">Limit or stop processing</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Withdraw consent</h3>
            <p className="text-sm text-gray-600">Stop marketing communications</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Data portability</h3>
            <p className="text-sm text-gray-600">Transfer your data</p>
          </div>
        </div>
        <p className="text-gray-700 mt-4">Contact: privacy@myhealthcheckup.co.uk to exercise these rights.</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">9. Security</h2>
        <p className="text-gray-700">
          We implement appropriate technical and organisational measures to protect your data from unauthorised access, use, or disclosure.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">10. Complaints</h2>
        <p className="text-gray-700">
          If you are dissatisfied, you can complain to the Information Commissioner's Office (ICO): www.ico.org.uk.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-health-600" />
          11. Contact Us
        </h2>
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">privacy@myhealthcheckup.co.uk</span>
        </div>
      </Card>

      <div className="text-center pt-8">
        <Button onClick={() => window.print()} variant="outline" className="mr-4 bg-[#e70d69] text-white">
          Print Policy
        </Button>
        <Button className="bg-[#e70d69]">
          Download PDF
        </Button>
      </div>
    </div>;
};
export default PrivacyPolicy;