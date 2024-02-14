import { IERC20 } from 'src/base/testing/IERC20';
import { ALICE, BOB, NANCY } from 'src/base/testing/accounts';
import { ReadContractStub } from 'src/contract/stubs/ReadContractStub';
import { Event } from 'src/contract/types/Event';
import { describe, expect, it } from 'vitest';

const ERC20ABI = IERC20.abi;

describe('ReadContractStub', () => {
  it('stubs the read function', async () => {
    const contract = new ReadContractStub(IERC20.abi);

    expect(contract.read('balanceOf', NANCY)).rejects.toThrowError();

    // Stub bob and alice's balances first
    const bobValue = 10n;
    contract.stubRead({
      functionName: 'balanceOf',
      args: BOB,
      value: bobValue,
    });

    const aliceValue = 20n;
    contract.stubRead({
      functionName: 'balanceOf',
      args: ALICE,
      value: aliceValue,
    });

    // Now try and read them based on their args
    const bobResult = await contract.read('balanceOf', BOB);
    const aliceResult = await contract.read('balanceOf', ALICE);
    expect(bobResult).toBe(bobValue);
    expect(aliceResult).toBe(aliceValue);

    // Now stub w/out any args and see if we get the default value back
    const defaultValue = 30n;
    contract.stubRead({
      functionName: 'balanceOf',
      value: defaultValue,
    });
    const defaultResult = await contract.read('balanceOf', NANCY);
    expect(defaultResult).toBe(defaultValue);

    const stub = contract.getReadStub('balanceOf');
    expect(stub?.callCount).toBe(3);
  });

  it('stubs the simulateWrite function', async () => {
    const contract = new ReadContractStub(ERC20ABI);

    expect(
      contract.simulateWrite('transferFrom', {
        from: ALICE,
        to: BOB,
        value: 100n,
      }),
    ).rejects.toThrowError();

    const stubbedResult = true;
    contract.stubSimulateWrite('transferFrom', stubbedResult);

    const result = await contract.simulateWrite('transferFrom', {
      from: ALICE,
      to: BOB,
      value: 100n,
    });

    expect(result).toStrictEqual(stubbedResult);

    const stub = contract.getSimulateWriteStub('transferFrom');
    expect(stub?.callCount).toBe(1);
  });

  it('stubs the getEvents function', async () => {
    const contract = new ReadContractStub(ERC20ABI);

    expect(contract.getEvents('Transfer')).rejects.toThrowError();

    const stubbedEvents: Event<typeof ERC20ABI, 'Transfer'>[] = [
      {
        eventName: 'Transfer',
        args: {
          to: ALICE,
          from: BOB,
          value: 100n,
        },
        blockNumber: 1n,
        data: '0x123abc',
        transactionHash: '0x123abc',
      },
    ];
    contract.stubEvents('Transfer', stubbedEvents);

    const events = await contract.getEvents('Transfer');
    expect(events).toBe(stubbedEvents);

    const stub = contract.getEventsStub('Transfer');
    expect(stub?.callCount).toBe(1);
  });
});
