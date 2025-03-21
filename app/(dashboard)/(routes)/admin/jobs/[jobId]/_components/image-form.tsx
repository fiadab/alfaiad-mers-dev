"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";
import { Job } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";

const formSchema = z.object({
  image: z.string().optional(),
});

interface ImageFormProps {
  initialData: Job;
  jobId: string;
}

export const ImageForm = ({ initialData, jobId }: ImageFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: initialData.imageUrl || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const { data } = await axios.patch(`/api/jobs/${jobId}`, {
        imageUrl: values.image
      });

      toast.success("Image updated successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data || "Error updating image");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};