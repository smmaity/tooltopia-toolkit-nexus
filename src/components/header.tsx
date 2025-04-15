
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./ui/logo";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./theme-toggle";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Explore Tools", href: "#tools" },
  { label: "Features", href: "#features" },
  { label: "Newsletter", href: "#newsletter" },
];

const Header = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        
        {!isMobile && (
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.label}
                to={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {!isMobile && (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="default">Get Started</Button>
          </div>
        )}

        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background animate-fade-in">
            <nav className="container flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <Link 
                  key={item.label}
                  to={item.href}
                  className="text-lg font-medium py-2 transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 mt-4">
                <ThemeToggle />
                <Button onClick={() => setMobileMenuOpen(false)}>Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
