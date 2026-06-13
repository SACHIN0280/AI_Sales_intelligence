"use client";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  data: unknown;
  filename?: string;
  label?: string;
}

export default function ExportButton({ data, filename = "export", label = "Export" }: ExportButtonProps) {
  const handleExport = () => {
    toast.error("🚀 Premium Feature: Coming in v2.0");
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 btn-secondary"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
}
