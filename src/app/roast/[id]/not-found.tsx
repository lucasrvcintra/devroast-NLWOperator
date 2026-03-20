import { ErrorDisplayRoot } from "@/components/ui/error-display";

export default function NotFound() {
  return (
    <ErrorDisplayRoot
      code={404}
      title="Roast not found"
      description="This roast does not exist or has been removed."
      variant="error"
      size="full"
    />
  );
}
