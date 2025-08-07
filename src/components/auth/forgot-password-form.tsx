"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, ArrowLeft, KeyRound, Mail, Shield, CheckCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useToast } from "@/hooks/use-toast";
import { forgotPasswordSchema } from "@/lib/validators";
import { clientForgotPassword as resetPasswordForEmail } from "@/lib/auth-client";
import { AstralLogo } from "../icons/astral-logo";

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: 'Failed to send reset email' };
        }

        toast({
          title: "Error",
          description: errorData.error || "Failed to send reset email",
          variant: "destructive",
        });
      } else {
        const data = await response.json();
        setIsSuccess(true);
        toast({
          title: "Success",
          description: data.message || "Password reset instructions have been sent to your email.",
        });
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-border/40 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-lg animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-3 rounded-full border border-green-400/30 backdrop-blur-xl">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-white">Recovery Email Sent!</CardTitle>
          <CardDescription className="text-gray-300">
            We've sent password reset instructions to your email address. Check your inbox and follow the link to reset your password.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-400/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-1">Hyperdrive Security Active</h4>
                <p className="text-xs text-gray-300">Your recovery link is encrypted and will expire in 24 hours for maximum security.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>Didn't receive the email? Check your spam folder or</p>
            <Button
              variant="link"
              className="p-0 h-auto text-orange-400 hover:text-orange-300"
              onClick={() => setIsSuccess(false)}
            >
              try again
            </Button>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-border/40 shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-orange-400/30 rounded-full blur-lg animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-orange-500/20 to-red-500/10 p-3 rounded-full border border-orange-400/30 backdrop-blur-xl">
            <KeyRound className="h-10 w-10 text-orange-400" />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <RefreshCw className="h-5 w-5 text-orange-400" />
          Password Recovery
        </CardTitle>
        <CardDescription className="text-gray-300">
          Enter your email address and we'll send you hyperdrive-encrypted recovery instructions.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-10 bg-black/20 border-border/40 focus:border-orange-400/60 text-white placeholder:text-gray-500"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-400/20">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-300">
                    Recovery links are secured with hyperdrive encryption and expire automatically for your protection.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Recovery Link...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Send Recovery Link
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <Link
                href="/login"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Login
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/register"
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
