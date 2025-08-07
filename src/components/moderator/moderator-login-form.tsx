"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { clientLogin as login } from "@/lib/auth-client";

const moderatorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

type ModeratorLoginFormValues = z.infer<typeof moderatorLoginSchema>;

const MOCK_MODERATOR_EMAIL = "moderator@astralcore.io";

export function ModeratorLoginForm({ onLoginSuccess }: { onLoginSuccess: (email: string) => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ModeratorLoginFormValues>({
    resolver: zodResolver(moderatorLoginSchema),
    defaultValues: {
      email: MOCK_MODERATOR_EMAIL,
      password: "moderator", // Pre-fill for demo
    },
  });

  const onSubmit = async (values: ModeratorLoginFormValues) => {
    setIsLoading(true);
    
    const { error } = await login(values);

    if (error) {
       toast({
        title: "Login Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      sessionStorage.setItem('loggedInEmail', values.email);
      toast({
        title: "Moderator Login Successful",
        description: "Welcome to the AstralCore Moderator panel.",
      });
      onLoginSuccess(values.email);
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Moderator Access</CardTitle>
        <CardDescription>
          Please provide moderator credentials to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moderator Email</FormLabel>
                  <FormControl>
                    <Input placeholder="moderator@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Authorize
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
