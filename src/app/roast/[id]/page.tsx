import type { Metadata } from "next";
import { prefetch, trpc } from "@/trpc/server";
import { RoastResult } from "./roast-result";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Roast Results | devroast`,
    description: "Check your code roast results",
    openGraph: {
      title: "devroast | Roast Results",
      description: "Check your code roast results",
      images: [`/api/og/${id}`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og/${id}`],
    },
  };
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
