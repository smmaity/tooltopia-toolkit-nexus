
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image as ImageIcon, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ResizeMethod = "stretch" | "scale" | "crop" | "fill";

interface ResizeOption {
  value: ResizeMethod;
  label: string;
}

const resizeOptions: ResizeOption[] = [
  { value: "stretch", label: "Stretch (ignore ratio)" },
  { value: "scale", label: "Scale (maintain ratio)" },
  { value: "crop", label: "Crop (maintain ratio)" },
  { value: "fill", label: "Fill (maintain ratio)" },
];

const ImageDimensionChanger = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [resizeMethod, setResizeMethod] = useState<ResizeMethod>("scale");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
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
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setOriginalImage(e.target?.result as string);
        setResizedImage(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(event.target.value) || 0;
    setTargetWidth(width);
    
    if (lockAspectRatio && originalWidth && originalHeight) {
      // Maintain aspect ratio
      const aspectRatio = originalWidth / originalHeight;
      setTargetHeight(Math.round(width / aspectRatio));
    }
  };
  
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(event.target.value) || 0;
    setTargetHeight(height);
    
    if (lockAspectRatio && originalWidth && originalHeight) {
      // Maintain aspect ratio
      const aspectRatio = originalWidth / originalHeight;
      setTargetWidth(Math.round(height * aspectRatio));
    }
  };
  
  const handleLockToggle = () => {
    setLockAspectRatio(!lockAspectRatio);
  };
  
  const handleResizeMethodChange = (value: string) => {
    setResizeMethod(value as ResizeMethod);
  };
  
  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value);
  };
  
  const resizeImage = () => {
    if (!originalImage || !targetWidth || !targetHeight) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Fill background color (useful for transparent PNGs)
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      switch (resizeMethod) {
        case "stretch":
          // Simply stretch the image to fit target dimensions
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          break;
          
        case "scale":
          // Scale to fit maintaining aspect ratio
          const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (targetWidth - scaledWidth) / 2;
          const y = (targetHeight - scaledHeight) / 2;
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          break;
          
        case "crop":
          // Scale to cover and crop
          const scaleToFill = Math.max(targetWidth / img.width, targetHeight / img.height);
          const scaledW = img.width * scaleToFill;
          const scaledH = img.height * scaleToFill;
          const cropX = (scaledW - targetWidth) / 2;
          const cropY = (scaledH - targetHeight) / 2;
          ctx.drawImage(img, cropX, cropY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
          break;
          
        case "fill":
          // Fill entire area, possible letterboxing
          const fillScale = Math.min(targetWidth / img.width, targetHeight / img.height);
          const fillWidth = img.width * fillScale;
          const fillHeight = img.height * fillScale;
          const fillX = (targetWidth - fillWidth) / 2;
          const fillY = (targetHeight - fillHeight) / 2;
          ctx.drawImage(img, 0, 0, img.width, img.height, fillX, fillY, fillWidth, fillHeight);
          break;
      }
      
      const resizedDataUrl = canvas.toDataURL("image/png");
      setResizedImage(resizedDataUrl);
      toast.success("Image dimensions changed successfully");
    };
    img.src = originalImage;
  };
  
  const handleApplyClick = () => {
    resizeImage();
  };
  
  const handleDownload = () => {
    if (!resizedImage) return;
    
    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = "resized-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Resized image downloaded successfully");
  };
  
  // Update resized image when resize method or background color changes
  useEffect(() => {
    if (originalImage && targetWidth && targetHeight) {
      resizeImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeMethod, backgroundColor]);
  
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
            <div className="text-sm mb-2">
              <p>Original Dimensions: {originalWidth} × {originalHeight} px</p>
            </div>
            
            <div className="space-y-4 border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <Label>Dimensions</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={handleLockToggle}
                >
                  {lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                  <span className="ml-1 text-xs">{lockAspectRatio ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked"}</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input 
                    id="width" 
                    type="number"
                    min="1"
                    value={targetWidth}
                    onChange={handleWidthChange}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input 
                    id="height" 
                    type="number"
                    min="1"
                    value={targetHeight}
                    onChange={handleHeightChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resize-method">Resize Method</Label>
              <Select value={resizeMethod} onValueChange={handleResizeMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resize method" />
                </SelectTrigger>
                <SelectContent>
                  {resizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="background-color">Background Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 border rounded"
                  style={{ backgroundColor: backgroundColor }}
                ></div>
                <Input 
                  id="background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                  className="w-full h-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleApplyClick} className="flex-1">
                Apply Changes
              </Button>
              
              {resizedImage && resizedImage !== originalImage && (
                <Button onClick={handleDownload} variant="secondary" className="flex-1">
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="flex flex-col space-y-4">
        {!originalImage && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md bg-muted/50">
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon size={48} className="mb-2" />
              <p>Upload an image to resize</p>
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
              <Label>Resized Image ({targetWidth} × {targetHeight} px)</Label>
              <div className="border rounded-md overflow-hidden bg-checkerboard">
                <img 
                  src={resizedImage || ''} 
                  alt="Resized" 
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

export default ImageDimensionChanger;
