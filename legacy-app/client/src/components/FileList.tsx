import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Trash2, File, Image, FileText, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

interface FileListProps {
  entityType: "contract" | "milestone" | "dispute" | "profile" | "verification";
  entityId: string;
  onFileDeleted?: () => void;
  showDelete?: boolean;
}

export function FileList({ entityType, entityId, onFileDeleted, showDelete = true }: FileListProps) {
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  const { data: files, isLoading, refetch } = trpc.files.getEntityFiles.useQuery({
    entityType,
    entityId,
  });

  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => {
      toast.success("File deleted successfully");
      refetch();
      onFileDeleted?.();
    },
    onError: (error) => {
      toast.error(`Failed to delete file: ${error.message}`);
    },
  });

  const downloadUrlMutation = trpc.files.getDownloadUrl.useMutation({
    onSuccess: (data) => {
      // Open download URL in new tab
      window.open(data.url, "_blank");
      setDownloadingFileId(null);
    },
    onError: (error) => {
      toast.error(`Failed to get download link: ${error.message}`);
      setDownloadingFileId(null);
    },
  });

  const handleDownload = (fileId: string) => {
    setDownloadingFileId(fileId);
    downloadUrlMutation.mutate({ fileId });
  };

  const handleDelete = (fileId: string, fileName: string) => {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      deleteMutation.mutate({ fileId });
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <Image className="h-6 w-6 text-primary" />;
    }
    if (["pdf"].includes(ext || "")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    }
    return <File className="h-6 w-6 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (isNaN(size)) return "Unknown size";

    const kb = size / 1024;
    const mb = kb / 1024;

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    return `${kb.toFixed(2)} KB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground text-sm">
        No files uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <Card key={file.id} className="p-4">
          <div className="flex items-center gap-3">
            <div>{getFileIcon(file.fileName)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.fileSize)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDownload(file.id)}
                disabled={downloadingFileId === file.id}
              >
                {downloadingFileId === file.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
              {showDelete && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(file.id, file.fileName)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
