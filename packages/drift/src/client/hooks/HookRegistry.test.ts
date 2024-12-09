import type { SimpleCache } from "src/cache/types";
import { HookRegistry } from "src/client/hooks/HookRegistry";
import { describe, expect, it, vi } from "vitest";

describe("HookRegistry", () => {
  it("Calls all registered handlers", async () => {
    const hooks = new HookRegistry<SimpleCache>();

    const handler = vi.fn();
    const handler2 = vi.fn();

    hooks.on("clear", handler);
    hooks.on("clear", handler2);
    await hooks.call("clear");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("Calls handlers in registration order", async () => {
    const hooks = new HookRegistry();
    const order: number[] = [];

    const handler = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      order.push(1);
    });
    const handler2 = vi.fn(() => {
      order.push(2);
    });

    hooks.on("clear", handler);
    hooks.on("clear", handler2);

    await hooks.call("clear");
    expect(order).toEqual([1, 2]);
  });

  it("Does not call handlers that have been removed", async () => {
    const hooks = new HookRegistry<SimpleCache>();
    const handler = vi.fn();

    hooks.on("clear", handler);
    await hooks.call("clear");

    hooks.off("clear", handler);
    await hooks.call("clear");

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("Only calls one-time handlers once", async () => {
    const hooks = new HookRegistry<SimpleCache>();
    const handler = vi.fn();
    const onceHandler = vi.fn();

    hooks.on("clear", handler);
    hooks.once("clear", onceHandler);
    await hooks.call("clear");
    await hooks.call("clear");

    expect(handler).toHaveBeenCalledTimes(2);
    expect(onceHandler).toHaveBeenCalledTimes(1);
  });
});