"use client";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanyLogoFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  logo: z.string().min(1, { message: "Logo is required" }),
});

export const CompanyLogoForm = ({ initialData, companyId }: CompanyLogoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: initialData?.logo || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Logo
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="ghost"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        !initialData.logo ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative w-full h-60 mt-2">
            <Image
              alt="Logo"
              fill
              priority
              quality={85}
              className="object-cover rounded-md"
              src={
                initialData.logo.startsWith('http') 
                  ? initialData.logo
                  : `https://files.edgestore.dev/myPublicImages/${initialData.logo}`
              }
              sizes="(max-width: 768px) 80px, 80px"
              onError={(e) => {
                e.currentTarget.src = '/default-logo.png';
              }}
            />
          </div>
        )
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      onRemoved={() => field.onChange("")}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button 
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};