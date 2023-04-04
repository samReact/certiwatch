import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useContractRead } from 'wagmi';

import { abi } from '../../contractsData/Marketplace.json';
import { address as contractAddress } from '../../contractsData/Marketplace-address.json';
import AdsTable from '../AdsTable';

export default function ExpertPage() {
  const navigate = useNavigate();
  const { address, isDisconnected } = useAccount();

  const expert = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'experts',
    watch: true,
    enabled: Boolean(address && contractAddress),
    args: [address]
  });

  const isExpert = expert && expert.data && expert.data.authorized;

  useEffect(() => {
    if (isDisconnected || !isExpert) {
      navigate('/');
    }
  }, [isDisconnected, isExpert, navigate]);

  return (
    <div className="container">
      <div style={{ marginBottom: 40 }}>
        <AdsTable />
      </div>
    </div>
  );
}
