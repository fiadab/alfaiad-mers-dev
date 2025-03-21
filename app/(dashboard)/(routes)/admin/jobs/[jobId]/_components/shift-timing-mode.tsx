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
interface ShiftTimingFormProps {
  initialData: {
    shiftTiming: string | null; // الحقل المراد تحديثه
  };
  jobId: string;
}

// خيارات الشفتات
const options = [
  {
    value: "full-time",
    label: "Full Time",
  },
  {
    value: "part-time",
    label: "Part Time",
  },
  {
    value: "contract",
    label: "Contract",
  },
];

// مخطط Zod للتحقق من البيانات
const formSchema = z.object({
  shiftTiming: z.string().min(1, "Please select a shift timing."),
});

// الكومبوننت
export const ShiftTimingForm = ({
  initialData,
  jobId,
}: ShiftTimingFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // حالة التحرير
  const router = useRouter(); // إعادة التوجيه وتحديث البيانات

  // إعداد نموذج الفورم
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shiftTiming: initialData?.shiftTiming || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // إرسال البيانات إلى الـ API
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated successfully.");
      toggleEditing(); // الخروج من وضع التحرير
      router.refresh(); // تحديث الصفحة
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current); // تبديل وضع التحرير

  const selectedOption = options.find(
    (option) => option.value === initialData.shiftTiming
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      {/* العنوان */}
      <div className="font-medium flex items-center justify-between">
        Job Shift Timing
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>

      {/* عرض القيمة الحالية */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.shiftTiming && "text-neutral-500 italic"
          )}
        >
          {selectedOption?.label || "No Timing added"}
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
              name="shiftTiming"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options} // تمرير الخيارات
                      heading="Timings"
                      {...field} // تمرير البيانات
                      onChange={(value) => field.onChange(value)} // تحديث الفورم
                      value={field.value} // القيمة الحالية
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
