import { Mail, MessageSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NotificationPreview = () => {
  const emailExamples = {
    orderUpdates: {
      subject: "Your Test Order is Confirmed - #MH12345",
      preview: "Your blood test order has been confirmed and is being processed.",
      body: `Dear John,

Thank you for your order. Your blood test kit will be dispatched within 24 hours.

Order Details:
• Full Blood Count Test
• Order Number: MH12345
• Estimated Delivery: 2-3 business days

Track your order: https://myhealthcheckup.com/orders/MH12345

Best regards,
myhealth checkup Team`
    },
    healthInsights: {
      subject: "Your Weekly Health Insights",
      preview: "Here are your personalised health recommendations this week.",
      body: `Hi John,

Based on your recent health data and test results:

Key Insights:
• Your cholesterol levels are within healthy range
• Consider booking a vitamin D test this winter
• Stay hydrated - aim for 2L water daily

Recommended Tests:
• Thyroid Function Test
• Vitamin D Test

View full insights: https://myhealthcheckup.com/dashboard

Stay healthy,
myhealth checkup Team`
    },
    testReminders: {
      subject: "Reminder: Annual Health Check Due",
      preview: "It's time for your annual health screening.",
      body: `Hi John,

This is a friendly reminder that it's been 12 months since your last comprehensive health check.

We recommend:
• Full Blood Count
• Lipid Profile
• HbA1c (Diabetes check)
• Vitamin D

Book now: https://myhealthcheckup.com/compare

Your health is your greatest asset,
myhealth checkup Team`
    },
    promotions: {
      subject: "20% Off All Vitamin Tests This Week",
      preview: "Limited time offer on essential vitamin testing.",
      body: `Hi John,

Special offer just for you!

Get 20% off all vitamin deficiency tests:
✓ Vitamin D Test - Now £29 (was £36)
✓ Vitamin B12 Test - Now £32 (was £40)
✓ Full Vitamin Panel - Now £79 (was £99)

Use code: VITAMINS20
Valid until: Sunday 11:59 PM

Shop now: https://myhealthcheckup.com/vitamins

Best regards,
myhealth checkup Team`
    }
  };

  const smsExamples = {
    results: {
      message: "myhealth checkup: Your test results are ready to view. Log in to see your Full Blood Count results and personalised insights. https://myhealthcheckup.com/results"
    },
    appointments: {
      message: "myhealth checkup: Reminder - Your blood test appointment is tomorrow at 10:30 AM at Goodbody Clinic, London. Bring photo ID. Reply CANCEL to reschedule."
    },
    urgent: {
      message: "myhealth checkup: URGENT - Please contact your GP regarding your recent test results. Our team will call you within 2 hours. Call us: 020 1234 5678"
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Preview Examples
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notification Preview</DialogTitle>
          <DialogDescription>
            See examples of the notifications you'll receive when you enable each type
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </TabsTrigger>
            <TabsTrigger value="sms" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Order Updates</CardTitle>
                  <Badge variant="secondary">Email</Badge>
                </div>
                <CardDescription className="text-sm">
                  Subject: {emailExamples.orderUpdates.subject}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-mono">
                  {emailExamples.orderUpdates.body}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Health Insights</CardTitle>
                  <Badge variant="secondary">Email</Badge>
                </div>
                <CardDescription className="text-sm">
                  Subject: {emailExamples.healthInsights.subject}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-mono">
                  {emailExamples.healthInsights.body}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Test Reminders</CardTitle>
                  <Badge variant="secondary">Email</Badge>
                </div>
                <CardDescription className="text-sm">
                  Subject: {emailExamples.testReminders.subject}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-mono">
                  {emailExamples.testReminders.body}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Promotions &amp; Offers</CardTitle>
                  <Badge variant="secondary">Email</Badge>
                </div>
                <CardDescription className="text-sm">
                  Subject: {emailExamples.promotions.subject}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-mono">
                  {emailExamples.promotions.body}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Test Results Available</CardTitle>
                  <Badge variant="secondary">SMS</Badge>
                </div>
                <CardDescription className="text-sm">
                  Sent when your test results are ready to view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm">{smsExamples.results.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Appointment Reminders</CardTitle>
                  <Badge variant="secondary">SMS</Badge>
                </div>
                <CardDescription className="text-sm">
                  Reminders for upcoming clinic appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm">{smsExamples.appointments.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Urgent Alerts</CardTitle>
                  <Badge variant="destructive">SMS</Badge>
                </div>
                <CardDescription className="text-sm">
                  Critical health alerts requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{smsExamples.urgent.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPreview;
