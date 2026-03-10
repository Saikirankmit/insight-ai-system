import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";

interface DatasetUploaderProps {
  onUpload: (file: File) => void;
}

export function DatasetUploader({ onUpload }: DatasetUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) onUpload(acceptedFiles[0]);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  const dropzoneProps = getRootProps();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div
        {...dropzoneProps}
        className={`glass-panel p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "glow-border border-primary/50 bg-primary/5"
            : "hover:border-primary/20 hover:bg-primary/[0.02]"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            {isDragActive ? (
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            ) : (
              <Upload className="h-8 w-8 text-primary" />
            )}
          </motion.div>
          <div>
            <p className="text-foreground font-semibold text-base">
              {isDragActive ? "Drop your CSV file here" : "Drag & drop a CSV file here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
