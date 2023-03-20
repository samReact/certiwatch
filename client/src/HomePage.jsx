import React from 'react';
import { useContractRead, useContractWrite } from 'wagmi';
import abi from '../abi/SimpleStorage.json';

export default function HomePage() {
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const { data, isLoading, isSuccess, write } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress,
    abi: abi,
    functionName: 'setNumber',
    args: [10]
  });

  const result = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'getNumber',
    watch: true
  });
  return (
    <div>
      {parseInt(result.data)}
      <button onClick={() => write()}>Feed</button>
    </div>
  );
}
