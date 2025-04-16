
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";

const QRScanner = () => {
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);
  
  const startScanner = () => {
    setScanning(true);
    toast.info("Please allow camera access to scan QR codes");
    
    // In a real implementation, this would use a QR scanner library
    // For now, we'll just simulate scanning with a timeout
    setTimeout(() => {
      setScanning(false);
      // Simulate a result
      const mockUrl = "https://example.com/scanned-qr-code";
      setResult(mockUrl);
      toast.success("QR code scanned successfully!");
    }, 3000);
  };

  const copyToClipboard = () => {
    if (!result) {
      toast.error("No QR code has been scanned yet");
      return;
    }
    
    navigator.clipboard.writeText(result)
      .then(() => {
        toast.success("Result copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };
  
  return (
    <AnimatedElement>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
            {scanning ? (
              <div className="text-center">
                <div className="w-64 h-64 border-4 border-primary mx-auto mb-4 rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-0 border-t-4 border-primary animate-scan"></div>
                  <p className="text-muted-foreground">Scanning...</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-64 h-64 border border-dashed border-muted mx-auto mb-4 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Camera feed will appear here</p>
                </div>
                <Button onClick={startScanner} className="mt-4">
                  {result ? "Scan Again" : "Start Scanner"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-medium">Scan Results</h3>
            
            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg break-all">
                  {result}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {result.startsWith("http") ? "URL detected" : "Text detected"}
                  </p>
                  
                  <div className="flex gap-3">
                    <Button onClick={copyToClipboard} variant="outline" className="w-full">
                      Copy to Clipboard
                    </Button>
                    
                    {result.startsWith("http") && (
                      <Button
                        onClick={() => window.open(result, "_blank")}
                        className="w-full"
                      >
                        Open URL
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No QR code has been scanned yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click the Start Scanner button to begin
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(224px); }
          100% { transform: translateY(0); }
        }
        .animate-scan {
          animation: scan 3s infinite;
        }
      `}</style>
    </AnimatedElement>
  );
};

export default QRScanner;
