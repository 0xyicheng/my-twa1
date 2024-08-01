import { useEffect, useState } from 'react';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | string>();
  const [balance, setBalance] = useState<null | string>(); 
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse('EQAsPtsStfqOtfxTsqdiSfyxSB29a5LiDtUzltYqnl6WLVKc') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(val.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [counterContract]);

  useEffect(() => {
    async function getBalance() {
      if (!counterContract || !client) return;
      const balanceNano = await client.getBalance(counterContract.address);
      const balanceTon = (Number(balanceNano) / 1_000_000_000).toFixed(6); // 转换为 TON 并保留6位小数
      setBalance(balanceTon);
    }
    getBalance();
  }, [counterContract, client]);
  return {
    value: val,
    balance,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
