import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock, Hash, Trash2, ArrowUpDown } from "lucide-react";
import { NCMResult } from "./NCMResult";
import { useState, useMemo } from "react";

export interface SearchEntry {
  id: string;
  ncm: string;
  data: unknown[];
  timestamp: Date;
}

type SortMode = "chronological" | "ncm";

interface SearchHistoryProps {
  entries: SearchEntry[];
  onDelete?: (id: string) => void;
}

export function SearchHistory({ entries, onDelete }: SearchHistoryProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<SortMode>("chronological");

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sortedEntries = useMemo(() => {
    const sorted = [...entries];
    if (sortMode === "ncm") {
      sorted.sort((a, b) => a.ncm.localeCompare(b.ncm));
    } else {
      // Chronological - most recent first (already in this order from parent)
      sorted.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    return sorted;
  }, [entries, sortMode]);

  const toggleSort = () => {
    setSortMode((prev) => (prev === "chronological" ? "ncm" : "chronological"));
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Consultas Anteriores ({entries.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSort}
          className="text-xs gap-2"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sortMode === "chronological" ? "Ordenar por NCM" : "Ordenar por Data"}
        </Button>
      </div>
      <div className="space-y-2">
        {sortedEntries.map((entry) => (
          <Collapsible
            key={entry.id}
            open={openItems.has(entry.id)}
            onOpenChange={() => toggleItem(entry.id)}
          >
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 justify-between h-auto py-3 px-4 bg-muted/50 hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="font-mono font-medium">{entry.ncm}</span>
                    <span className="text-muted-foreground text-sm">
                      ({Array.isArray(entry.data) ? entry.data.length : 1} resultado
                      {(Array.isArray(entry.data) ? entry.data.length : 1) !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString("pt-BR")}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openItems.has(entry.id) ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDelete(e, entry.id)}
                className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Excluir consulta"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CollapsibleContent className="pt-3 animate-slide-down">
              <NCMResult data={entry.data} />
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
