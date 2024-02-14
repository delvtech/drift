import { IERC20 } from 'src/base/testing/IERC20';
import { friendlyToArray } from 'src/contract/utils/friendlyToArray';
import { describe, expect, it } from 'vitest';

describe('friendlyToArray', () => {
  it('correctly converts object into arrays', async () => {
    const transferArgsArray = friendlyToArray({
      abi: IERC20.abi,
      type: 'function',
      name: 'transfer',
      kind: 'inputs',
      value: {
        to: '0x123',
        value: 123n,
      },
    });
    expect(transferArgsArray).toEqual(['0x123', 123n]);

    // empty parameter names (index keys)
    const votesArgsArray = friendlyToArray({
      abi: exampleAbi,
      type: 'function',
      name: 'votes',
      kind: 'inputs',
      value: {
        '0': '0x123',
        '1': 0n,
      },
    });
    expect(votesArgsArray).toEqual(['0x123', 0n]);
  });

  it('correctly converts single values into arrays', async () => {
    const balanceInputArray = friendlyToArray({
      abi: IERC20.abi,
      type: 'function',
      name: 'balanceOf',
      kind: 'inputs',
      value: '0x123',
    });
    expect(balanceInputArray).toEqual(['0x123']);
  });

  it('converts undefined into an empty array', async () => {
    const emptyArray = friendlyToArray({
      abi: IERC20.abi,
      type: 'function',
      name: 'symbol',
      kind: 'inputs',
      value: undefined,
    });
    expect(emptyArray).toEqual([]);
  });
});

export const exampleAbi = [
  {
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
    ],
    name: 'votes',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
