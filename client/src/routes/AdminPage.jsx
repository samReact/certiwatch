import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAccount,
  useContract,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner
} from 'wagmi';

import AdminTable from '../AdminTable';
import { address as contractAddress } from '../../contractsData/Marketplace-address.json';
import { abi } from '../../contractsData/MarketPlace.json';
import { useEffect } from 'react';
import AdminFee from '../AdminFee';
import { Typography } from 'antd';
import ExpertTable from '../ExpertTable';
import ExpertForm from '../ExpertForm';
import { useCallback } from 'react';

export default function AdminPage() {
  const [value, setValue] = useState(0);
  const [events, setEvents] = useState([]);

  const { data: signer } = useSigner();

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

  const marketplace = useContract({
    address: contractAddress,
    abi: abi,
    signerOrProvider: signer
  });

  useContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: 'ExpertAdded',
    listener(node, label, owner) {
      if (owner) {
        setEvents([...events, owner]);
      }
    }
  });

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

  const getOldEvents = useCallback(async () => {
    let eventFilter = marketplace.filters.ExpertAdded();
    let events = await marketplace.queryFilter(eventFilter);
    setEvents(events);
  }, [marketplace.provider]);

  useEffect(() => {
    if (marketplace.provider) {
      getOldEvents();
    }
  }, [marketplace.provider]);

  return (
    <div className="container">
      <div style={{ marginBottom: 40 }}>
        <Typography.Title level={3}>Profit Rate</Typography.Title>
        <AdminFee value={value} setValue={setValue} writeData={writeData} />
      </div>
      <div style={{ marginBottom: 40 }}>
        <Typography.Title level={3}>Experts</Typography.Title>
        <ExpertForm />
        <ExpertTable events={events} marketplace={marketplace} />
      </div>
      <Typography.Title level={3}>Ads</Typography.Title>
      <AdminTable />
    </div>
  );
}
