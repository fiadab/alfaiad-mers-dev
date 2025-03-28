"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from "@/components/ui/form";
import { Attachment, Job } from "@prisma/client";
import { File, PlusCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AttachmentsUploads } from "@/components/attachments-upload";

const formSchema = z.object({
  attachments: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().url(),
      name: z.string().min(1)
    })
  )
});

interface AttachmentsFormProps {
  initialData: Job & { attachments: Attachment[] };
  jobId: string;
}

export const AttachmentsForm = ({ initialData, jobId }: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      attachments: initialData.attachments || [] 
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/attachments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, attachments: values.attachments })
      });
      
      if (!res.ok) throw new Error("Update failed");
      
      setIsEditing(false);
      toast.success("Attachments updated successfully");
    } catch (error) {
      toast.error("Failed to update attachments");
    }
  };

  const handleDelete = async (attachmentId: string) => {
    try {
      setIsDeleting(attachmentId);
      const res = await fetch(
        `/api/jobs/${jobId}/attachments?attachmentId=${attachmentId}`,
        { method: "DELETE" }
      );
      
      if (!res.ok) throw new Error("Deletion failed");
      
      form.setValue(
        "attachments",
        form.getValues("attachments").filter(a => a.id !== attachmentId)
      );
      toast.success("Attachment deleted");
    } catch (error) {
      toast.error("Failed to delete attachment");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="mt-6 border bg-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Attachments</h3>
        <Button 
          onClick={() => setIsEditing(!isEditing)} 
          variant="outline"
          size="sm"
        >
          {isEditing ? 'Cancel' : 'Manage Attachments'}
        </Button>
      </div>

      {!isEditing ? (
        <div className="space-y-3">
          {form.watch("attachments").map((a) => (
            <div key={a.id} className="flex items-center p-3 bg-accent/50 rounded-md">
              <File className="w-5 h-5 mr-3" />
              <a 
                href={a.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 truncate hover:underline"
              >
                {a.name}
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => a.id && handleDelete(a.id)}
                disabled={isDeleting === a.id}
              >
                {isDeleting === a.id ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <Trash2 className="w-4 h-4 text-destructive" />
                )}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      onChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

