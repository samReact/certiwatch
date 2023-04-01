import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Space, Table, Tag } from 'antd';

import { formattedAddress } from './utils/index.js';
import { addNotification } from './state/notificationSlice.js';
import { useEffect } from 'react';

export default function AdminTable({ marketplace }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const proposalEvents = useSelector((state) => state.eth.proposalEvents);

  function filterEvents(tableau) {
    const result = Object.values(
      tableau.reduce((acc, obj) => {
        if (!acc[obj.proposalId] || acc[obj.proposalId].status < obj.status) {
          acc[obj.proposalId] = obj;
        }
        return acc;
      }, {})
    );
    setProposals(result);
  }

  useEffect(() => {
    if (proposalEvents.length > 0) {
      filterEvents(proposalEvents);
    }
  }, [proposalEvents]);

  async function handleSubmit(record) {
    setSelectedRow(record);
    setLoading(true);
    try {
      await marketplace.updateProposalStatus(parseInt(record.proposalId), 1);
      dispatch(
        addNotification({
          message: `${record.brand} ${record.model} approved !`,
          description: 'This add is now approved',
          type: 'success'
        })
      );
      setLoading(true);
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Error',
          description: error.message,
          type: 'error'
        })
      );
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
      dataIndex: 'seller',
      render: (_, record) => formattedAddress(record.seller)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (
        <Tag>{record.status === 0 ? 'Pending' : 'Approved'}</Tag>
      )
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={record.status === 1}
            onClick={() => handleSubmit(record)}
            loading={loading && record.proposalId === selectedRow.proposalId}
          >
            Approve
          </Button>
        </Space>
      )
    }
  ];
  return (
    <Table rowKey={'proposalId'} columns={columns} dataSource={proposals} />
  );
}
