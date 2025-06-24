import { LruStore } from "@delvtech/drift";

export const driftStore = new LruStore({
  max: 500,
  ttl: 60_000, // 1 minute TTL to match the queryClient's staleTime
});
