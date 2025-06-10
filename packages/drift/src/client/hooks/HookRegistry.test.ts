import { HookRegistry } from "src/client/hooks/HookRegistry";
import { describe, expect, it, vi } from "vitest";

describe("HookRegistry", () => {
  it("calls registered handlers with a payload", async () => {
    const hooks = new HookRegistry<{
      test(payload: { value: string }): void;
    }>();
    const handler = vi.fn();
    const payload = { value: "bar" };

    hooks.on("test", handler);
    await hooks.call("test", payload);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(payload);
  });

  it("calls all registered handlers", async () => {
    const hooks = new HookRegistry();

    const handler = vi.fn();
    const handler2 = vi.fn();

    hooks.on("test", handler);
    hooks.on("test", handler2);
    await hooks.call("test", undefined);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("calls handlers in registration order", async () => {
    const hooks = new HookRegistry();
    const order: number[] = [];

    const handler = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      order.push(1);
    });
    const handler2 = vi.fn(() => {
      order.push(2);
    });

    hooks.on("test", handler);
    hooks.on("test", handler2);

    await hooks.call("test", undefined);
    expect(order).toEqual([1, 2]);
  });

  it("does not call handlers that have been removed", async () => {
    const hooks = new HookRegistry();
    const handler = vi.fn();

    hooks.on("test", handler);
    await hooks.call("test", undefined);

    hooks.off("test", handler);
    await hooks.call("test", undefined);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("only calls one-time handlers once", async () => {
    const hooks = new HookRegistry();
    const handler = vi.fn();
    const onceHandler = vi.fn();

    hooks.on("test", handler);
    hooks.once("test", onceHandler);
    await hooks.call("test", undefined);
    await hooks.call("test", undefined);

    expect(handler).toHaveBeenCalledTimes(2);
    expect(onceHandler).toHaveBeenCalledTimes(1);
  });
});
