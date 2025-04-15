
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type ImageFormat = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

interface FormatOption {
  value: ImageFormat;
  label: string;
  extension: string;
}

const formatOptions: FormatOption[] = [
  { value: "image/jpeg", label: "JPEG", extension: "jpg" },
  { value: "image/png", label: "PNG", extension: "png" },
  { value: "image/webp", label: "WebP", extension: "webp" },
  { value: "image/gif", label: "GIF", extension: "gif" },
];

const ImageFormatConverter = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [originalFormat, setOriginalFormat] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("image/png");
  const [quality, setQuality] = useState<number>(90);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    
    setOriginalFormat(file.type);
    
    // Read the file
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      convertImageFormat(e.target?.result as string, targetFormat);
    };
    reader.readAsDataURL(file);
  };
  
  const convertImageFormat = (dataUrl: string, format: ImageFormat) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // For transparent images with JPEG format, add a white background
      if (format === "image/jpeg") {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      // Convert to target format
      let convertedDataUrl;
      if (format === "image/jpeg" || format === "image/webp") {
        convertedDataUrl = canvas.toDataURL(format, quality / 100);
      } else {
        convertedDataUrl = canvas.toDataURL(format);
      }
      
      setConvertedImage(convertedDataUrl);
    };
    img.src = dataUrl;
  };
  
  const handleFormatChange = (value: string) => {
    const format = value as ImageFormat;
    setTargetFormat(format);
    if (originalImage) {
      convertImageFormat(originalImage, format);
    }
  };
  
  const handleQualityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseInt(event.target.value);
    setQuality(newQuality);
    if (originalImage && (targetFormat === "image/jpeg" || targetFormat === "image/webp")) {
      convertImageFormat(originalImage, targetFormat);
    }
  };
  
  const handleDownload = () => {
    if (!convertedImage) return;
    
    // Find selected format extension
    const format = formatOptions.find(f => f.value === targetFormat);
    const extension = format ? format.extension : "jpg";
    
    const link = document.createElement("a");
    link.href = convertedImage;
    link.download = `converted-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Image downloaded as ${format?.label}`);
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
              <Label htmlFor="target-format">Convert To</Label>
              <Select value={targetFormat} onValueChange={handleFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target format" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(targetFormat === "image/jpeg" || targetFormat === "image/webp") && (
              <div className="space-y-2">
                <Label htmlFor="quality-slider">Quality: {quality}%</Label>
                <Input 
                  id="quality-slider"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={handleQualityChange}
                  className="w-full"
                />
              </div>
            )}
            
            <div className="text-sm space-y-1">
              <p>Original Format: {originalFormat.split("/")[1].toUpperCase()}</p>
              <p>Target Format: {targetFormat.split("/")[1].toUpperCase()}</p>
            </div>
            
            {convertedImage && (
              <Button onClick={handleDownload} className="w-full">
                <Download size={18} className="mr-2" />
                Download Converted Image
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
              <p>Upload an image to convert</p>
            </div>
          </div>
        )}
        
        {originalImage && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Original Image ({originalFormat.split("/")[1].toUpperCase()})</Label>
              <div className="border rounded-md overflow-hidden bg-checkerboard">
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-auto max-h-[300px] object-contain"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Converted Image ({targetFormat.split("/")[1].toUpperCase()})</Label>
              <div className="border rounded-md overflow-hidden bg-checkerboard">
                <img 
                  src={convertedImage || ''} 
                  alt="Converted" 
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

export default ImageFormatConverter;
