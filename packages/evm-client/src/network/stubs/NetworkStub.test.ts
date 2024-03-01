import { describe, expect, it } from 'vitest';
import { NetworkStub } from './NetworkStub';

describe('NetworkStub', () => {
  it('waits for stubbed transactions', async () => {
    const network = new NetworkStub();

    const txHash = '0x123abc';
    const stubbedTx = {
      gas: 100n,
      gasPrice: 100n,
      input: '0x456def',
      nonce: 0,
      type: '0x0',
      value: 0n,
    } as const;

    const waitPromise = network.waitForTransaction(txHash);

    await new Promise((resolve) => {
      setTimeout(() => {
        network.stubGetTransaction({
          args: [txHash],
          value: stubbedTx,
        });
        resolve(undefined);
      }, 1000);
    });

    const tx = await waitPromise;

    expect(tx).toBe(stubbedTx);
  });
});
