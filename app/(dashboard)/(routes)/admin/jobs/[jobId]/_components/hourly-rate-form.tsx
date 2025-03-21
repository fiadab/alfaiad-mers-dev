"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Job } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface HourlyRateFormProps{
    initialData: Job
        jobId : string;
  }

const formSchema = z.object({
  hourlyRate: z.string().min(1),

});

export const HourlyRateForm = ({
  initialData,
  jobId,
} : HourlyRateFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
     const router = useRouter();
      const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
          hourlyRate : initialData?.hourlyRate || ""
        },
      });

    const {isSubmitting, isValid} = form.formState;

     const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
               const response = await axios.patch(`/api/jobs/${jobId}`, values);
               toast.success("Job updated");
               toggleEditing();
               router.refresh();
        } catch (error) {
            toast.error("Something went Wrong");
        }
     };

     const toggleEditing = () => setIsEditing ((current) => !current);

     return   <div className="mt-6 border bg-neutral-100 rounded-md p-4 ">
                  <div className="font-medium flex items-center justify-between">
                       Job Hourly Rate
                    <Button onClick={toggleEditing} variant={"ghost"}>
                        {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
                    </Button>
                  </div>
                  {/* display the Category if not editing */}
                  {!isEditing && (
                  <p className="text-sm mt-2">
                   {initialData.hourlyRate
                    ? `$ ${initialData?.hourlyRate}/hrs`
                    : "$ 0/hr"}
                    </p>
                  )}

                    {/* On Editing Mode Display the Input */}
                    {isEditing && (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                            control={form.control}
                            name ="hourlyRate"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                       <Input
                                       placeholder="Type The Hourly Rate"
                                       disabled={isSubmitting}
                                       {...field}
                                       />
                                    </FormControl>
                                      <FormMessage />
                                </FormItem>
                            )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button disabled={!isValid || isSubmitting} type="submit">
                                  Save
                                </Button>
                            </div>
                          </form>
                        </Form>
                    )}
               </div>;
              };
