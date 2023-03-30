import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useContractRead } from 'wagmi';
import { abi } from '../../contractsData/MarketPlace.json';
import { address as contractAddress } from '../../contractsData/Marketplace-address.json';

export default function ExpertPage() {
  const navigate = useNavigate();
  const { address, isDisconnected } = useAccount();

  const expert = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'getExpert',
    watch: true,
    enabled: Boolean(address && contractAddress),
    args: [address]
  });

  const isExpert = expert && expert.data && expert.data.authorized;

  useEffect(() => {
    if (isDisconnected || !isExpert) {
      navigate('/');
    }
  }, [isDisconnected, isExpert]);

  return <div>ExpertPage</div>;
}
