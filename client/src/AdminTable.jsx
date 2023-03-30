import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Space, Table, Tag } from 'antd';

import { formattedAddress } from './utils/index.js';
import { update } from './state/watchesSlice';

export default function AdminTable() {
  const watches = useSelector((state) => state.watches.watches);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  async function handleSubmit(record) {
    setSelectedRow(record);
    setLoading(true);
    try {
      const payload = { ...record, approved: true };
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
        record.approved ? (
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
            disabled={record.approved}
            onClick={() => handleSubmit(record)}
            loading={selectedRow && selectedRow.id === record.id && loading}
          >
            Approve
          </Button>
        </Space>
      )
    }
  ];

  return <Table rowKey={'id'} columns={columns} dataSource={watches} />;
}
