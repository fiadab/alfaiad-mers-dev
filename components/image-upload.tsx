'use client';

import { useEdgeStore } from '@/lib/edgestore';
import { useState } from 'react';
import { SingleImageDropzone } from './single-image-dropzone';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string; // Current image URL
  onChange: (url: string) => void; // Callback when image changes
  onRemoved?: () => void; // Callback when image is removed
  disabled?: boolean; // Disable interaction
}

export function ImageUpload({
  value,
  onChange,
  onRemoved,
  disabled,
}: ImageUploadProps) {
  // State management
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const { edgestore } = useEdgeStore();

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      // Upload to Edge Store
      const res = await edgestore.myPublicImages.upload({
        file,
        options: {
          manualFileName: `job-${Date.now()}-${file.name}`,
          replaceTargetUrl: value, // Replace existing image
        },
        input: { type: 'post' },
        onProgressChange: (progress: number) => { // Add type annotation
          setProgress(progress);
        },
      });

      // Update parent component
      onChange(res.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed');
      console.error(error);
    }
  };

  // Handle image removal
  const handleRemove = () => {
    if (onRemoved) {
      onRemoved(); // Trigger the onRemoved callback if provided
    }
    setFile(undefined); // Reset the local file state
  };

  return (
    <div className="space-y-4">
      <SingleImageDropzone
        width={200}
        height={200}
        value={file ?? value}
        disabled={disabled}
        onChange={(file) => setFile(file)}
        dropzoneOptions={{
          maxSize: 5 * 1024 * 1024, // 5MB limit
        }}
      />
      <div className="flex gap-4">
        {/* Upload button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={disabled || !file}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {progress > 0 ? `Uploading... ${progress}%` : 'Upload Image'}
        </button>
        
        {/* Remove button */}
        {value && !file && (
          <button
            type="button"
            onClick={handleRemove}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
};

