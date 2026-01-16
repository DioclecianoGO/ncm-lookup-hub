import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, FileText, AlertTriangle, CheckCircle } from "lucide-react";

interface NCMResultProps {
  data: unknown[];
}

export function NCMResult({ data }: NCMResultProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="flex items-center gap-3 py-6">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <p className="text-muted-foreground">Nenhum resultado encontrado para este NCM.</p>
        </CardContent>
      </Card>
    );
  }

  // Helper to get lista description
  const getListaDescription = (tipoLista: string) => {
    const listas: Record<string, string> = {
      "1": "Lista 1 - Entorpecentes",
      "2": "Lista 2 - Psicotrópicos",
      "3": "Lista 3 - Precursores",
      "4": "Lista 4 - Químicos Controlados",
      "5": "Lista 5 - Explosivos",
      "6": "Lista 6 - Agrotóxicos",
      "7": "Lista 7 - Outros Controlados",
    };
    return listas[tipoLista] || `Lista ${tipoLista}`;
  };

  return (
    <div className="space-y-4">
      {data.map((item: any, index: number) => {
        const tipoProduto = item.tipoProduto || {};
        const tipoNcm = item.tipoNcm || {};
        const produtoDescricao = tipoProduto.descricao || tipoNcm.descricao || "Produto";
        const tipoLista = tipoProduto.tipoLista;
        const outraLicenca = tipoProduto.outraLicenca;
        const ncmCodigo = tipoNcm.codigo;
        const ncmDescricao = tipoNcm.descricao;

        return (
          <Card key={index} className="overflow-hidden animate-fade-in">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Package className="w-5 h-5 text-primary" />
                <span className="flex-1">{produtoDescricao}</span>
                {tipoLista && (
                  <Badge variant="secondary" className="ml-2">
                    {getListaDescription(tipoLista)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ncmCodigo && (
                  <InfoItem label="Código NCM" value={ncmCodigo} />
                )}
                {ncmDescricao && ncmDescricao !== produtoDescricao && (
                  <InfoItem label="Descrição NCM" value={ncmDescricao} />
                )}
                {outraLicenca && (
                  <div className="col-span-full">
                    <div className="flex items-center gap-2">
                      {outraLicenca === "S" ? (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm font-medium text-muted-foreground">Outra Licença Necessária:</span>
                      <span className={outraLicenca === "S" ? "text-warning font-medium" : "text-green-600 font-medium"}>
                        {outraLicenca === "S" ? "Sim - Requer licença de outro órgão" : "Não"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Render any additional fields dynamically */}
              <div className="mt-4 pt-4 border-t">
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <FileText className="w-4 h-4" />
                    Ver dados completos
                  </summary>
                  <pre className="mt-3 p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
