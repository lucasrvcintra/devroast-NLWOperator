import type { Metadata } from "next";
import { createCaller, prefetch, trpc } from "@/trpc/server";
import { RoastResult } from "./roast-result";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const caller = await createCaller();

  try {
    const data = await caller.roast.getById({ id });

    return {
      title: `Roast Results | devroast`,
      description: `"${data.roast.roastQuote}" - Score: ${data.roast.score}/10`,
      openGraph: {
        title: `devroast | Score: ${data.roast.score}/10`,
        description: data.roast.roastQuote ?? undefined,
        images: [`/api/og/${id}`],
      },
      twitter: {
        card: "summary_large_image",
        images: [`/api/og/${id}`],
      },
    };
  } catch {
    return {
      title: "Roast Not Found | devroast",
    };
  }
}

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void prefetch(trpc.roast.getById.queryOptions({ id }));

  return <RoastResult id={id} />;
}
