
import { useState } from "react";
import ToolCard from "@/components/tool-card";
import { toolCategories, ToolCategory } from "@/data/tools";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnimatedElement from "@/components/animated-element";

const ToolsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleToolCardClick = (category: ToolCategory) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  return (
    <section id="tools" className="container-padding">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Super Tools</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of powerful tools designed to boost your productivity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {toolCategories.map((category, index) => (
          <AnimatedElement key={category.id} delay={index * 0.1}>
            <ToolCard
              icon={category.icon}
              title={category.title}
              color={category.color}
              gradient={category.gradient}
              onClick={() => handleToolCardClick(category)}
            />
          </AnimatedElement>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCategory && (
                <>
                  <div className={`w-8 h-8 rounded-lg ${selectedCategory.color} flex items-center justify-center`}>
                    <selectedCategory.icon size={18} className="text-primary-foreground" />
                  </div>
                  {selectedCategory.title} Tools
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              {selectedCategory?.subTools?.map((tool) => (
                <div 
                  key={tool.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium">{tool.title}</h3>
                  {tool.description && (
                    <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ToolsSection;
