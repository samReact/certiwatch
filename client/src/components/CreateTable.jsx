import { useEffect, useState } from 'react';
import { Button, Row, Space, Table, Tag, Typography } from 'antd';
import fileDownload from 'js-file-download';
import axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { filterEvents, formattedAddress, removeIpfs } from '../utils/index.js';
import { addNotification } from '../state/notificationSlice.js';

export default function CreateTable({ marketplace, certificate, address }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [proposals, setProposals] = useState([]);

  const { itemEvents } = useSelector((state) => state.eth);

  const dispatch = useDispatch();

  async function handleMint(record) {
    setSelectedRow(record);
    setIsLoading(true);
    const item = await marketplace.items(record.itemId);
    const ipfsHash = removeIpfs(item.ipfsUrl);
    if (ipfsHash && ipfsHash.length) {
      try {
        const uri = `https://ipfs.io/ipfs/${ipfsHash}`;
        await (await certificate.mintItem(uri)).wait();
        await (
          await certificate.setApprovalForAll(marketplace.address, true)
        ).wait();
        const tokenId = await certificate.tokenIds();
        await (
          await marketplace.addToken(certificate.address, tokenId, item.itemId)
        ).wait();
        dispatch(
          addNotification({
            message: `${record.brand} ${record.model} minted !`,
            description:
              'In a few minute your item will be visible to the marketplace',
            type: 'success'
          })
        );
        setIsLoading(false);
      } catch (error) {
        dispatch(
          addNotification({
            message: 'Error',
            description: error.message,
            type: 'error'
          })
        );
        setIsLoading(false);
      }
    }
  }

  async function handleDownload(record) {
    setSelectedRow(record);
    setIsLoading(true);
    try {
      const uri = await certificate.tokenURI(record.tokenId);
      const res = await axios(uri);
      const metada = await res.data;
      const image = metada.image;
      const url = `https://ipfs.io/ipfs/${removeIpfs(image)}`;
      const res2 = await axios(url, {
        responseType: 'blob'
      });
      fileDownload(res2.data, 'certificate.png');
      setIsLoading(false);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Error',
          description: error.message,
          type: 'error'
        })
      );
      setIsLoading(false);
    }
  }

  const columns = [
    {
      title: 'Model',
      dataIndex: 'model'
    },
    {
      title: 'Serial',
      dataIndex: 'serial'
    },
    {
      title: 'Seller',
      render: (_, record) => formattedAddress(record.seller)
    },
    {
      title: 'Status',
      render: (_, record) => {
        let tag = 'Pending';
        let color;
        if (record.status === 1) {
          tag = 'Approved';
          color = 'green';
        } else if (record.status === 2) {
          color = 'pink';
          tag = 'Certified';
        } else if (record.status === 3) {
          color = 'purple';
          tag = 'Published';
        } else if (record.status === 4) {
          tag = 'Sold';
        }
        return <Tag color={color}>{tag}</Tag>;
      }
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        if (!record.minted) {
          return (
            <Space size="middle">
              <Button
                loading={selectedRow && record.itemId === selectedRow.itemId}
                disabled={record.status !== 2}
                onClick={() => {
                  handleMint(record);
                }}
              >
                Mint
              </Button>
            </Space>
          );
        } else {
          return (
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
              loading={selectedRow && record.id === selectedRow.id && isLoading}
            >
              Certificate
            </Button>
          );
        }
      }
    }
  ];

  useEffect(() => {
    if (itemEvents.length > 0) {
      const filtered = filterEvents(itemEvents);
      const final = filtered.filter((result) => result.seller === address);
      setProposals(final);
    }
  }, [itemEvents, address]);

  return (
    <>
      {!proposals.length ? (
        <Row justify={'center'}>
          <Typography>You don't have any listing yet</Typography>
        </Row>
      ) : (
        <Table rowKey={'itemId'} columns={columns} dataSource={proposals} />
      )}
    </>
  );
}
