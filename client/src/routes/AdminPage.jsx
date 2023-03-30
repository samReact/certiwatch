import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi';

import AdminTable from './AdminTable';
import { address as contractAddress } from '../../contractsData/Marketplace-address.json';
import { abi } from '../../contractsData/MarketPlace.json';
import { useEffect } from 'react';
import AdminFee from './AdminFee';

export default function AdminPage() {
  const [value, setValue] = useState(0);

  const { address, isDisconnected } = useAccount();
  const navigate = useNavigate();

  const { data } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'owner',
    watch: true,
    enabled: Boolean(address)
  });

  const feeRate = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'feeRate',
    watch: true,
    enabled: Boolean(address && contractAddress)
  });

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'updateProfitRate',
    enabled: false,
    args: [parseInt(value)]
  });
  const writeData = useContractWrite(config);

  const isOwner = data && address && data === address;

  useEffect(() => {
    if (feeRate.data) {
      setValue(feeRate.data);
    }
  }, [feeRate.data]);

  useEffect(() => {
    if (isDisconnected || !isOwner) {
      navigate('/');
    }
  }, [isDisconnected, isOwner]);

  return (
    <div className="container">
      <div style={{ marginBottom: 40 }}>
        <AdminFee value={value} setValue={setValue} writeData={writeData} />
      </div>
      <AdminTable />
    </div>
  );
}
