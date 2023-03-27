import { Button, Space, Table, Tag } from 'antd';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formattedAddress } from '../utils/index.js';
import { update } from '../state/watchesSlice';
import axios from 'axios';

export default function AdminTable() {
  const watches = useSelector((state) => state.watches.watches);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(record) {
    setLoading(true);
    try {
      const res = await axios.post('/api/uploadIpfs', {
        brand: record.brand,
        model: record.model
      });
      const data = await res.data;

      const payload = { ...record, ipfsHash: data.IpfsHash, certified: true };
      dispatch(update(payload));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      render: (_, record) =>
        record.certified ? (
          <Tag color={'purple'}>Approved</Tag>
        ) : (
          <Tag>Pending</Tag>
        )
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={record.certified}
            onClick={() => handleSubmit(record)}
            loading={loading}
          >
            Approve
          </Button>
        </Space>
      )
    }
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSelectedRow(selectedRows[0]);
    },
    getCheckboxProps: (record) => ({
      disabled: record.certified // Column configuration not to be checked
    })
  };

  return <Table rowKey={'id'} columns={columns} dataSource={watches} />;
}