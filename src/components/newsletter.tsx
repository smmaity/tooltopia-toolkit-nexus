
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    // Here you would typically send the email to your API
    toast.success("You've been subscribed to our newsletter!");
    
    setEmail("");
  };

  return (
    <section id="newsletter" className="bg-accent py-16">
      <div className="container max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">Join 10,000+ productivity lovers</h2>
        <p className="text-muted-foreground mb-8">
          Get tool updates, productivity hacks, and more delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="h-12 px-6">Subscribe</Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
