import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only sync state here; defer Supabase calls
      if (session?.user) {
        setTimeout(async () => {
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();

          if (data?.role === "admin") {
            navigate("/admin", { replace: true });
          }
        }, 0);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (data?.role === "admin") {
          navigate("/admin", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }

    // Verify admin role after successful login
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin")
      .maybeSingle();

    if (data?.role === "admin") {
      toast({ title: "Welcome, Admin" });
      navigate("/admin", { replace: true });
    } else {
      toast({
        title: "Admin access required",
        description: "This account does not have admin privileges.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
    }
  };

  return (
    <>
      <SEO
        title="Admin Login | Finance Voyage Academy"
        description="Admin login for Finance Voyage Academy."
      />

      <main className="container mx-auto max-w-md py-10">
        <h1 className="mb-6 text-center text-3xl font-bold">Admin Login</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" type="email" {...field} />
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
                    <Input placeholder="Your password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Log in</Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm opacity-80">
          Admin sign-up is disabled. Contact an owner to get access.
        </p>
      </main>
    </>
  );
};

export default AdminAuth;
