
import Logo from "./ui/logo";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "#tools" },
  { label: "Contact", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo className="mb-4" />
            <p className="text-muted-foreground">
              All-in-one tool suite for creators, developers, students, and productivity enthusiasts.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href}
                  aria-label={social.label}
                  className="h-10 w-10 flex-center rounded-full bg-muted hover:bg-primary/20 transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to get the latest updates and news.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <button className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Tooltopia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
