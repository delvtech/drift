import { coercePublicClient, hasRequiredActions } from "src/publicClient";
import { http, createClient, createPublicClient } from "viem";
import { describe, expect, it } from "vitest";

const transport = http("_");

describe("hasRequiredActions", () => {
  it("should return false for a non-public client", () => {
    const client = createClient({ transport });
    expect(hasRequiredActions(client)).toBe(false);
  });

  it("should return true for a valid public client", () => {
    const client = createPublicClient({ transport });
    expect(hasRequiredActions(client)).toBe(true);
  });
});

describe("coercePublicClient", () => {
  it("should extend a non-public client with public actions", async () => {
    const client = createClient({ transport });
    const coercedClient = coercePublicClient(client);
    expect(hasRequiredActions(coercedClient)).toBe(true);
  });

  it("should return the same client if it's already a public client", () => {
    const client = createPublicClient({ transport });
    const coercedClient = coercePublicClient(client);
    expect(coercedClient).toBe(client);
  });
});
