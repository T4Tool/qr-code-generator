import React, { useMemo } from 'react';
import { TOOLS_LIST } from '../../data/tools';
import { ToolCard } from './ToolCard';
import { ToolType } from '../../types';
import { SearchX } from 'lucide-react';

interface ToolGridProps {
  searchQuery: string;
  onSelectTool: (id: ToolType) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ searchQuery, onSelectTool }) => {
  const filteredTools = useMemo(() => {
    return TOOLS_LIST.filter((tool) => {
      return (
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  return (
    <section className="py-2">
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelectTool={onSelectTool} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <SearchX className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No tools found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try searching for another term like "WiFi", "URL", or "PDF".
          </p>
        </div>
      )}
    </section>
  );
};

