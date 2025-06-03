import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Upload } from 'lucide-react'

export function ImportExportForm() {
  return (
    <div className="space-y-8">
      <div className="border rounded-lg p-6">
        <h3 className="font-medium mb-4">Import Products</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="import-file">Upload Excel File</Label>
            <Input id="import-file" type="file" className="mt-2" />
            <p className="text-sm text-gray-500 mt-1">
              Download our template file to ensure proper formatting
            </p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Import Products
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="font-medium mb-4">Export Products</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export as Excel
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}