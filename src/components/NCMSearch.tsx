import { useState, FormEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Self-hosted: usa caminho relativo (funciona com qualquer subpath via Nginx proxy)
// Lovable Cloud: usa edge function via Supabase
const API_URL = import.meta.env.VITE_API_URL || "api/consulta-ncm";
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === "true";

interface NCMSearchProps {
  onResult: (ncm: string, data: unknown[]) => void;
}

export function NCMSearch({ onResult }: NCMSearchProps) {
  const [ncm, setNcm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 8);
    setNcm(value);
  };

  const handleSearch = async () => {
    if (ncm.length !== 8) {
      toast.error("O NCM deve conter exatamente 8 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      let results: unknown[];

      if (USE_SUPABASE) {
        // Modo Lovable Cloud (Edge Function)
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase.functions.invoke("consulta-ncm", {
          body: { ncm },
        });
        if (error) throw new Error(error.message);
        if (data.error) throw new Error(data.error);
        results = Array.isArray(data) ? data : [data];
      } else {
        // Modo Self-Hosted (API local)
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ncm }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro na consulta");
        if (data.error) throw new Error(data.error);
        results = Array.isArray(data) ? data : [data];
      }

      onResult(ncm, results);
      setNcm("");
      toast.success(`Consulta realizada: ${results.length} resultado(s)`);
    } catch (error) {
      console.error("Erro na consulta:", error);
      toast.error("Erro ao consultar NCM. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder="Digite o NCM (8 dígitos)"
            value={ncm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="h-12 text-lg font-mono tracking-wider pl-4 pr-4 bg-card border-2 focus:border-primary transition-colors"
            maxLength={8}
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {ncm.length}/8
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 px-6 gap-2"
          disabled={ncm.length !== 8 || isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Consultar
        </Button>
      </div>
    </form>
  );
}
