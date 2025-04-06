// app/(admin)/admin/create/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string()
    .min(1, "Job title is required")
    .max(100, "Title must be less than 100 characters")
    .refine(val => val.trim().length > 0, {
      message: "Title cannot be only whitespace"
    })
});

export default function JobCreatePage() {
  const { userId, isLoaded, getToken } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
    mode: "onChange"
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) return;
    
    setIsSubmitting(true);
    try {
      const token = await getToken();
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      router.push(`/admin/jobs/${data.id}`);
      toast.success('Job created successfully');
    } catch (error: any) {
      console.error('Creation Error:', error);
      toast.error(error.message || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Create New Job Posting</h1>
          <p className="text-sm text-muted-foreground">
            Start by naming your job position. You can edit this later.
          </p>
        </div>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Senior Full Stack Developer"
                      {...field}
                      className="max-w-md"
                      autoComplete="off"
                      aria-describedby="jobTitleHelp"
                    />
                  </FormControl>
                  <FormDescription id="jobTitleHelp">
                    This will be the public title for your job posting
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/admin/jobs">
                <Button 
                  type="button" 
                  variant="ghost"
                  disabled={isSubmitting}
                  aria-label="Cancel job creation"
                >
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={!form.formState.isValid || isSubmitting}
                aria-disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}