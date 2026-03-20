import type { Metadata } from "next";
import { Suspense } from "react";
import { RoastResultSkeleton } from "@/components/roast-result-skeleton";
import { prefetch, trpc } from "@/trpc/server";
import { RoastResult } from "./roast-result";

export const metadata: Metadata = {
  title: "Roast Results | devroast",
  description: "Your code has been roasted",
};

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void prefetch(trpc.roast.getById.queryOptions({ id }));

  return (
    <Suspense fallback={<RoastResultSkeleton />}>
      <RoastResult id={id} />
    </Suspense>
  );
}
