"use client";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { MultiFileDropzone, type FileState } from "./multi-file-dropzone";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

interface AttachmentsUploadsProps {
  disabled: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}

export const AttachmentsUploads = ({
  disabled,
  onChange,
  value,
}: AttachmentsUploadsProps) => {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  const handleUpload = async (files: FileState[]) => {
    const uploadedFiles: { url: string; name: string }[] = [];
    
    try {
      await Promise.all(
        files.map(async (fileState) => {
          try {
            const res = await edgestore.myProtectedFiles.upload({
              file: fileState.file,
              options: { temporary: false },
              onProgressChange: (progress) => {
                setFileStates(prev => prev.map(state => 
                  state.key === fileState.key ? { 
                    ...state, 
                    progress: typeof progress === 'number' ? progress : 0
                  } : state
                ));
              },
            });
            uploadedFiles.push({ 
              url: res.url, 
              name: fileState.file.name 
            });
          } catch (error) {
            toast.error(`Failed to upload ${fileState.file.name}`);
            throw error;
          }
        })
      );
      
      onChange([...value, ...uploadedFiles]);
      setFileStates([]);
    } catch (error) {
      toast.error("File upload failed");
    }
  };

  return (
    <div className="space-y-4">
      <MultiFileDropzone
        value={fileStates}
        onChange={setFileStates}
        onFilesAdded={handleUpload}
        disabled={disabled}
        dropzoneOptions={{ 
          maxFiles: 5, 
          maxSize: 5 * 1024 * 1024 // 5MB
        }}
      />
      
      <div className="space-y-2">
        {fileStates.map((fileState) => (
          <div key={fileState.key} className="flex items-center gap-2">
            <Progress 
              value={typeof fileState.progress === 'number' 
                ? fileState.progress 
                : 0} 
              className="h-2 w-full" 
            />
            <span className="text-sm">
              {fileState.file.name} (
              {Math.round(
                typeof fileState.progress === 'number' 
                  ? fileState.progress 
                  : 0
              )}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

