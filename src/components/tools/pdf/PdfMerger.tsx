
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Plus, Trash2, MoveUp, MoveDown, FileText } from "lucide-react";
import { toast } from "sonner";
import AnimatedElement from "@/components/animated-element";
import { PDFDocument } from 'pdf-lib';

interface PdfFile {
  file: File;
  name: string;
  size: string;
  preview?: string;
}

const PdfMerger = () => {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: PdfFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} is not a PDF file`);
        continue;
      }
      
      newFiles.push({
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB"
      });
    }
    
    setPdfFiles([...pdfFiles, ...newFiles]);
    
    // Reset the input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const newFiles = [...pdfFiles];
    newFiles.splice(index, 1);
    setPdfFiles(newFiles);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === pdfFiles.length - 1)
    ) {
      return;
    }

    const newFiles = [...pdfFiles];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap positions
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    
    setPdfFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      toast.error("Please add at least 2 PDF files to merge");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Process each file
      for (const pdfFile of pdfFiles) {
        // Load the PDF file
        const fileArrayBuffer = await pdfFile.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        
        // Copy pages from the source PDF to the merged PDF
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
      
      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      
      // Create a blob from the PDF bytes
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("PDFs merged successfully!");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast.error("Failed to merge PDFs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedElement className="space-y-6">
      <div className="bg-muted/40 rounded-lg border p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pdf-upload" className="text-lg font-medium">
              Upload PDF Files
            </Label>
            <p className="text-muted-foreground text-sm">
              Upload the PDF files you want to merge. You can rearrange them to set the order.
            </p>
            
            <div className="flex gap-4 items-center mt-2">
              <div className="relative">
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <Button variant="outline" className="gap-2">
                  <Upload size={18} />
                  Select PDF Files
                </Button>
              </div>
              
              <Button 
                variant="default" 
                onClick={mergePDFs} 
                disabled={pdfFiles.length < 2 || isLoading}
                className="gap-2"
              >
                <Plus size={18} />
                Merge PDFs
              </Button>
            </div>
          </div>

          {pdfFiles.length > 0 && (
            <AnimatedElement animation="fadeIn" className="mt-6">
              <div className="text-sm font-medium mb-2">
                {pdfFiles.length} {pdfFiles.length === 1 ? "file" : "files"} selected
              </div>
              <div className="border rounded-lg divide-y">
                {pdfFiles.map((file, index) => (
                  <div 
                    key={`${file.name}-${index}`} 
                    className="p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-muted rounded">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-sm truncate max-w-[200px] sm:max-w-xs">
                          {file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{file.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveFile(index, "up")}
                        disabled={index === 0}
                        className="h-8 w-8"
                      >
                        <MoveUp size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveFile(index, "down")}
                        disabled={index === pdfFiles.length - 1}
                        className="h-8 w-8"
                      >
                        <MoveDown size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedElement>
          )}
        </div>
      </div>
    </AnimatedElement>
  );
};

export default PdfMerger;
