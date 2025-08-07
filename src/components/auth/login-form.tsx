"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/validators";
import { AstralLogo } from "../icons/astral-logo";
import { Separator } from "../ui/separator";

const REMEMBERED_EMAIL_KEY = 'astral-remembered-email';

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
        if (rememberedEmail) {
            form.setValue('email', rememberedEmail);
            form.setValue('rememberMe', true);
        }
    }
  }, [form]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      // Handle localStorage
      if (typeof window !== 'undefined') {
        if (values.rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
        sessionStorage.setItem('loggedInEmail', values.email);
      }

      // Create request with proper options
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      };

      const response = await fetch('/api/auth/login', requestOptions);

      // Handle response based on status
      if (response.status >= 200 && response.status < 300) {
        // Success - parse JSON
        const data = await response.json();

        toast({
          title: "Login Successful",
          description: "Welcome to AstralCore!",
        });

        // Store user role for routing
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userRole', data.role || 'user');
        }

        // Redirect based on role
        if (data.role === 'admin') {
          router.push('/admin');
        } else if (data.role === 'moderator') {
          router.push('/moderator');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Error - try to get error message
        let errorMessage = 'An error occurred during login';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("UI: Google sign-in clicked");
    // Placeholder for Google sign-in logic
  };

  const handleEmailSignIn = () => {
    console.log("UI: Email sign-in clicked");
    // Placeholder for email sign-in logic
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <AstralLogo className="mx-auto h-28 w-28" />
        <CardTitle className="text-2xl font-headline">Astral Core</CardTitle>
        <CardDescription>
          Access your Hyperdrive trading intelligence platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button variant="outline" onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
          <Button variant="outline" onClick={handleEmailSignIn}>
            Sign in with Email
          </Button>
        </div>
        <div className="relative my-4">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            OR
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button variant="link" asChild className="p-0 h-auto text-sm">
                      <Link
                        href="/forgot-password"
                        className="font-medium text-primary/80 hover:text-primary"
                      >
                        Forgot password?
                      </Link>
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Remember me
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Authorizing..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="w-full text-muted-foreground">
          Don't have an account?{" "}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link
                href="/register"
                className="font-semibold text-primary hover:text-primary/90"
            >
                Register
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
