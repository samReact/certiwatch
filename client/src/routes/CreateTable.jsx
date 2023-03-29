import { useState } from 'react';
import { Button, Row, Space, Table, Tag, Typography } from 'antd';
import { ethers } from 'ethers';
import fileDownload from 'js-file-download';
import axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { update } from '../state/watchesSlice.js';
import { formattedAddress, removeIpfs } from '../utils/index.js';

export default function CreateTable({ marketplace, certificate, address }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const watches = useSelector((state) => state.watches.watches);
  const myWatches = watches.filter((watch) => watch.address === address);
  const dispatch = useDispatch();

  async function handleMint(record) {
    const listingPrice = ethers.utils.parseEther(record.price.toString());

    try {
      const uri = `https://ipfs.io/ipfs/${record.ipfsHash}`;
      await (await certificate.mintItem(uri)).wait();
      await (
        await certificate.setApprovalForAll(marketplace.address, true)
      ).wait();
      const tokenId = await certificate.tokenIds();
      await (
        await marketplace.addItem(certificate.address, tokenId, listingPrice)
      ).wait();
      const parsedId = parseInt(tokenId);
      const payload = { ...record, tokenId: parsedId, minted: true };
      dispatch(update(payload));
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      title: 'Address',
      dataIndex: 'address',
      render: (_, record) => formattedAddress(record.address)
    },
    {
      title: 'Status',
      dataIndex: 'certified',
      render: (_, record) => {
        if (record.certified && !record.minted) {
          return <Tag color={'green'}>Approved</Tag>;
        } else if (record.minted) {
          return <Tag color={'purple'}>Minted</Tag>;
        } else if (!record.certified) {
          return <Tag>Pending</Tag>;
        }
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
                disabled={!record.certified}
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

  return (
    <>
      {!myWatches.length ? (
        <Row justify={'center'}>
          <Typography>You don't have any listing yet</Typography>
        </Row>
      ) : (
        <Table rowKey={'id'} columns={columns} dataSource={myWatches} />
      )}
    </>
  );
}
