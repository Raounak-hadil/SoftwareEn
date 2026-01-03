'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { login, signInWithGoogle } from '@/app/actions/auth';
import { Cairo, Inter } from 'next/font/google'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});

export default function LoginPreview() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const supabase = createClient();

    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      toast.error('Authentication failed. Please try again.');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const redirectTo = urlParams.get('redirectTo') || '/dashboard';
        router.push(redirectTo);
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // ✅ Fix TypeScript error by asserting values have required properties
      const response = await login(values as { email: string; password: string });
      if (response.error) {
        toast.error(response.error);
        form.setError('root', { message: response.error });
        return;
      }
      toast('Login successful. You will be redirected to the app shortly.');
      setLoggedIn(true);

      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirectTo') || '/dashboard';
      router.push(redirectTo);
    } finally {
      form.reset();
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-black/80 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-lg">Give us a sec...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8FF] flex flex-col h-screen w-full items-center justify-center p-4">
      <Card className="bg-white border border-white mx-auto w-full max-w-md" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <CardHeader>
          <CardTitle className="text-2xl text-[#1C4186] font-semibold">مرحبا بكم في اكاديمية إكسلونسيا</CardTitle>
          <CardDescription className="text-[#64748B]">أدخل اسم المستخدم وكلمة المرور للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email" className="text-[#020617] text-base">البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input id="email" className="rounded-[5px] p-5 text-[#94A3B8] border border-[#94A3B8] !bg-white" placeholder="أدخل بريدك الإلكتروني" type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password" className="text-[#020617] text-base">كلمة المرور</FormLabel>
                      </div>
                      <FormControl>
                        <PasswordInput id="password" className="rounded-[5px] p-5 text-[#94A3B8] border border-[#94A3B8] !bg-white" placeholder="أدخل كلمة المرور" autoComplete="current-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className={`w-full rounded-[5px] p-5 ${loggedIn ? 'bg-black hover:bg-black' : 'bg-[#1C4186] hover:bg-[#15346A]'}`}
                  disabled={form.formState.isSubmitting || loggedIn}
                >
                  {loggedIn ? 'Logged In' : form.formState.isSubmitting ? 'Logging in...' : 'تسجيل الدخول'}
                </Button>
              </div>
            </form>
          </Form>

          {/* Google / Apple login buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground text-[#94A3B8]">تسجيل الدخول بواسطة</span>
              </div>
            </div>

            <div className="mt-4 gap-2 flex flex-wrap justify-center">
              <Button
                variant="outline"
                className="mt-4 w-full sm:w-[48%] items-center justify-center gap-2 rounded-[5px] border !border-[#94A3B8] !bg-white text-black"
                onClick={async () => {
                  const { url, error } = await signInWithGoogle();
                  if (error) {
                    toast.error(error);
                    return;
                  }
                  if (url) window.location.href = url;
                }}
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="mt-4 w-full sm:w-[48%] flex items-center justify-center rounded-[5px] gap-2 border !border-[#94A3B8] !bg-white text-black"
                onClick={async () => {
                  const { url, error } = await signInWithGoogle();
                  if (error) {
                    toast.error(error);
                    return;
                  }
                  if (url) window.location.href = url;
                }}
              >
                Apple
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-[#94A3B8]">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-[#1152AB] font-semibold">
              إنشاء حساب
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
