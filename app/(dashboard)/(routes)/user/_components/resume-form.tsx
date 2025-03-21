"use client";
import { AttachmentsUploads } from "@/components/attachments-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { File, Loader2, PlusCircle, ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Resumes, UserProfile,  } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface ResumeFormProps {
  initialData: (UserProfile & { resumes: Resumes[] }) | null;
  userId: string;
}

const formSchema = z.object({
  resumes: z
    .object({
      url: z.string(),
      name: z.string(),
    })
    .array(),
});

export const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActiveResumeId, setIsActiveResumeId] = useState<string | null>(null);
  const router = useRouter();

  const initialResumes = Array.isArray(initialData?.resumes)
    ? initialData.resumes.map((resume) => ({
        url: resume.url,
        name: resume.name,
      }))
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { resumes: initialResumes },
  });

  const validateFiles = (files: any[]): boolean => {
    return files.every(
      (file) =>
        file.size <= 5 * 1024 * 1024 && // حجم الملف <= 2 ميغابايت
        ["application/pdf", "application/msword"].includes(file.type) // أنواع الملفات المدعومة
    );
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/users/${userId}/resumes`, values);
      toast.success("Resume updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (resume: Resumes) => {
    try {
      if (initialData?.activeResumeId === resume.id) {
        toast.error("Cannot delete the active resume");
        return;
      }
      setDeletingId(resume.id);
      await axios.delete(`/api/users/${userId}/resumes/${resume.id}`);
      toast.success("Resume removed");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const setActiveResumeId = async (resumeId: string) => {
    try {
      setIsActiveResumeId(resumeId);
      await axios.patch(`/api/users/${userId}`, { activeResumeId: resumeId });
      toast.success("Resume activated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsActiveResumeId(null);
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job resumes
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" /> Add File
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-2">
          {initialData?.resumes.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2">
              <div className="flex items-center p-3 w-full bg-pink-100 border-purple-200 border text-purple-700 rounded-md col-span-11">
                <File className="w-4 h-4 mr-2" />
                <p className="text-xs w-full truncate">{item.name}</p>
                {deletingId === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1"
                    onClick={() => onDelete(item)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="col-span-2 flex items-center justify-start gap-2">
                {isActiveResumeId === item.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-center",
                      initialData.activeResumeId === item.id
                        ? "text-emerald-500"
                        : "text-red-500"
                    )}
                    onClick={() => setActiveResumeId(item.id)}
                  >
                    <p>
                      {initialData.activeResumeId === item.id
                        ? "Live"
                        : "Activate"}
                    </p>
                    <ShieldCheck className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                      onChange={(resumes) => {
                        if (validateFiles(resumes)) {
                          field.onChange(resumes);
                        } else {
                          toast.error(
                            "Invalid files. Please check the size and type."
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                type="submit"
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
