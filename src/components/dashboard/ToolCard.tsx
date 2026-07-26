import React from 'react';
import {
  Link,
  Type,
  Phone,
  User,
  Wifi,
  Mail,
  MessageSquare,
  MapPin,
  Image,
  FileText,
  LucideIcon,
} from 'lucide-react';
import { ExtendedToolMeta } from '../../data/tools';

interface ToolCardProps {
  tool: ExtendedToolMeta;
  onSelectTool: (id: ExtendedToolMeta['id']) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Link,
  Type,
  Phone,
  User,
  Wifi,
  Mail,
  MessageSquare,
  MapPin,
  Image,
  FileText,
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelectTool }) => {
  const IconComponent = ICON_MAP[tool.iconName] || Link;

  return (
    <div
      onClick={() => onSelectTool(tool.id)}
      id={`tool-card-${tool.id}`}
      className="group bg-white dark:bg-slate-900 rounded-[22px] border border-slate-100 dark:border-slate-800/80 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(13,148,136,0.14)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-start text-left justify-between min-h-[190px] relative overflow-hidden"
    >
      <div className="flex flex-col items-start w-full">
        {/* Mint Squircle Icon Container matching reference image */}
        <div className="w-12 h-12 rounded-[16px] bg-[#D4F4ED] dark:bg-teal-950/70 text-[#0D9488] dark:text-teal-400 flex items-center justify-center group-hover:bg-[#0D9488] group-hover:text-white transition-all duration-300 mb-5 shadow-2xs">
          <IconComponent className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors tracking-tight">
          {tool.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
          {tool.shortDesc}
        </p>
      </div>
    </div>
  );
};


