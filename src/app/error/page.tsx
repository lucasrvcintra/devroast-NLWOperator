import { ErrorDisplayRoot } from "@/components/ui/error-display";

interface ErrorPageProps {
  searchParams: Promise<{
    code?: string;
    title?: string;
    message?: string;
  }>;
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;

  const code = params.code ? parseInt(params.code, 10) : 500;
  const title = params.title || "Something went wrong";
  const message = params.message || "An unexpected error occurred.";

  return (
    <ErrorDisplayRoot
      code={code}
      title={title}
      description={message}
      variant="error"
      size="full"
    />
  );
}
