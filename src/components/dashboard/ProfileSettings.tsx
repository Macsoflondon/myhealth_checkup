import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, User, MapPin, Phone, Heart, AlertCircle, Mail, Bell, MessageSquare } from "lucide-react";
import { usersApi, preferencesApi, type UserProfile, type EmailNotificationPreferences, type SmsNotificationPreferences } from "@/api";
import { logger } from "@/lib/logger";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NotificationPreview from "./NotificationPreview";

const ProfileSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isSavingSms, setIsSavingSms] = useState(false);
  
  // Email notification preferences
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationOrderUpdates, setNotificationOrderUpdates] = useState(true);
  const [notificationHealthInsights, setNotificationHealthInsights] = useState(true);
  const [notificationPromotions, setNotificationPromotions] = useState(false);
  const [notificationTestReminders, setNotificationTestReminders] = useState(true);

  // SMS notification preferences
  const [notificationSms, setNotificationSms] = useState(false);
  const [notificationSmsResults, setNotificationSmsResults] = useState(true);
  const [notificationSmsAppointments, setNotificationSmsAppointments] = useState(true);
  const [notificationSmsUrgent, setNotificationSmsUrgent] = useState(true);
  
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [nhsNumber, setNhsNumber] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [healthConditions, setHealthConditions] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotificationPreferences();
      fetchSmsPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await usersApi.getUserProfile(user.id);
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setDateOfBirth(data.date_of_birth || "");
        setGender(data.gender || "");
        setPhoneNumber(data.phone_number || "");
        setAddressLine1(data.address_line1 || "");
        setAddressLine2(data.address_line2 || "");
        setCity(data.city || "");
        setPostalCode(data.postal_code || "");
        setNhsNumber(data.nhs_number || "");
        setEmergencyContactName(data.emergency_contact_name || "");
        setEmergencyContactPhone(data.emergency_contact_phone || "");
        setAllergies(data.allergies?.join(", ") || "");
        setMedications(data.medications?.join(", ") || "");
        setHealthConditions(data.health_conditions?.join(", ") || "");
      }
    } catch (error) {
      logger.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotificationPreferences = async () => {
    if (!user) return;
    
    try {
      const data = await preferencesApi.getEmailNotificationPreferences(user.id);
      
      if (data) {
        setNotificationEmail(data.notification_email);
        setNotificationOrderUpdates(data.notification_order_updates);
        setNotificationHealthInsights(data.notification_health_insights);
        setNotificationPromotions(data.notification_promotions);
        setNotificationTestReminders(data.notification_test_reminders);
      }
    } catch (error) {
      logger.error('Error fetching notification preferences:', error);
    }
  };

  const fetchSmsPreferences = async () => {
    if (!user) return;
    
    try {
      const data = await preferencesApi.getSmsNotificationPreferences(user.id);
      
      if (data) {
        setNotificationSms(data.notification_sms);
        setNotificationSmsResults(data.notification_sms_results);
        setNotificationSmsAppointments(data.notification_sms_appointments);
        setNotificationSmsUrgent(data.notification_sms_urgent);
      }
    } catch (error) {
      logger.error('Error fetching SMS preferences:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const updates: Partial<UserProfile> = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth || undefined,
        gender: gender || undefined,
        phone_number: phoneNumber || undefined,
        address_line1: addressLine1 || undefined,
        address_line2: addressLine2 || undefined,
        city: city || undefined,
        postal_code: postalCode || undefined,
        nhs_number: nhsNumber || undefined,
        emergency_contact_name: emergencyContactName || undefined,
        emergency_contact_phone: emergencyContactPhone || undefined,
        allergies: allergies ? allergies.split(",").map(a => a.trim()).filter(Boolean) : [],
        medications: medications ? medications.split(",").map(m => m.trim()).filter(Boolean) : [],
        health_conditions: healthConditions ? healthConditions.split(",").map(h => h.trim()).filter(Boolean) : [],
      };

      const { error } = await usersApi.updateUserProfile(user.id, updates);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      logger.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    
    setIsSavingNotifications(true);
    try {
      const updates: Partial<EmailNotificationPreferences> = {
        notification_email: notificationEmail,
        notification_order_updates: notificationOrderUpdates,
        notification_health_insights: notificationHealthInsights,
        notification_promotions: notificationPromotions,
        notification_test_reminders: notificationTestReminders,
      };

      const result = await preferencesApi.saveEmailNotificationPreferences(user.id, updates);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update preferences');
      }
      
      toast.success('Notification preferences updated');
    } catch (error) {
      logger.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleSaveSms = async () => {
    if (!user) return;
    
    setIsSavingSms(true);
    try {
      const updates: Partial<SmsNotificationPreferences> = {
        notification_sms: notificationSms,
        notification_sms_results: notificationSmsResults,
        notification_sms_appointments: notificationSmsAppointments,
        notification_sms_urgent: notificationSmsUrgent,
      };

      const result = await preferencesApi.saveSmsNotificationPreferences(user.id, updates);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update SMS preferences');
      }
      
      toast.success('SMS preferences updated');
    } catch (error) {
      logger.error('Error updating SMS preferences:', error);
      toast.error('Failed to update SMS preferences');
    } finally {
      setIsSavingSms(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your personal information and health details</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+44 7XXX XXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nhsNumber">NHS Number (Optional)</Label>
            <Input
              id="nhsNumber"
              value={nhsNumber}
              onChange={(e) => setNhsNumber(e.target.value)}
              placeholder="XXX XXX XXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address
          </CardTitle>
          <CardDescription>Your residential address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input
              id="addressLine1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input
              id="addressLine2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Apartment, suite, etc."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="London"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="SW1A 1AA"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
          <CardDescription>Person to contact in case of emergency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">Contact Name</Label>
            <Input
              id="emergencyContactName"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              placeholder="Jane Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
              placeholder="+44 7XXX XXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Information
          </CardTitle>
          <CardDescription>Help us provide better health recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Enter allergies separated by commas (e.g., Peanuts, Penicillin)"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">Separate multiple items with commas</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="Enter medications separated by commas"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">Separate multiple items with commas</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="healthConditions">Health Conditions</Label>
            <Textarea
              id="healthConditions"
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
              placeholder="Enter health conditions separated by commas"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">Separate multiple items with commas</p>
          </div>
        </CardContent>
      </Card>

      {/* Email Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Control what emails you receive from us</CardDescription>
            </div>
            <NotificationPreview />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Email Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="masterEmail" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive all email notifications
              </p>
            </div>
            <Switch
              id="masterEmail"
              checked={notificationEmail}
              onCheckedChange={setNotificationEmail}
            />
          </div>

          <Separator />

          {/* Individual Notification Types */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="orderUpdates" className="text-sm font-medium">
                  Order Updates
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified about your test orders and results
                </p>
              </div>
              <Switch
                id="orderUpdates"
                checked={notificationOrderUpdates}
                onCheckedChange={setNotificationOrderUpdates}
                disabled={!notificationEmail}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="healthInsights" className="text-sm font-medium">
                  Health Insights
                </Label>
                <p className="text-xs text-muted-foreground">
                  Personalised health tips and insights based on your data
                </p>
              </div>
              <Switch
                id="healthInsights"
                checked={notificationHealthInsights}
                onCheckedChange={setNotificationHealthInsights}
                disabled={!notificationEmail}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="testReminders" className="text-sm font-medium">
                  Test Reminders
                </Label>
                <p className="text-xs text-muted-foreground">
                  Reminders for upcoming tests and appointments
                </p>
              </div>
              <Switch
                id="testReminders"
                checked={notificationTestReminders}
                onCheckedChange={setNotificationTestReminders}
                disabled={!notificationEmail}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="promotions" className="text-sm font-medium">
                  Promotions & Offers
                </Label>
                <p className="text-xs text-muted-foreground">
                  Special offers, discounts and new test launches
                </p>
              </div>
              <Switch
                id="promotions"
                checked={notificationPromotions}
                onCheckedChange={setNotificationPromotions}
                disabled={!notificationEmail}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSaveNotifications} 
              disabled={isSavingNotifications}
              size="sm"
            >
              {isSavingNotifications ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Notifications
              </CardTitle>
              <CardDescription>Receive urgent updates via text message</CardDescription>
            </div>
            <NotificationPreview />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master SMS Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="masterSms" className="text-base font-medium">
                SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable text message notifications
              </p>
            </div>
            <Switch
              id="masterSms"
              checked={notificationSms}
              onCheckedChange={setNotificationSms}
            />
          </div>

          {phoneNumber ? (
            <>
              <Alert>
                <Phone className="h-4 w-4" />
                <AlertDescription>
                  SMS notifications will be sent to: <strong>{phoneNumber}</strong>
                </AlertDescription>
              </Alert>

              <Separator />

              {/* Individual SMS Notification Types */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsResults" className="text-sm font-medium">
                      Test Results Available
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified immediately when test results are ready
                    </p>
                  </div>
                  <Switch
                    id="smsResults"
                    checked={notificationSmsResults}
                    onCheckedChange={setNotificationSmsResults}
                    disabled={!notificationSms}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsAppointments" className="text-sm font-medium">
                      Appointment Reminders
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Reminders before your scheduled appointments
                    </p>
                  </div>
                  <Switch
                    id="smsAppointments"
                    checked={notificationSmsAppointments}
                    onCheckedChange={setNotificationSmsAppointments}
                    disabled={!notificationSms}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsUrgent" className="text-sm font-medium">
                      Urgent Health Alerts
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Critical health updates requiring immediate attention
                    </p>
                  </div>
                  <Switch
                    id="smsUrgent"
                    checked={notificationSmsUrgent}
                    onCheckedChange={setNotificationSmsUrgent}
                    disabled={!notificationSms}
                  />
                </div>
              </div>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please add your phone number above to enable SMS notifications. Standard message rates may apply.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSaveSms} 
              disabled={isSavingSms || !phoneNumber}
              size="sm"
            >
              {isSavingSms ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full md:w-auto"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
