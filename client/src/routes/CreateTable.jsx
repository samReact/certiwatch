import { Button, Space, Table, Tag } from 'antd';
import { ethers } from 'ethers';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../state/watchesSlice.js';
import { formattedAddress } from '../utils/index.js';

export default function CreateTable({ marketplace, certificate }) {
  const watches = useSelector((state) => state.watches.watches);
  const dispatch = useDispatch();

  async function handleMint(record) {
    try {
      const uri = `https://ipfs.io/ipfs/${record.ipfsHash}`;
      await certificate.mintItem(uri);
      await certificate.setApprovalForAll(marketplace.address, true);
      const listingPrice = ethers.utils.parseEther(record.price.toString());
      const tokenId = await certificate.tokenIds();
      await marketplace.addItem(certificate.address, tokenId, listingPrice);
      const parsedId = parseInt(tokenId);
      const payload = { ...record, tokenId: parsedId, minted: true };
      dispatch(update(payload));
    } catch (error) {
      console.log(error);
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
        }
      }
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        !record.minted && (
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
        )
    }
  ];

  return <Table rowKey={'id'} columns={columns} dataSource={watches} />;
}
