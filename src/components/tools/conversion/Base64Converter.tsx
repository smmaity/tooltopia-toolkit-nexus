
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Copy, X } from "lucide-react";
import AnimatedElement from "@/components/animated-element";

const Base64Converter = () => {
  const [text, setText] = useState("");
  const [base64, setBase64] = useState("");
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");

  // Text to Base64
  const encodeToBase64 = () => {
    if (!text) {
      toast.error("Please enter some text to encode");
      return;
    }

    try {
      const encoded = btoa(encodeURIComponent(text));
      setBase64(encoded);
      toast.success("Text encoded successfully");
    } catch (error) {
      toast.error("Failed to encode text");
      console.error("Encoding error:", error);
    }
  };

  // Base64 to Text
  const decodeFromBase64 = () => {
    if (!base64) {
      toast.error("Please enter Base64 content to decode");
      return;
    }

    try {
      const decoded = decodeURIComponent(atob(base64));
      setText(decoded);
      toast.success("Base64 decoded successfully");
    } catch (error) {
      toast.error("Failed to decode Base64. The input may not be valid Base64.");
      console.error("Decoding error:", error);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (content: string, type: "text" | "base64") => {
    if (!content) {
      toast.error(`No ${type} content to copy`);
      return;
    }
    
    navigator.clipboard.writeText(content)
      .then(() => toast.success(`${type === "text" ? "Text" : "Base64"} copied to clipboard`))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  const clearFields = () => {
    setText("");
    setBase64("");
  };

  return (
    <AnimatedElement>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Base64 Encoder / Decoder</CardTitle>
          <CardDescription>
            Convert text to Base64 encoding or decode Base64 back to text
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="encode" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "encode" | "decode")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
            
            <TabsContent value="encode" className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="text-input">Text</Label>
                  <div className="space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(text, "text")} 
                      disabled={!text}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setText("")}
                      disabled={!text}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Clear
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="text-input"
                  placeholder="Enter text to encode to Base64"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex justify-center">
                <Button onClick={encodeToBase64}>
                  <ArrowDown className="h-4 w-4 mr-2" /> Encode to Base64
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="base64-output">Base64</Label>
                  <div className="space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(base64, "base64")} 
                      disabled={!base64}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setBase64("")}
                      disabled={!base64}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Clear
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="base64-output"
                  placeholder="Encoded Base64 output"
                  value={base64}
                  onChange={(e) => setBase64(e.target.value)}
                  rows={6}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="decode" className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="base64-input">Base64</Label>
                  <div className="space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(base64, "base64")} 
                      disabled={!base64}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setBase64("")}
                      disabled={!base64}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Clear
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="base64-input"
                  placeholder="Enter Base64 to decode to text"
                  value={base64}
                  onChange={(e) => setBase64(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex justify-center">
                <Button onClick={decodeFromBase64}>
                  <ArrowUp className="h-4 w-4 mr-2" /> Decode to Text
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="text-output">Text</Label>
                  <div className="space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(text, "text")} 
                      disabled={!text}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setText("")}
                      disabled={!text}
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Clear
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="text-output"
                  placeholder="Decoded text output"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={clearFields}>
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default Base64Converter;
