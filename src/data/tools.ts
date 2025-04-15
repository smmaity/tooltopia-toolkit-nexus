
import {
  Image,
  FileText,
  Calculator,
  Code,
  QrCode,
  KeyRound,
  PaintBucket,
  Ruler,
  FileType,
  Youtube,
  Globe,
  Wrench,
  Zap,
} from "lucide-react";

export type ToolCategory = {
  id: string;
  title: string;
  icon: any;
  description?: string;
  color?: string;
  gradient?: {
    from: string;
    to: string;
  };
  subTools?: {
    id: string;
    title: string;
    description?: string;
  }[];
};

export const toolCategories: ToolCategory[] = [
  {
    id: "image",
    title: "Image",
    icon: Image,
    color: "bg-tooltopia-soft-blue",
    subTools: [
      { id: "image-compressor", title: "Image Compressor" },
      { id: "image-size-increaser", title: "Image Size Increaser" },
      { id: "image-base64", title: "Image to Base64 / Base64 to Image" },
      { id: "image-format-converter", title: "Image Format Converter" },
      { id: "image-dimension-changer", title: "Image Dimension Changer" },
    ],
  },
  {
    id: "pdf",
    title: "PDF",
    icon: FileText,
    color: "bg-tooltopia-soft-pink",
    subTools: [
      { id: "pdf-merger", title: "PDF Merger" },
      { id: "pdf-splitter", title: "PDF Splitter" },
      { id: "pdf-word", title: "PDF to Word / Word to PDF" },
      { id: "pdf-jpg", title: "PDF to JPG / JPG to PDF" },
      { id: "pdf-compress", title: "Compress PDF" },
      { id: "pdf-unlock", title: "Unlock PDF" },
    ],
  },
  {
    id: "calculator",
    title: "Calculator",
    icon: Calculator,
    color: "bg-tooltopia-soft-green",
    subTools: [
      { id: "basic-calculator", title: "Basic Calculator" },
      { id: "scientific-calculator", title: "Scientific Calculator" },
      { id: "bmi-calculator", title: "BMI Calculator" },
      { id: "age-calculator", title: "Age Calculator" },
    ],
  },
  {
    id: "conversion",
    title: "Conversion Tools",
    icon: Zap,
    color: "bg-tooltopia-soft-yellow",
    subTools: [
      { id: "binary-decimal", title: "Binary ⇄ Decimal" },
      { id: "binary-hex", title: "Binary ⇄ Hex" },
      { id: "hex-decimal", title: "Hex ⇄ Decimal" },
      { id: "base64", title: "Base64 Encode / Decode" },
      { id: "text-ascii", title: "Text ⇄ ASCII" },
      { id: "timestamp-converter", title: "Timestamp Converter" },
      { id: "timezone-converter", title: "Time Zone Converter" },
    ],
  },
  {
    id: "code",
    title: "Code Tools",
    icon: Code,
    color: "bg-tooltopia-soft-purple",
    subTools: [
      { id: "json-formatter", title: "JSON Formatter / Validator" },
      { id: "xml-formatter", title: "XML Formatter" },
      { id: "html-minifier", title: "HTML Minifier / Beautifier" },
      { id: "css-minifier", title: "CSS Minifier / Beautifier" },
      { id: "js-minifier", title: "JavaScript Minifier" },
    ],
  },
  {
    id: "qr",
    title: "QR Tools",
    icon: QrCode,
    color: "bg-tooltopia-soft-orange",
    subTools: [
      { id: "qr-generator", title: "QR Code Generator" },
      { id: "qr-scanner", title: "QR Code Scanner" },
    ],
  },
  {
    id: "password",
    title: "Password & Text Tools",
    icon: KeyRound,
    color: "bg-tooltopia-soft-peach",
    subTools: [
      { id: "password-generator", title: "Password Generator" },
      { id: "lorem-ipsum", title: "Lorem Ipsum Generator" },
      { id: "word-counter", title: "Word Counter" },
      { id: "character-counter", title: "Character Counter" },
    ],
  },
  {
    id: "color",
    title: "Color & Design Tools",
    icon: PaintBucket,
    color: "bg-tooltopia-soft-pink",
    subTools: [
      { id: "color-picker", title: "Color Picker" },
      { id: "hex-rgb", title: "Hex ⇄ RGB Converter" },
      { id: "gradient-generator", title: "Gradient Generator" },
    ],
  },
  {
    id: "unit",
    title: "Unit Converters",
    icon: Ruler,
    color: "bg-tooltopia-soft-blue",
    subTools: [
      { id: "length-converter", title: "Length" },
      { id: "weight-converter", title: "Weight" },
      { id: "temperature-converter", title: "Temperature" },
      { id: "speed-converter", title: "Speed" },
      { id: "area-converter", title: "Area" },
      { id: "volume-converter", title: "Volume" },
      { id: "pressure-converter", title: "Pressure" },
    ],
  },
  {
    id: "document",
    title: "Document Converters",
    icon: FileType,
    color: "bg-tooltopia-soft-green",
    subTools: [
      { id: "word-pdf", title: "Word to PDF / PDF to Word" },
      { id: "excel-pdf", title: "Excel to PDF / PDF to Excel" },
      { id: "ppt-pdf", title: "PPT to PDF / PDF to PPT" },
      { id: "txt-pdf", title: "TXT to PDF / PDF to TXT" },
    ],
  },
  {
    id: "youtube",
    title: "YouTube Tools",
    icon: Youtube,
    color: "bg-tooltopia-soft-peach",
    subTools: [
      { id: "youtube-thumbnail", title: "YouTube Thumbnail Downloader" },
      { id: "youtube-video", title: "YouTube Video Downloader" },
    ],
  },
  {
    id: "seo",
    title: "SEO & Web Tools",
    icon: Globe,
    color: "bg-tooltopia-soft-purple",
    subTools: [
      { id: "meta-generator", title: "Meta Tag Generator" },
      { id: "og-preview", title: "Open Graph Preview" },
      { id: "website-screenshot", title: "Website Screenshot Tool" },
    ],
  },
  {
    id: "misc",
    title: "Miscellaneous Tools",
    icon: Wrench,
    color: "bg-tooltopia-soft-yellow",
    subTools: [
      { id: "uuid-generator", title: "UUID Generator" },
      { id: "number-words", title: "Number to Words" },
      { id: "words-number", title: "Words to Number" },
    ],
  },
];
