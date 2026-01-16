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

  return (
    <div className="space-y-4">
      {data.map((item: any, index: number) => (
        <Card key={index} className="overflow-hidden animate-fade-in">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Package className="w-5 h-5 text-primary" />
              {item.descricao || item.produto || "Produto"}
              {item.controlado && (
                <Badge variant="destructive" className="ml-auto">
                  Controlado
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.ncm && (
                <InfoItem label="NCM" value={item.ncm} />
              )}
              {item.codigoProduto && (
                <InfoItem label="Código Produto" value={item.codigoProduto} />
              )}
              {item.tipoNCM && (
                <InfoItem label="Tipo NCM" value={item.tipoNCM} />
              )}
              {item.unidadeMedida && (
                <InfoItem label="Unidade de Medida" value={item.unidadeMedida} />
              )}
              {item.observacao && (
                <div className="col-span-full">
                  <InfoItem label="Observação" value={item.observacao} />
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
      ))}
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
