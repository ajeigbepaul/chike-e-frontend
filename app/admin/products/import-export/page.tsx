"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ImportExportPage() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append("file", file);

      // TODO: Implement API call to import products
      // const response = await fetch('/api/products/import', {
      //   method: 'POST',
      //   body: formData,
      // })

      toast.success("Products imported successfully");
    } catch (error) {
      toast.error("Failed to import products");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // TODO: Implement API call to export products
      // const response = await fetch('/api/products/export')
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'products.csv'
      // document.body.appendChild(a)
      // a.click()
      // window.URL.revokeObjectURL(url)
      // document.body.removeChild(a)

      toast.success("Products exported successfully");
    } catch (error) {
      toast.error("Failed to export products");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Import/Export Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Import Products</h2>
          <p className="text-sm text-gray-500 mb-4">
            Import products from a CSV or Excel file. Download the template
            below to see the required format.
          </p>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // TODO: Implement template download
                toast.success("Template download coming soon");
              }}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleImport}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="w-full" disabled={isImporting}>
                <UploadIcon className="h-4 w-4 mr-2" />
                {isImporting ? "Importing..." : "Choose File"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Export Products</h2>
          <p className="text-sm text-gray-500 mb-4">
            Export all products to a CSV file. The file will include all product
            details, variants, and inventory information.
          </p>
          <Button
            className="w-full"
            onClick={handleExport}
            disabled={isExporting}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Products"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
