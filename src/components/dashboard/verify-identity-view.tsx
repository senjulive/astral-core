"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { addNotification } from "@/lib/notifications";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Save, 
  ShieldCheck, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  Camera,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Shield,
  Fingerprint,
  Brain,
  Eye
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getUserRank } from "@/lib/ranks";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters.").max(50),
  idCardNo: z.string().regex(/^\d{9,}$/, "ID Card Number must be at least 9 digits and contain only numbers."),
  address: z.string().min(10, "Please enter a full address.").max(100, "Address is too long."),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Please use YYYY-MM-DD.",
  }).refine((val) => new Date(val) < new Date() && new Date(val) > new Date("1900-01-01"), {
    message: "Please enter a valid date of birth."
  }),
  idCardFront: z.instanceof(File, { message: "Front of ID card is required." }),
  idCardBack: z.instanceof(File, { message: "Back of ID card is required." }),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const ImageUploadField = ({
  field,
  label,
  preview,
  clearFn,
}: {
  field: any;
  label: string;
  preview: string | null;
  clearFn: () => void;
}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("File is too large. Please select a file smaller than 5MB.");
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert("Invalid file type. Please select an image.");
                return;
            }
            field.onChange(file);
        }
    };
  
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div>
                     <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={inputRef}
                        onChange={handleFileChange}
                     />
                    {preview ? (
                        <div className="relative group aspect-video rounded-md border border-dashed border-border/40 flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-xl">
                            <Image src={preview} alt="ID preview" layout="fill" objectFit="contain" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={clearFn}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="w-full aspect-video rounded-md border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-black/20 backdrop-blur-xl"
                        >
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-sm font-medium">Click to upload</span>
                            <span className="text-xs">PNG, JPG, or WEBP (max 5MB)</span>
                        </button>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export function VerifyIdentityView() {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [frontPreview, setFrontPreview] = React.useState<string | null>(null);
  const [backPreview, setBackPreview] = React.useState<string | null>(null);
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [activeTab, setActiveTab] = React.useState("verification");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      idCardNo: "",
      address: "",
      dateOfBirth: "",
    },
  });

  const frontFile = form.watch("idCardFront");
  const backFile = form.watch("idCardBack");

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (frontFile) {
      const reader = new FileReader();
      reader.onloadend = () => setFrontPreview(reader.result as string);
      reader.readAsDataURL(frontFile);
    } else {
      setFrontPreview(null);
    }
  }, [frontFile]);

  React.useEffect(() => {
    if (backFile) {
      const reader = new FileReader();
      reader.onloadend = () => setBackPreview(reader.result as string);
      reader.readAsDataURL(backFile);
    } else {
      setBackPreview(null);
    }
  }, [backFile]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;
    setIsSubmitting(true);
    
    try {
      // Mock file upload and data persistence
      const idCardFrontUrl = frontPreview; // Using data URL for mock
      const idCardBackUrl = backPreview;

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          fullName: values.fullName,
          idCardNo: values.idCardNo,
          address: values.address,
          dateOfBirth: new Date(values.dateOfBirth).toISOString(),
          idCardFrontUrl,
          idCardBackUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile.');
      }

      toast({
        title: "Verification Submitted",
        description: "Your documents are being verified. This may take a few minutes.",
      });

      await addNotification(user.id, {
        title: "Verification in Progress",
        content: "Your profile information has been submitted for verification.",
        href: "/dashboard/profile"
      });
      
      router.push('/dashboard/profile');

    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBalance = wallet?.balances?.usdt ?? 0;
  const rank = getUserRank(totalBalance);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Profile-style Header */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-blue-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500/30 to-purple-500/20 text-blue-400 font-bold text-lg backdrop-blur-xl">
                    {wallet?.profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    KYC Verification
                  </h1>
                  <ShieldCheck className="h-6 w-6 text-blue-400 mx-auto sm:mx-0" />
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Complete your identity verification for AstralCore
                </p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className="flex items-center gap-1 text-xs bg-blue-500/20 text-blue-300 border-blue-400/40">
                    <Eye className="h-3 w-3" />
                    Identity Verification
                  </Badge>
                  <Badge variant="outline" className="text-xs border-yellow-400/40 text-yellow-300 bg-yellow-400/10">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <CheckCircle className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Email</p>
            <p className="text-xs text-green-400">Verified</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-2 rounded-lg border border-yellow-400/30">
                <Shield className="h-5 w-5 mx-auto text-yellow-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">KYC</p>
            <p className="text-xs text-yellow-400">Pending</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <Fingerprint className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">2FA</p>
            <p className="text-xs text-blue-400">Enabled</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <Brain className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Level</p>
            <p className="text-xs text-purple-400">{rank.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-0">
          <div className="flex border-b border-border/40">
            <button
              onClick={() => setActiveTab("verification")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "verification"
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Identity Verification
              </div>
              {activeTab === "verification" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "documents"
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Camera className="h-4 w-4" />
                Document Upload
              </div>
              {activeTab === "documents" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === "verification" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Complete Your Identity Verification</h3>
                  <p className="text-sm text-gray-400">
                    Provide your personal information to verify your identity and unlock full access to AstralCore features.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-400" />
                              Full Name (as on ID)
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full legal name" 
                                {...field} 
                                className="bg-black/20 border-border/40 backdrop-blur-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idCardNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-blue-400" />
                              ID Card Number
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your national ID number" 
                                {...field} 
                                className="bg-black/20 border-border/40 backdrop-blur-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            Date of Birth
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              placeholder="YYYY-MM-DD" 
                              {...field} 
                              className="bg-black/20 border-border/40 backdrop-blur-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            Full Residential Address
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your full address" 
                              {...field} 
                              className="bg-black/20 border-border/40 backdrop-blur-xl resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Upload Identity Documents</h3>
                  <p className="text-sm text-gray-400">
                    Please upload clear photos of both sides of your government-issued ID card.
                  </p>
                </div>

                <Form {...form}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="idCardFront"
                      render={({ field }) => (
                        <ImageUploadField
                          field={field}
                          label="ID Card (Front Side)"
                          preview={frontPreview}
                          clearFn={() => {
                            form.setValue("idCardFront", undefined as any, { shouldValidate: true });
                          }}
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idCardBack"
                      render={({ field }) => (
                        <ImageUploadField
                          field={field}
                          label="ID Card (Back Side)"
                          preview={backPreview}
                          clearFn={() => {
                            form.setValue("idCardBack", undefined as any, { shouldValidate: true });
                          }}
                        />
                      )}
                    />
                  </div>
                </Form>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                className="w-full sm:w-auto min-w-48 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
