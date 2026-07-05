import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, File, Image, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface FileUploadProps {
  entityType: "contract" | "milestone" | "dispute" | "profile" | "verification";
  entityId: string;
  onUploadComplete?: (fileId: string) => void;
  maxFiles?: number;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  id: string;
}

export function FileUpload({
  entityType,
  entityId,
  onUploadComplete,
  maxFiles = 5,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip",
  maxSizeMB = 50,
  multiple = true,
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: (data) => {
      toast.success(`File uploaded successfully`);
      onUploadComplete?.(data.id);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Check max files limit
    if (uploadingFiles.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (const file of fileArray) {
      // Check file size
      if (file.size > maxSizeBytes) {
        toast.error(`${file.name} exceeds ${maxSizeMB}MB size limit`);
        continue;
      }

      // Add to uploading list
      const uploadId = `${Date.now()}-${file.name}`;
      setUploadingFiles((prev) => [
        ...prev,
        { file, progress: 0, id: uploadId },
      ]);

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          const base64String = base64Data.split(",")[1]; // Remove data:image/png;base64, prefix

          // Update progress
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === uploadId ? { ...f, progress: 50 } : f))
          );

          // Upload file
          await uploadMutation.mutateAsync({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileData: base64String,
            entityType,
            entityId,
          });

          // Remove from uploading list
          setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
        } catch (error) {
          console.error("Upload error:", error);
          setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
        }
      };

      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so same file can be uploaded again
    e.target.value = "";
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <Image className="h-8 w-8 text-primary" />;
    }
    if (["pdf"].includes(ext || "")) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <File className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-1">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Max {maxFiles} files, up to {maxSizeMB}MB each
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
          />
        </div>
      </Card>

      {/* Uploading files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadingFile) => (
            <Card key={uploadingFile.id} className="p-4">
              <div className="flex items-center gap-3">
                <div>{getFileIcon(uploadingFile.file.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadingFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${uploadingFile.progress}%` }}
                    />
                  </div>
                </div>
                {uploadingFile.progress < 100 ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadingFile(uploadingFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
