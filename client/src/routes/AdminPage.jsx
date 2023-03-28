import { useNavigate } from 'react-router-dom';
import { useAccount, useContractRead } from 'wagmi';

import AdminTable from './AdminTable';
import { address as contractAddress } from '../../contractsData/Marketplace-address.json';
import { abi } from '../../contractsData/MarketPlace.json';
import { useEffect } from 'react';

export default function AdminPage() {
  const { address, isDisconnected } = useAccount();
  const navigate = useNavigate();

  const { data } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'owner',
    watch: true,
    enabled: Boolean(address)
  });
  const isOwner = data && address && data === address;

  useEffect(() => {
    if (isDisconnected || !isOwner) {
      navigate('/');
    }
  }, [isDisconnected, isOwner]);

  return (
    <div className="container">
      <AdminTable />
    </div>
  );
}
