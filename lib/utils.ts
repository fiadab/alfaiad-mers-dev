import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Code,
  Monitor,
  Smartphone,
  BarChart,
  Cpu,
  Brain,
  Palette,
  Box,
  Clipboard,
  Shield,
  Terminal,
  Lock,
  Cloud,
  Database,
  Globe,
  FileText,
  DollarSign,
  CreditCard,
  Headphones,
  Users,
  Currency,
  Scale,
  LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formattedString = (input: string) => {
 // split the string based on the delimiter "-"
 const parts = input.split("-");

 // capitalize each words
const capitalized = parts.map((part) => {
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
});
    return capitalized.join(" ");
};


export type IconName =
 | "Software Development"
 | "Web Development"
 | "Mobile App Development"
 | "Data Science"
 | "Machine Learning"
 | "Artificial Intelligence"
 |  "Ui/Ux Design"
 | "Product Management"
 |  "Project Management"
 | "Quality Assurance"
 |  "DevOps"
 | "Cybersecurity"
 | "Cloud Computing"
 | "Database Administration"
 | "NetWork Engineering"
 |  "Business Analysis"
 |        "Sales"
 |              "Marketing"
 |        "Customer Support"
 |        "Human Resource"
 |        "Finance"
 |  "Accounting"
 |        "Legal";


 export const iconMapping: Record<IconName, LucideIcon> = {
  "Software Development": Code,
   "Web Development": Monitor,
   "Mobile App Development": Smartphone,
   "Data Science": BarChart,
   "Machine Learning": Cpu,
   "Artificial Intelligence": Brain,
    "Ui/Ux Design": Palette,
   "Product Management": Box,
    "Project Management": Clipboard,
   "Quality Assurance": Shield,
    "DevOps": Terminal,
   "Cybersecurity": Lock,
   "Cloud Computing": Cloud,
   "Database Administration": Database,
   "NetWork Engineering": Globe,
   "Business Analysis": FileText,
   "Sales": DollarSign,
   "Marketing":CreditCard,
   "Customer Support":Headphones,
  "Human Resource":Users,
  "Finance":Currency,
  "Accounting": CreditCard,
"Legal":Scale,
 };

