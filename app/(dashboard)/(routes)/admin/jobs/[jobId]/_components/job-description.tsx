"use client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
 } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Job } from "prisma/prisma-client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { date, z } from "zod";

interface JobDescriptionProps{
    initialData: Job
        jobId : string;
  }

const formSchema = z.object({
  description: z.string().min(1),

});

export const JobDescription = ({
  initialData,
  jobId,
} : JobDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [rollname, setRollname ] = useState("");
    const [skills, setSkills] = useState("");
    const [aiValue, setAiValue] = useState("");
    const [isPrompting, setIsPrompting] = useState(false);
     const router = useRouter();
      const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
          description : initialData?.description || ""
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

     const handlePromptGeneration = async () => {
      try {
        setIsPrompting(true);
        const customPrompt = `Could you please draft a job requirements document for the position of ${rollname}? the job description should include roles & responsibilities, key features, and details about the role. The required skills should include proficiency in ${skills}. Additionally, you can list any optional skill related to jop. Thanks!`;

        await getGenerativeAIResponse(customPrompt).then((data) => {
          console.log(data);
          data = data.replace(/^'|'$/g, "");
            let cleanedText = data.replace(/[\*\#]/g, "");
        //form.setValue("description",cleanedText)
         setAiValue(cleanedText);
        setIsPrompting(false);
        });

      } catch (error) {
        console.error("Error during prompt generation:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsPrompting(false);
      }
    };


    const onCopy = () => {
      navigator.clipboard.writeText(aiValue)
      toast.success("Copied To Clipboard")
    };

     return   <div className="mt-6 border bg-neutral-100 rounded-md p-4 ">
                  <div className="font-medium flex items-center justify-between">
                       Job  Description
                    <Button onClick={toggleEditing} variant={"ghost"}>
                        {isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
                    </Button>
                  </div>
                  {/* display the Category if not editing */}
                  {!isEditing &&(

                  <div className={cn("text-sm mt-2", !initialData.description && "text-neutral-500 italic")}>
                    {!initialData.description && "No Description"}
                    {initialData.description && (
                      <Preview value={initialData.description}/>
                    )}
                  </div>

                  )}

                    {/* On Editing Mode Display the Input */}
                    {isEditing &&(
                    <>
                    <div className="flex items-center gap-2 my-2">
                 <input
                 type="text"
                 placeholder="e.g 'Full-Stack-Developer'"
                 value={rollname}
                 onChange={(e) => setRollname(e.target.value)}
                 className="w-full p-2 rounded-md"
                 />
                 <input
                 type="text"
                 placeholder="Required Skills Sets"
                 value={skills}
                 onChange={(e) => setSkills(e.target.value)}
                 className="w-full p-2 rounded-md"
                 />
                 {isPrompting ? (<>
                      <Button><Loader2 className="w-4 h-4 animate-spin"/></Button>
                 </>
                ) : (
                  <>
                  <Button onClick={handlePromptGeneration}>
                    <Lightbulb className="w-4 h-4"/>
                    </Button>
                </>)}
                    </div>
                    <p className="text-xs text-muted-foreground text-right">Note*: Profession Name & Required Skills Delimetted by Coma</p>


            {aiValue && (
              <div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
                {aiValue}
                <Button className="absolute top-3 right-3 z-10" variant={"outline"} size={"icon"} onClick={onCopy}>
                  <Copy className="w-4 h-4"/>
                </Button>
              </div>

            )}

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                            control={form.control}
                            name ="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                 <Editor 
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
                    </>
                    )}
               </div>;
              };
