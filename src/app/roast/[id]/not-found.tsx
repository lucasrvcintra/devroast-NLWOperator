import { ErrorDisplayRoot } from "@/components/ui/error-display";

export default function NotFound() {
  return (
    <ErrorDisplayRoot
      code={404}
      title="Roast não encontrado"
      description="Este roast não existe ou foi removido."
      variant="error"
      size="full"
    />
  );
}
