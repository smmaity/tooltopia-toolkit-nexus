
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Scissors, FileText, X, Download } from "lucide-react";
import { toast } from "sonner";
import AnimatedElement from "@/components/animated-element";
import { PDFDocument } from 'pdf-lib';
import { Checkbox } from "@/components/ui/checkbox";

interface PageRange {
  start: number;
  end: number;
}

const PdfSplitter = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [ranges, setRanges] = useState<PageRange[]>([{ start: 1, end: 1 }]);
  const [extractAll, setExtractAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    try {
      // Load the PDF document to get page count
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPageCount();
      
      setPdfFile(file);
      setPageCount(pages);
      setRanges([{ start: 1, end: Math.min(pages, 1) }]);
      
      toast.success(`PDF loaded with ${pages} pages`);
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error("Failed to load PDF. The file might be corrupted.");
    }
  };

  const handleAddRange = () => {
    setRanges([...ranges, { start: 1, end: Math.min(pageCount, 1) }]);
  };

  const handleRemoveRange = (index: number) => {
    if (ranges.length === 1) {
      toast.error("You need at least one range");
      return;
    }
    
    const newRanges = [...ranges];
    newRanges.splice(index, 1);
    setRanges(newRanges);
  };

  const updateRange = (index: number, field: "start" | "end", value: string) => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue) || numValue < 1 || numValue > pageCount) {
      return;
    }
    
    const newRanges = [...ranges];
    newRanges[index][field] = numValue;
    
    // Ensure start <= end
    if (field === "start" && numValue > newRanges[index].end) {
      newRanges[index].end = numValue;
    } else if (field === "end" && numValue < newRanges[index].start) {
      newRanges[index].start = numValue;
    }
    
    setRanges(newRanges);
  };

  const extractPages = async () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file first");
      return;
    }

    try {
      setIsLoading(true);
      
      // Load the original PDF
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      if (extractAll) {
        // Extract each page as a separate PDF
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          
          // Save and download
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement("a");
          a.href = url;
          a.download = `page_${i + 1}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        
        toast.success(`Extracted ${pageCount} individual pages`);
      } else {
        // Extract specified ranges
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          const newPdf = await PDFDocument.create();
          
          // Convert to 0-based index and ensure valid range
          const startIndex = Math.max(0, range.start - 1);
          const endIndex = Math.min(pageCount - 1, range.end - 1);
          
          // Create page indices array
          const pageIndices = [];
          for (let j = startIndex; j <= endIndex; j++) {
            pageIndices.push(j);
          }
          
          // Copy pages to the new document
          const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
          copiedPages.forEach(page => newPdf.addPage(page));
          
          // Save and download
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement("a");
          a.href = url;
          a.download = `split_${range.start}-${range.end}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        
        toast.success(`Extracted ${ranges.length} PDF${ranges.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error("Error splitting PDF:", error);
      toast.error("Failed to split PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetTool = () => {
    setPdfFile(null);
    setPageCount(0);
    setRanges([{ start: 1, end: 1 }]);
    setExtractAll(false);
  };

  return (
    <AnimatedElement className="space-y-6">
      <div className="bg-muted/40 rounded-lg border p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pdf-upload" className="text-lg font-medium">
              Upload PDF File
            </Label>
            <p className="text-muted-foreground text-sm">
              Upload the PDF file you want to split into multiple documents.
            </p>
            
            <div className="flex gap-4 items-center mt-2">
              <div className="relative">
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <Button variant="outline" className="gap-2">
                  <Upload size={18} />
                  Select PDF File
                </Button>
              </div>
              
              {pdfFile && (
                <Button 
                  variant="ghost" 
                  onClick={resetTool} 
                  className="gap-2"
                >
                  <X size={18} />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {pdfFile && (
            <AnimatedElement animation="fadeIn" className="mt-6 space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
                <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-medium">{pdfFile.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB • {pageCount} pages
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="extract-all" 
                    checked={extractAll}
                    onCheckedChange={(checked) => setExtractAll(checked === true)}
                  />
                  <Label htmlFor="extract-all" className="text-sm font-medium">
                    Extract each page as a separate PDF
                  </Label>
                </div>
                
                {!extractAll && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Page Ranges to Extract</Label>
                    
                    {ranges.map((range, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={pageCount}
                          value={range.start}
                          onChange={(e) => updateRange(index, "start", e.target.value)}
                          className="w-20"
                        />
                        <span className="text-sm">to</span>
                        <Input
                          type="number"
                          min={1}
                          max={pageCount}
                          value={range.end}
                          onChange={(e) => updateRange(index, "end", e.target.value)}
                          className="w-20"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRange(index)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={ranges.length <= 1}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddRange}
                      className="mt-2"
                    >
                      Add Range
                    </Button>
                  </div>
                )}
                
                <Button 
                  variant="default" 
                  onClick={extractPages} 
                  disabled={isLoading}
                  className="gap-2 mt-4"
                >
                  <Scissors size={18} />
                  Split PDF
                </Button>
              </div>
            </AnimatedElement>
          )}
        </div>
      </div>
    </AnimatedElement>
  );
};

export default PdfSplitter;
