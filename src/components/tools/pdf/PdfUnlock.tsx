
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Lock, Unlock, Key } from "lucide-react";
import { toast } from "sonner";
import AnimatedElement from "@/components/animated-element";
import { Progress } from "@/components/ui/progress";

const PdfUnlock = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    setPdfFile(file);
  };

  const unlockPdf = () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file first");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress intervals
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          handleUnlockComplete();
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  const handleUnlockComplete = () => {
    // Simulate PDF unlocking
    setTimeout(() => {
      toast.success("PDF unlocked successfully!", {
        description: "This is a simulated unlock. In a real app, this would use a PDF decryption library."
      });
      
      // Create a mock download
      const blob = new Blob(["Simulated unlocked PDF data"], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFile!.name.replace(".pdf", "_unlocked.pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
      setProgress(0);
    }, 500);
  };

  return (
    <AnimatedElement className="space-y-6">
      <div className="bg-muted/40 rounded-lg border p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pdf-upload" className="text-lg font-medium">
              Upload Password-Protected PDF File
            </Label>
            <p className="text-muted-foreground text-sm">
              Upload the password-protected PDF file you want to unlock.
            </p>
            
            <div className="relative mt-2">
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <Button variant="outline" className="gap-2 w-full md:w-auto">
                <Upload size={18} />
                Select PDF File
              </Button>
            </div>
          </div>

          {pdfFile && (
            <AnimatedElement animation="fadeIn" className="mt-4 space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-background">
                <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-medium text-sm md:text-base max-w-[250px] truncate">
                    {pdfFile.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Key size={14} />
                  PDF Password (if known)
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If you know the password, enter it above for faster unlocking.
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="default" 
                  onClick={unlockPdf} 
                  disabled={isLoading}
                  className="gap-2 w-full md:w-auto"
                >
                  {isLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Unlock size={18} />
                      Unlock PDF
                    </>
                  )}
                </Button>
              </div>
              
              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Unlocking PDF...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </AnimatedElement>
          )}
          
          <div className="mt-4 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
            <div className="flex gap-2">
              <Lock className="text-yellow-600 dark:text-yellow-400 shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <p className="font-medium">Privacy notice</p>
                <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-1">
                  Your files are processed securely in your browser. We do not store or share your PDF or password.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedElement>
  );
};

export default PdfUnlock;
