import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useContractRead } from 'wagmi';

import AdsTable from '../AdsTable';
import { useSelector } from 'react-redux';

export default function ExpertPage() {
  const navigate = useNavigate();
  const { address, isDisconnected } = useAccount();
  const { marketplaceAbi, marketplaceAddress } = useSelector(
    (state) => state.eth
  );

  const expert = useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'experts',
    watch: true,
    enabled: Boolean(address && marketplaceAddress),
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
