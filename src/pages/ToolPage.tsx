
import { useParams } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { toolCategories, ToolCategory } from "@/data/tools";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const ToolPage = () => {
  const { categoryId, toolId } = useParams();
  const [category, setCategory] = useState<ToolCategory | null>(null);
  const [subTool, setSubTool] = useState<{ id: string; title: string; description?: string } | null>(null);

  useEffect(() => {
    // Find the category
    const foundCategory = toolCategories.find((cat) => cat.id === categoryId);
    setCategory(foundCategory || null);

    // Find the specific sub tool
    if (foundCategory && toolId) {
      const foundTool = foundCategory.subTools?.find((tool) => tool.id === toolId);
      setSubTool(foundTool || null);
    }
  }, [categoryId, toolId]);

  if (!category || !subTool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
            <Link to="/#tools">
              <Button>Back to Tools</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <div className="mb-8">
          <Link to="/#tools" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to all tools
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", category.color)}>
              <Icon size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{subTool.title}</h1>
              <p className="text-muted-foreground">{category.title} Tool</p>
            </div>
          </div>
          
          {subTool.description && (
            <p className="text-muted-foreground max-w-2xl mb-6">{subTool.description}</p>
          )}
        </div>
        
        <div className="bg-muted/40 border rounded-xl p-6">
          <p className="text-center text-muted-foreground">
            Tool content for {subTool.title} will be implemented here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolPage;
