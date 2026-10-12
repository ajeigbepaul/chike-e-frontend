"use client";

import { useRef, useState } from "react";
import { Upload, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  parseAttributeSheet,
  type Specification,
} from "@/services/api/products";

/** Axios surfaces the server message under response.data.message. */
const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.message || fallback;

// One row per specification. A value may list several entries separated by
// commas - the quotes matter so the comma stays inside the cell.
const TEMPLATE_CSV = `key,value
Material,Galvanised Steel
Finish,Matte
Size,"2 inch,3 inch,4 inch"
Color options,"Silver,Grey,Black"
Weight,2.5kg
Thickness,1.2mm
Warranty,2 years
Origin,Nigeria
`;

interface AttributeSheetImportProps {
  /** How many specification rows the form already holds. */
  existingCount: number;
  onImport: (specs: Specification[], mode: "append" | "replace") => void;
}

export function AttributeSheetImport({
  existingCount,
  onImport,
}: AttributeSheetImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsed, setParsed] = useState<Specification[] | null>(null);

  const handleDownloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-specifications-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset immediately so picking the same file twice still fires onChange.
    e.target.value = "";
    if (!file) return;

    setIsParsing(true);
    try {
      const specs = await parseAttributeSheet(file);
      if (specs.length === 0) {
        toast.error("No specifications found in that file");
        return;
      }
      // Nothing to merge with - apply straight away.
      if (existingCount === 0) {
        onImport(specs, "replace");
        toast.success(
          `Imported ${specs.length} specification${specs.length === 1 ? "" : "s"}`
        );
        return;
      }
      setParsed(specs);
    } catch (error: any) {
      toast.error(getErrorMessage(error, "Failed to read that file"));
    } finally {
      setIsParsing(false);
    }
  };

  const applyImport = (mode: "append" | "replace") => {
    if (!parsed) return;
    onImport(parsed, mode);
    toast.success(
      mode === "append"
        ? `Added ${parsed.length} specifications`
        : `Replaced with ${parsed.length} specifications`
    );
    setParsed(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isParsing}
        >
          {isParsing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isParsing ? "Reading..." : "Import from CSV/Excel"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDownloadTemplate}
        >
          <Download className="h-4 w-4 mr-2" />
          Template
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Only shown when there are existing rows that could be lost. */}
      <Dialog
        open={Boolean(parsed)}
        onOpenChange={(open) => !open && setParsed(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Import {parsed?.length} specification
              {parsed?.length === 1 ? "" : "s"}
            </DialogTitle>
            <DialogDescription>
              This product already has {existingCount} specification
              {existingCount === 1 ? "" : "s"}. Add the imported ones to the
              existing list, or replace it entirely?
            </DialogDescription>
          </DialogHeader>

          {parsed && (
            <div className="max-h-56 overflow-y-auto rounded border text-sm">
              {parsed.slice(0, 20).map((spec, i) => (
                <div
                  key={i}
                  className="flex justify-between gap-4 px-3 py-1.5 border-b last:border-b-0"
                >
                  <span className="font-medium text-gray-600 truncate">
                    {spec.key}
                  </span>
                  <span className="text-gray-900 truncate">{spec.value}</span>
                </div>
              ))}
              {parsed.length > 20 && (
                <div className="px-3 py-1.5 text-gray-500">
                  and {parsed.length - 20} more...
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setParsed(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => applyImport("append")}>
              Add to existing
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => applyImport("replace")}
            >
              Replace all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AttributeSheetImport;
