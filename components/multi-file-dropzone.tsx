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

const variants = {
  base: "relative rounded-md flex justify-center items-center flex-col cursor-pointer border border-dashed transition-colors duration-200",
  active: "border-2",
  disabled: "bg-gray-200 cursor-default pointer-events-none",
  accept: "border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border-red-700 bg-red-700 bg-opacity-10",
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

    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className,
        ).trim(),
      [isFocused, fileRejections, isDragAccept, isDragReject, disabled, className]
    );


    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        }
        
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div className="w-full">
        {/* Dropzone */}
        <div {...getRootProps({ className: dropZoneClassName })}>
          <input ref={ref} {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-xs text-gray-400">
            <UploadCloudIcon className="mb-1 h-7 w-7" />
            <div className="text-gray-400">
              drag & drop or click to upload
            </div>
          </div>
        </div>

        {/* Message error view*/}
        <div className="mt-1 text-xs text-red-500">
          {customError ?? errorMessage}
        </div>

        {/* file upload view*/}
        {value?.map(({ file, progress }, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded mt-2">
            <FileIcon className="w-5 h-5" />
            <span className="text-sm truncate">{file.name}</span>
            {progress === "PENDING" && (
              <span className="ml-auto text-sm text-gray-500">
                Pending...
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
);

MultiFileDropzone.displayName = "MultiFileDropzone";

