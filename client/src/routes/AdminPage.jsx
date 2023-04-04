import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Col, Row, Space, Typography } from 'antd';
import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner
} from 'wagmi';

import AdminTable from '../AdminTable';
import AdminFee from '../AdminFee';
import ExpertTable from '../ExpertTable';
import AddExpertForm from '../AddExpertForm';

export default function AdminPage() {
  const {
    proposalsEvents,
    expertEvents,
    marketplaceAddress,
    marketplaceAbi,
    nftCollectionAddress,
    nftCollectionAbi
  } = useSelector((state) => state.eth);
  const { feeRate } = useSelector((state) => state.app);
  const [value, setValue] = useState();

  const { data: signer } = useSigner();

  const { address, isDisconnected } = useAccount();
  const navigate = useNavigate();

  const { data } = useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'owner',
    watch: true,
    enabled: Boolean(address)
  });

  const { config } = usePrepareContractWrite({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'updateProfitRate',
    enabled: Boolean(value),
    args: [parseInt(value)]
  });
  const writeData = useContractWrite(config);

  const marketplace = useContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    signerOrProvider: signer
  });

  const nftCollection = useContract({
    address: nftCollectionAddress,
    abi: nftCollectionAbi,
    signerOrProvider: signer
  });

  const isOwner = data && address && data === address;

  useEffect(() => {
    if (isDisconnected || !isOwner) {
      navigate('/');
    }
  }, [isDisconnected, isOwner, navigate]);

  useEffect(() => {
    if (typeof parseInt(feeRate.data) === 'number') {
      setValue(feeRate);
    }
  }, [feeRate]);

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
            <ExpertTable events={expertEvents} />
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Typography.Title level={3}>Ads</Typography.Title>
          <AdminTable
            events={proposalsEvents}
            marketplace={marketplace}
            nftCollection={nftCollection}
          />
        </Col>
      </Row>
    </div>
  );
}
