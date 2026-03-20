import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(await createTRPCContext());

export async function createCaller() {
  const ctx = await createTRPCContext();
  return appRouter.createCaller(ctx);
}

export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

export function prefetch<T>(queryOptions: T) {
  const queryClient = getQueryClient();
  // biome-ignore lint/suspicious/noExplicitAny: tRPC type inference requires any here
  const opts = queryOptions as any;
  if (opts.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(opts);
  } else {
    void queryClient.prefetchQuery(opts);
  }
}
