import { IERC20 } from 'src/base/testing/IERC20';
import { ALICE, BOB, NANCY } from 'src/base/testing/accounts';
import { ReadContractStub } from 'src/contract/stubs/ReadContractStub';
import { Event } from 'src/contract/types/Event';
import { describe, expect, it } from 'vitest';

const ERC20ABI = IERC20.abi;

describe('ReadContractStub', () => {
  it('stubs the read function without args, but with options', async () => {
    const contract = new ReadContractStub(IERC20.abi);

    // stub total supply
    contract.stubRead({
      functionName: 'totalSupply',
      value: 30n,
      // options can be specfied as well
      options: { blockNumber: 12n },
    });
    contract.stubRead({
      functionName: 'totalSupply',
      value: 40n,
      // options can be specfied as well
      options: { blockNumber: 16n },
    });
    // Now try and read them based on their args
    const totalSupplyAtBlock12 = await contract.read('totalSupply', undefined, {
      blockNumber: 12n,
    });
    expect(totalSupplyAtBlock12).toBe(30n);

    const totalSupplyAtBlock16 = await contract.read('totalSupply', undefined, {
      blockNumber: 16n,
    });
    expect(totalSupplyAtBlock16).toBe(40n);
  });

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
      // options can be specfied as well
      options: { blockNumber: 10n },
    });

    // Now try and read them based on their args
    const bobResult = await contract.read('balanceOf', BOB);
    const aliceResult = await contract.read('balanceOf', ALICE, {
      blockNumber: 10n,
    });
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

    // throws an error if you forget to stub the event your requesting
    expect(contract.getEvents('Transfer')).rejects.toThrowError();

    // Stub out the events when calling `getEvents` without any filter args
    const stubbedAllEvents: Event<typeof ERC20ABI, 'Transfer'>[] = [
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
      {
        eventName: 'Transfer',
        args: {
          from: ALICE,
          to: BOB,
          value: 100n,
        },
        blockNumber: 1n,
        data: '0x123abc',
        transactionHash: '0x123abc',
      },
    ];
    contract.stubEvents('Transfer', undefined, stubbedAllEvents);

    // Stub out the events when calling `getEvents` *with* filter args
    const stubbedFilteredEvents: Event<typeof ERC20ABI, 'Transfer'>[] = [
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
    contract.stubEvents(
      'Transfer',
      { filter: { from: BOB } },
      stubbedFilteredEvents,
    );

    // getting events without any filter args should return the stub that was
    // specified without any filter args
    const events = await contract.getEvents('Transfer');
    expect(events).toBe(stubbedAllEvents);
    const stub = contract.getEventsStub('Transfer');
    expect(stub?.callCount).toBe(1);

    // getting events with filter args should return the stub that was specified
    // *with* filter args
    const filteredEvents = await contract.getEvents('Transfer', {
      filter: { from: BOB },
    });
    expect(filteredEvents).toBe(stubbedFilteredEvents);
    const filteredStub = contract.getEventsStub('Transfer', {
      filter: { from: BOB },
    });
    expect(filteredStub?.callCount).toBe(1);
  });
});
