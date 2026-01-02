'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export default function ForgetPasswordPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submit button clicked with:", values); // DEBUG 1

    try {
      // DEBUG 2: Ensure the path matches your folder structure exactly
      const res = await fetch('/api/auth/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email })
      });

      console.log("Response status:", res.status); // DEBUG 3

      const data = await res.json();
      console.log("Response data:", data); // DEBUG 4

      if (res.ok && data.success) {
        toast.success('Password reset email sent!');
        // Fallback if toast is missing
        alert('Success: Password reset email sent check your inbox');
      } else {
        toast.error(data.error || 'Failed to send.');
        alert('Error: ' + (data.error || 'Failed to send'));
      }
    } catch (error) {
      console.error('Network or Parse Error:', error);
      toast.error('Network error occurred.');
      alert('Network error occurred see console.');
    }
  }

  // DEBUG 5: Check if validation errors are blocking submit
  const onError = (errors: any) => {
    console.log("Form validation failed:", errors);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to reset password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {/* Note: Added onError to handleSubmit to catch validation issues */}
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
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
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}