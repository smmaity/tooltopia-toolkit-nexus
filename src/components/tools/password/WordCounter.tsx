
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AnimatedElement from "@/components/animated-element";

const WordCounter = () => {
  const [text, setText] = useState("");

  const countWords = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  const countCharacters = (text: string, withSpaces: boolean) => {
    return withSpaces ? text.length : text.replace(/\s/g, "").length;
  };

  const countParagraphs = (text: string) => {
    return text.trim() === "" ? 0 : text.split(/\n+/).filter(Boolean).length;
  };

  const countSentences = (text: string) => {
    return text.trim() === ""
      ? 0
      : text.split(/[.!?]+/).filter((sentence) => sentence.trim() !== "").length;
  };

  const readingTime = (text: string) => {
    const wordsPerMinute = 225; // Average reading speed
    const words = countWords(text);
    const minutes = words / wordsPerMinute;
    
    if (minutes < 1) {
      return "Less than a minute";
    }
    
    return `About ${Math.ceil(minutes)} minute${Math.ceil(minutes) !== 1 ? "s" : ""}`;
  };

  return (
    <AnimatedElement>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="text" className="text-lg font-medium mb-2 block">
                  Enter your text
                </Label>
                <Textarea
                  id="text"
                  placeholder="Type or paste your text here..."
                  className="min-h-[300px]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-4">Text Statistics</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Words</span>
                      <span className="font-medium">{countWords(text)}</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Characters (with spaces)</span>
                      <span className="font-medium">{countCharacters(text, true)}</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Characters (without spaces)</span>
                      <span className="font-medium">{countCharacters(text, false)}</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paragraphs</span>
                      <span className="font-medium">{countParagraphs(text)}</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sentences</span>
                      <span className="font-medium">{countSentences(text)}</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reading Time</span>
                      <span className="font-medium">{readingTime(text)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedElement>
  );
};

export default WordCounter;
