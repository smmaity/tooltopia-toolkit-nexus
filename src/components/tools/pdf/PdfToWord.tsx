
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, FileType2, ArrowRight, Download } from "lucide-react";
import { toast } from "sonner";
import AnimatedElement from "@/components/animated-element";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PdfToWord = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [wordFile, setWordFile] = useState<File | null>(null);

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    setPdfFile(file);
  };

  const handleWordFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check if the file is a Word document
    if (!file.type.includes("word") && 
        !file.name.endsWith(".doc") && 
        !file.name.endsWith(".docx")) {
      toast.error("Please upload a Word document (.doc or .docx)");
      return;
    }
    
    setWordFile(file);
  };

  const convertPdfToWord = () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file first");
      return;
    }

    setIsLoading(true);
    
    // In a real implementation, this would connect to a conversion API
    // For now we'll simulate the conversion
    setTimeout(() => {
      toast.success("Your PDF has been converted to Word", {
        description: "This is a simulated conversion. In a real app, this would use a document conversion API."
      });
      
      // Create a mock download
      const blob = new Blob(["This is a mock Word document"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFile.name.replace(".pdf", ".docx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
    }, 2000);
  };

  const convertWordToPdf = () => {
    if (!wordFile) {
      toast.error("Please upload a Word document first");
      return;
    }

    setIsLoading(true);
    
    // In a real implementation, this would connect to a conversion API
    // For now we'll simulate the conversion
    setTimeout(() => {
      toast.success("Your Word document has been converted to PDF", {
        description: "This is a simulated conversion. In a real app, this would use a document conversion API."
      });
      
      // Create a mock download
      const blob = new Blob(["This is a mock PDF"], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = wordFile.name.replace(/\.docx?$/, ".pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
    }, 2000);
  };

  const resetForm = (type: "pdf" | "word") => {
    if (type === "pdf") {
      setPdfFile(null);
    } else {
      setWordFile(null);
    }
  };

  return (
    <AnimatedElement className="space-y-6">
      <Tabs defaultValue="pdf-to-word" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="pdf-to-word" className="flex gap-2 items-center">
            <FileText size={16} />
            <span>PDF to Word</span>
          </TabsTrigger>
          <TabsTrigger value="word-to-pdf" className="flex gap-2 items-center">
            <FileType2 size={16} />
            <span>Word to PDF</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pdf-to-word" className="mt-6">
          <div className="bg-muted/40 rounded-lg border p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pdf-upload" className="text-lg font-medium">
                  Upload PDF File
                </Label>
                <p className="text-muted-foreground text-sm">
                  Upload the PDF file you want to convert to a Word document.
                </p>
                
                <div className="flex gap-4 items-center mt-2">
                  <div className="relative">
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handlePdfFileChange}
                    />
                    <Button variant="outline" className="gap-2">
                      <Upload size={18} />
                      Select PDF File
                    </Button>
                  </div>
                  
                  <Button 
                    variant="default" 
                    onClick={convertPdfToWord} 
                    disabled={!pdfFile || isLoading}
                    className="gap-2"
                  >
                    <Download size={18} />
                    Convert to Word
                  </Button>
                </div>
              </div>

              {pdfFile && (
                <AnimatedElement animation="fadeIn" className="mt-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 border rounded-lg bg-background">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                        <FileText size={20} />
                      </div>
                      <div className="text-center md:text-left">
                        <div className="font-medium text-sm md:text-base max-w-[250px] truncate">
                          {pdfFile.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <ArrowRight className="mx-4 text-muted-foreground" />
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                        <FileType2 size={20} />
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              )}
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>The conversion is processed securely. Maximum file size: 10MB.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="word-to-pdf" className="mt-6">
          <div className="bg-muted/40 rounded-lg border p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="word-upload" className="text-lg font-medium">
                  Upload Word Document
                </Label>
                <p className="text-muted-foreground text-sm">
                  Upload the Word document you want to convert to a PDF file.
                </p>
                
                <div className="flex gap-4 items-center mt-2">
                  <div className="relative">
                    <Input
                      id="word-upload"
                      type="file"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleWordFileChange}
                    />
                    <Button variant="outline" className="gap-2">
                      <Upload size={18} />
                      Select Word File
                    </Button>
                  </div>
                  
                  <Button 
                    variant="default" 
                    onClick={convertWordToPdf} 
                    disabled={!wordFile || isLoading}
                    className="gap-2"
                  >
                    <Download size={18} />
                    Convert to PDF
                  </Button>
                </div>
              </div>

              {wordFile && (
                <AnimatedElement animation="fadeIn" className="mt-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 border rounded-lg bg-background">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                        <FileType2 size={20} />
                      </div>
                      <div className="text-center md:text-left">
                        <div className="font-medium text-sm md:text-base max-w-[250px] truncate">
                          {wordFile.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(wordFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <ArrowRight className="mx-4 text-muted-foreground" />
                      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                        <FileText size={20} />
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              )}
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>The conversion is processed securely. Maximum file size: 10MB.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AnimatedElement>
  );
};

export default PdfToWord;
