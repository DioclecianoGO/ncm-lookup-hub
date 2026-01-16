import { useState } from "react";
import { NCMSearch } from "@/components/NCMSearch";
import { NCMResult } from "@/components/NCMResult";
import { SearchHistory, SearchEntry } from "@/components/SearchHistory";
import { Shield } from "lucide-react";

const Index = () => {
  const [currentResult, setCurrentResult] = useState<{ ncm: string; data: unknown[] } | null>(null);
  const [history, setHistory] = useState<SearchEntry[]>([]);

  const handleResult = (ncm: string, data: unknown[]) => {
    // Move current result to history if exists
    if (currentResult) {
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          ncm: currentResult.ncm,
          data: currentResult.data,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    
    // Set new current result
    setCurrentResult({ ncm, data });
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Consulta NCM</h1>
              <p className="text-sm text-muted-foreground">SIPROQUIM - Sistema de Produtos Químicos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Search Section */}
          <section className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Consultar NCM
              </h2>
              <p className="text-muted-foreground">
                Digite o código NCM de 8 dígitos para consultar informações do produto
              </p>
            </div>
            
            <div className="flex justify-center">
              <NCMSearch onResult={handleResult} />
            </div>
          </section>

          {/* Current Result */}
          {currentResult && (
            <section className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-foreground">
                  Resultado para NCM: <span className="font-mono text-primary">{currentResult.ncm}</span>
                </h3>
              </div>
              <NCMResult data={currentResult.data} />
            </section>
          )}

          {/* History */}
          {history.length > 0 && (
            <section className="border-t pt-8">
              <SearchHistory entries={history} onDelete={handleDeleteHistory} />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Dados fornecidos pela API do SIPROQUIM - Polícia Federal
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
