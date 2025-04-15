
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image as ImageIcon, Maximize } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ImageSizeIncreaser = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [scaleFactor, setScaleFactor] = useState<number>(2);
  const [scaleMethod, setScaleMethod] = useState<"factor" | "exact">("factor");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    
    // Read the file
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setTargetWidth(img.width * scaleFactor);
        setTargetHeight(img.height * scaleFactor);
        setOriginalImage(e.target?.result as string);
        enlargeImage(e.target?.result as string, img.width, img.height, img.width * scaleFactor, img.height * scaleFactor);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const enlargeImage = (dataUrl: string, origWidth: number, origHeight: number, newWidth: number, newHeight: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Use a higher quality smoothing algorithm
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      // Draw enlarged image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Get enlarged image data URL
      const enlargedDataUrl = canvas.toDataURL("image/png");
      setEnlargedImage(enlargedDataUrl);
    };
    img.src = dataUrl;
  };
  
  const handleScaleFactorChange = (value: string) => {
    const factor = parseFloat(value);
    setScaleFactor(factor);
    if (originalImage && originalWidth && originalHeight) {
      setTargetWidth(originalWidth * factor);
      setTargetHeight(originalHeight * factor);
      enlargeImage(originalImage, originalWidth, originalHeight, originalWidth * factor, originalHeight * factor);
    }
  };
  
  const handleScaleMethodChange = (value: string) => {
    setScaleMethod(value as "factor" | "exact");
  };
  
  const handleTargetWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    setTargetWidth(width);
    if (originalHeight && originalWidth) {
      // Maintain aspect ratio
      const aspectRatio = originalWidth / originalHeight;
      setTargetHeight(Math.round(width / aspectRatio));
    }
  };
  
  const handleTargetHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    setTargetHeight(height);
    if (originalHeight && originalWidth) {
      // Maintain aspect ratio
      const aspectRatio = originalWidth / originalHeight;
      setTargetWidth(Math.round(height * aspectRatio));
    }
  };
  
  const handleResizeClick = () => {
    if (originalImage && originalWidth && originalHeight && targetWidth && targetHeight) {
      enlargeImage(originalImage, originalWidth, originalHeight, targetWidth, targetHeight);
      toast.success("Image resized successfully");
    }
  };
  
  const handleDownload = () => {
    if (!enlargedImage) return;
    
    const link = document.createElement("a");
    link.href = enlargedImage;
    link.download = "enlarged-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Enlarged image downloaded successfully");
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="image-upload">Upload Image</Label>
          <div className="flex gap-2">
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              ref={fileInputRef}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              size="icon"
            >
              <Upload size={18} />
            </Button>
          </div>
        </div>
        
        {originalImage && (
          <>
            <div className="space-y-2">
              <Label htmlFor="scale-method">Resize Method</Label>
              <Select value={scaleMethod} onValueChange={handleScaleMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resize method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="factor">Scale by Factor</SelectItem>
                  <SelectItem value="exact">Exact Dimensions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {scaleMethod === "factor" ? (
              <div className="space-y-2">
                <Label htmlFor="scale-factor">Scale Factor</Label>
                <Select value={scaleFactor.toString()} onValueChange={handleScaleFactorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scale factor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                    <SelectItem value="3">3x</SelectItem>
                    <SelectItem value="4">4x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target-width">Width (px)</Label>
                  <Input 
                    id="target-width" 
                    type="number" 
                    min="1"
                    value={targetWidth}
                    onChange={handleTargetWidthChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-height">Height (px)</Label>
                  <Input 
                    id="target-height" 
                    type="number" 
                    min="1"
                    value={targetHeight}
                    onChange={handleTargetHeightChange}
                  />
                </div>
                <Button onClick={handleResizeClick} className="w-full">
                  <Maximize size={18} className="mr-2" />
                  Resize Image
                </Button>
              </div>
            )}
            
            <div className="text-sm space-y-1">
              <p>Original Dimensions: {originalWidth} × {originalHeight} px</p>
              <p>New Dimensions: {targetWidth} × {targetHeight} px</p>
            </div>
            
            {enlargedImage && (
              <Button onClick={handleDownload} className="w-full">
                <Download size={18} className="mr-2" />
                Download Enlarged Image
              </Button>
            )}
          </>
        )}
      </div>
      
      <div className="flex flex-col space-y-4">
        {!originalImage && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md bg-muted/50">
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon size={48} className="mb-2" />
              <p>Upload an image to enlarge</p>
            </div>
          </div>
        )}
        
        {originalImage && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Original Image ({originalWidth} × {originalHeight} px)</Label>
              <div className="border rounded-md overflow-hidden bg-checkerboard">
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-auto max-h-[300px] object-contain"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Enlarged Image ({targetWidth} × {targetHeight} px)</Label>
              <div className="border rounded-md overflow-hidden bg-checkerboard">
                <img 
                  src={enlargedImage || ''} 
                  alt="Enlarged" 
                  className="w-full h-auto max-h-[300px] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSizeIncreaser;
