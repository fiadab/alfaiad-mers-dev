"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface WorkModeFormProps {
  initialData: {
    workMode: string | null;
  };
  jobId: string;
}

// خيارات "وضع العمل"
let options = [
  {
    value: "remote",
    label: "Remote",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
  {
    value: "office",
    label: "Office",
  },
];

const formSchema = z.object({
  workMode: z.string().min(1, "Please select a work mode."),
});

export const WorkModeForm = ({
  initialData,
  jobId,
}: WorkModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // حالة التحرير
  const router = useRouter();

  // إعداد الفورم
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMode: initialData?.workMode || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // إرسال البيانات عند التحديث
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

  const toggleEditing = () => setIsEditing((current) => !current); // تبديل حالة التحرير

  // تحديد الخيار المختار من البيانات الأولية
  const selectedOption = options.find(
    (option) => option.value === initialData.workMode
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Work Mode
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {/* عند عدم التحرير */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.workMode && "text-neutral-500 italic"
          )}
        >
          {selectedOption?.label || "No Work Mode added"}
        </p>
      )}

      {/* عند التحرير */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="workMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      heading="Work Mode"
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
