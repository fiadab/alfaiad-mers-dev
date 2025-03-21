"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Props لتمرير البيانات
interface YearsOfExperienceFormProps {
  initialData: {
    yearsOfExperience: string | null;
  };
  jobId: string;
}

// خيارات سنوات الخبرة
const options = [
  { value: "0", label: "Fresher" },
  { value: "2", label: "0-2 Years" },
  { value: "3", label: "2-4 Years" },
  { value: "5", label: "5+ Years" },
];

// مخطط Zod للتحقق
const formSchema = z.object({
  yearsOfExperience: z.string().min(1, "Please select an experience level."),
});

export const YearsOfExperienceForm = ({
  initialData,
  jobId,
}: YearsOfExperienceFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // حالة التحرير
  const router = useRouter();

  // إعداد الفورم
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData?.yearsOfExperience || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // إرسال البيانات
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated successfully.");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current); // تبديل التحرير

  // القيمة الحالية المحددة
  const selectedOption = options.find(
    (option) => option.value === initialData.yearsOfExperience
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      {/* العنوان */}
      <div className="font-medium flex items-center justify-between">
        Years of Experience
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {/* العرض عند عدم التحرير */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.yearsOfExperience && "text-neutral-500 italic"
          )}
        >
          {selectedOption?.label || "No experience added"}
        </p>
      )}

      {/* وضع التحرير */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      heading="Select Experience"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
