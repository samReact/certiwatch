import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Col, Row, Space, Typography } from 'antd';
import { useAccount, useContract, useContractRead, useSigner } from 'wagmi';

import AdminFee from '../components/AdminFee';
import AdminExpertForm from '../components/AdminExpertForm';
import AdminExpertTable from '../components/AdminExpertTable';
import AdminItemsTable from '../components/AdminItemsTable';
import AdminCollectionTable from '../components/AdminCollectionTable';
import AdminCollectionForm from '../components/AdminCollectionForm';

export default function AdminPage() {
  const {
    itemEvents,
    collectionEvents,
    expertEvents,
    marketplaceAddress,
    marketplaceAbi,
    nftCollectionAddress,
    nftCollectionAbi
  } = useSelector((state) => state.eth);

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

  return (
    <div className="container">
      <div style={{ marginBottom: 40 }}>
        <AdminFee />
      </div>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Typography.Title level={3}>Experts</Typography.Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <AdminExpertForm />
            <AdminExpertTable events={expertEvents} />
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Typography.Title level={3}>Collections</Typography.Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <AdminCollectionForm />
            <AdminCollectionTable collectionEvents={collectionEvents} />
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Typography.Title level={3}>Ads</Typography.Title>
          <AdminItemsTable
            itemEvents={itemEvents}
            marketplace={marketplace}
            nftCollection={nftCollection}
          />
        </Col>
      </Row>
    </div>
  );
}
