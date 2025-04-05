"use client";
import React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { formatFileSize } from "@edgestore/react/utils";
import { FileIcon, UploadCloudIcon } from "lucide-react";

export type FileState = {
  file: File;
  key: string;
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
  abortController?: AbortController;
};

const variants = {
  base: "relative rounded-lg flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200",
  active: "border-blue-500 bg-blue-50 border-2",
  disabled: "bg-gray-100 opacity-50 cursor-not-allowed",
  accept: "border-green-500 bg-green-50",
  reject: "border-red-500 bg-red-50",
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `File too large. Max size: ${formatFileSize(maxSize)}`;
  },
  fileInvalidType() {
    return "Invalid file type";
  },
  tooManyFiles(maxFiles: number) {
    return `Max ${maxFiles} files allowed`;
  },
  fileNotSupported() {
    return "File not supported";
  },
};

interface InputProps {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
}

export const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  ({ dropzoneOptions, value, className, disabled, onFilesAdded, onChange }, ref) => {
    const [customError, setCustomError] = React.useState<string>();

    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);

        if (dropzoneOptions?.maxFiles && (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }

        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: "PENDING",
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    return (
      <div className="w-full">
        <div {...getRootProps({ 
          className: twMerge(
            variants.base,
            isFocused && variants.active,
            disabled && variants.disabled,
            (isDragReject ?? fileRejections[0]) && variants.reject,
            isDragAccept && variants.accept,
            className
          )
        })}>
          <input ref={ref} {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-xs text-gray-400">
            <UploadCloudIcon className="mb-1 h-7 w-7" />
            <div className="text-gray-400">
              drag & drop or click to upload
            </div>
          </div>
        </div>

        <div className="mt-1 text-xs text-red-500">
          {customError ?? (fileRejections[0]?.errors[0]?.message)}
        </div>

        {value?.map(({ file, progress }, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded mt-2">
            <FileIcon className="w-5 h-5" />
            <span className="text-sm truncate">{file.name}</span>
            {typeof progress === 'number' ? (
              <div className="ml-auto w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    progress === 100 ? 'bg-green-500' :
                    progress === 0 ? 'bg-orange-500' :
                    typeof progress === 'string' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : (
              <span className="ml-auto text-sm text-gray-500">
                {progress}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
);

MultiFileDropzone.displayName = "MultiFileDropzone";