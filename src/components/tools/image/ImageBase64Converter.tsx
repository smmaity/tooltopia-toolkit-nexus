
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Copy, Image as ImageIcon, FileCode } from "lucide-react";
import { toast } from "sonner";

const ImageBase64Converter = () => {
  const [image, setImage] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("image-to-base64");
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const result = e.target?.result as string;
      setImage(result);
      // Extract base64 data without the prefix (data:image/png;base64,)
      const base64 = result.split(",")[1];
      setBase64String(base64);
    };
    reader.readAsDataURL(file);
  };
  
  const handleBase64Input = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBase64String(event.target.value);
    
    try {
      // Try to convert base64 to image
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(event.target.value);
      if (isBase64) {
        // Try to determine image type (default to png)
        const imageDataUrl = `data:image/png;base64,${event.target.value}`;
        setImage(imageDataUrl);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error("Failed to convert base64 to image:", error);
      setImage(null);
    }
  };
  
  const handleCopyBase64 = () => {
    navigator.clipboard.writeText(base64String);
    toast.success("Base64 string copied to clipboard");
  };
  
  const handleDownloadImage = () => {
    if (!image) return;
    
    const link = document.createElement("a");
    link.href = image;
    link.download = "image-from-base64.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded successfully");
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset state when changing tabs
    setImage(null);
    setBase64String("");
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="image-to-base64" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image-to-base64">Image to Base64</TabsTrigger>
          <TabsTrigger value="base64-to-image">Base64 to Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="image-to-base64" className="space-y-4 mt-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="flex gap-2">
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                ref={imageInputRef}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => imageInputRef.current?.click()}
                size="icon"
              >
                <Upload size={18} />
              </Button>
            </div>
          </div>
          
          {image && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="border rounded-md overflow-hidden bg-checkerboard">
                  <img 
                    src={image} 
                    alt="Uploaded" 
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="base64-output">Base64 Output</Label>
                    <Button variant="ghost" size="sm" onClick={handleCopyBase64}>
                      <Copy size={14} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  <Textarea 
                    id="base64-output"
                    value={base64String}
                    readOnly
                    className="font-mono text-xs h-[300px]"
                  />
                </div>
              </div>
            </div>
          )}
          
          {!image && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md bg-muted/50">
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon size={48} className="mb-2" />
                <p>Upload an image to convert to Base64</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="base64-to-image" className="space-y-4 mt-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="base64-input">Paste Base64 String</Label>
            <Textarea 
              id="base64-input"
              placeholder="Paste your base64 string here (without data:image prefix)"
              value={base64String}
              onChange={handleBase64Input}
              className="font-mono text-xs h-[200px]"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {image ? (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="border rounded-md overflow-hidden bg-checkerboard">
                  <img 
                    src={image} 
                    alt="From Base64" 
                    className="w-full h-auto max-h-[300px] object-contain"
                    onError={() => {
                      setImage(null);
                      toast.error("Invalid Base64 string or not an image");
                    }}
                  />
                </div>
                <Button onClick={handleDownloadImage} className="w-full mt-4">
                  <Download size={18} className="mr-2" />
                  Download Image
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md bg-muted/50">
                <div className="flex flex-col items-center text-muted-foreground">
                  <FileCode size={48} className="mb-2" />
                  <p>Paste a valid Base64 string to preview image</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageBase64Converter;
