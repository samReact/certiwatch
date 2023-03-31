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
import { Col, Row, Space, Typography } from 'antd';
import ExpertTable from '../ExpertTable';
import { useCallback } from 'react';
import AddExpertForm from '../AddExpertForm';

export default function AdminPage() {
  const [value, setValue] = useState();
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
    enabled: Boolean(value),
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
  }, [isDisconnected, isOwner, navigate]);

  const getOldEvents = useCallback(async () => {
    let eventFilter = marketplace.filters.ExpertAdded();
    let events = await marketplace.queryFilter(eventFilter);
    setEvents(events);
  }, [marketplace]);

  useEffect(() => {
    if (marketplace.provider) {
      getOldEvents();
    }
  }, [marketplace.provider, getOldEvents]);

  return (
    <div className="container">
      <div style={{ marginBottom: 40 }}>
        <Typography.Title level={3}>Profit Rate</Typography.Title>
        <AdminFee value={value} setValue={setValue} writeData={writeData} />
      </div>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Typography.Title level={3}>Experts</Typography.Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <AddExpertForm />
            <ExpertTable events={events} marketplace={marketplace} />
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Typography.Title level={3}>Ads</Typography.Title>
          <AdminTable />
        </Col>
      </Row>
      <Row></Row>
    </div>
  );
}
