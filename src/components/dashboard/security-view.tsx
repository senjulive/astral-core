
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Loader2, Save, Shield } from "lucide-react";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const withdrawalPasscodeSchema = z.object({
    currentPassword: z.string().min(1, "Your account password is required."),
    newPasscode: z.string().regex(/^\d{4,6}$/, "Passcode must be 4-6 digits."),
    confirmPasscode: z.string(),
}).refine(data => data.newPasscode === data.confirmPasscode, {
    message: "Passcodes do not match.",
    path: ["confirmPasscode"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type PasscodeFormValues = z.infer<typeof withdrawalPasscodeSchema>;

export function SecurityView() {
  const { toast } = useToast();
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [isSavingPasscode, setIsSavingPasscode] = React.useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  
  const passcodeForm = useForm<PasscodeFormValues>({
      resolver: zodResolver(withdrawalPasscodeSchema),
      defaultValues: { currentPassword: "", newPasscode: "", confirmPasscode: "" },
  });

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsSavingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Password change request:", values);
    setIsSavingPassword(false);
    toast({
      title: "Password Updated",
      description: "Your account password has been changed successfully.",
    });
    passwordForm.reset();
  };
  
  const onPasscodeSubmit = async (values: PasscodeFormValues) => {
      setIsSavingPasscode(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Passcode change request:", values);
      setIsSavingPasscode(false);
      toast({
        title: "Withdrawal Passcode Set",
        description: "Your new passcode is now active.",
      });
      passcodeForm.reset();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="h-6 w-6" /><span>Change Password</span></CardTitle>
          <CardDescription>For your security, we recommend choosing a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (<FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (<FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="flex justify-end"><Button type="submit" disabled={isSavingPassword}>{isSavingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Update Password</Button></div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-6 w-6" /><span>Withdrawal Passcode</span></CardTitle>
            <CardDescription>Set a separate 4-6 digit passcode for an extra layer of security when withdrawing funds.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...passcodeForm}>
                <form onSubmit={passcodeForm.handleSubmit(onPasscodeSubmit)} className="space-y-4">
                    <FormField control={passcodeForm.control} name="currentPassword" render={({ field }) => (<FormItem><FormLabel>Current Account Password</FormLabel><FormControl><Input type="password" placeholder="Enter your login password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={passcodeForm.control} name="newPasscode" render={({ field }) => (<FormItem><FormLabel>New 4-6 Digit Passcode</FormLabel><FormControl><Input type="password" maxLength={6} placeholder="••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={passcodeForm.control} name="confirmPasscode" render={({ field }) => (<FormItem><FormLabel>Confirm New Passcode</FormLabel><FormControl><Input type="password" maxLength={6} placeholder="••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="flex justify-end"><Button type="submit" disabled={isSavingPasscode}>{isSavingPasscode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Set Passcode</Button></div>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
