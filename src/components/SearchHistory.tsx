import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock, Hash } from "lucide-react";
import { NCMResult } from "./NCMResult";
import { useState } from "react";

export interface SearchEntry {
  id: string;
  ncm: string;
  data: unknown[];
  timestamp: Date;
}

interface SearchHistoryProps {
  entries: SearchEntry[];
}

export function SearchHistory({ entries }: SearchHistoryProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

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

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Consultas Anteriores
      </h3>
      <div className="space-y-2">
        {entries.map((entry) => (
          <Collapsible
            key={entry.id}
            open={openItems.has(entry.id)}
            onOpenChange={() => toggleItem(entry.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between h-auto py-3 px-4 bg-muted/50 hover:bg-muted"
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
            <CollapsibleContent className="pt-3 animate-slide-down">
              <NCMResult data={entry.data} />
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
