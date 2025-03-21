"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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

interface CompanyFormProps{
    initialData: Job
        jobId : string;
        options: {label:string, value:string}[];
  }

const formSchema = z.object({
  companyId: z.string().min(1),

});

export const CompanyForm = ({initialData, jobId, options} : CompanyFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
     const router = useRouter();
      const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
          companyId : initialData?.companyId || ""
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

     const selectedOption = options.find(option => option.value === initialData.companyId);

     return   <div className="mt-6 border bg-neutral-100 rounded-md p-4 ">
                  <div className="font-medium flex items-center justify-between">
                       Job Crated By
                    <Button onClick={toggleEditing} variant={"ghost"}>
                        {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
                    </Button>
                  </div>
                  {/* display the Category if not editing */}
                  {!isEditing && <p className={cn("text-sm mt-2", !initialData?.companyId && "text-neutral-500 italic")}>{selectedOption?.label || "No Company"}</p>}

                    {/* On Editing Mode Display the Input */}
                    {isEditing && (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                            control={form.control}
                            name ="companyId"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                        options={options}
                                        heading = "Companies"
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
