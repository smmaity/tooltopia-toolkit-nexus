
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [size, setSize] = useState(200);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQRCode = () => {
    if (!text) {
      toast.error("Please enter some text or URL");
      return;
    }

    // Create QR code URL using Google Charts API
    const url = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(
      text
    )}&chs=${size}x${size}&chco=${color.substring(1)}&chf=bg,s,${bgColor.substring(
      1
    )}&chld=${errorCorrectionLevel}`;

    setQrCodeUrl(url);
    toast.success("QR Code generated successfully!");
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) {
      toast.error("Please generate a QR code first");
      return;
    }

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded successfully!");
  };

  return (
    <AnimatedElement>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text or URL</Label>
              <Input
                id="text"
                placeholder="Enter text or URL"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size: {size}x{size} px</Label>
              <Slider
                id="size"
                min={100}
                max={500}
                step={10}
                value={[size]}
                onValueChange={(values) => setSize(values[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">QR Code Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="error-level">Error Correction Level</Label>
              <Select
                value={errorCorrectionLevel}
                onValueChange={(value) => setErrorCorrectionLevel(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select error correction level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button onClick={generateQRCode} className="w-full">
                Generate QR Code
              </Button>
              <Button
                onClick={downloadQRCode}
                variant="outline"
                disabled={!qrCodeUrl}
                className="w-full"
              >
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
            {qrCodeUrl ? (
              <div className="text-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="mx-auto mb-4 border rounded-lg"
                />
                <p className="text-sm text-muted-foreground">Your QR Code is ready!</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="mb-2">Your QR code will appear here</p>
                <p className="text-sm">Fill in the details and click Generate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedElement>
  );
};

export default QRGenerator;
