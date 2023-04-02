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

  const itemEvents = useSelector((state) => state.eth.itemEvents);

  function filterEvents(tableau) {
    const result = Object.values(
      tableau.reduce((acc, obj) => {
        if (!acc[obj.itemId] || acc[obj.itemId].status < obj.status) {
          acc[obj.itemId] = obj;
        }
        return acc;
      }, {})
    );
    setProposals(result);
  }

  useEffect(() => {
    if (itemEvents.length > 0) {
      filterEvents(itemEvents);
    }
  }, [itemEvents]);

  async function handleSubmit(record) {
    setSelectedRow(record);
    setLoading(true);
    try {
      await marketplace.updateItem(parseInt(record.itemId), 1, '');
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
      render: (_, record) => {
        let tag = 'Pending';
        if (record.status === 1) {
          tag = 'Approved';
        } else if (record.status === 2) {
          tag = 'Certified';
        } else if (record.status === 3) {
          tag = 'Published';
        }
        return <Tag color={tag === 'Approved' ? 'green' : 'purple'}>{tag}</Tag>;
      }
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={record.status !== 0}
            onClick={() => handleSubmit(record)}
            loading={loading && record.itemId === selectedRow.itemId}
          >
            Approve
          </Button>
        </Space>
      )
    }
  ];
  console.log(proposals);
  return <Table rowKey={'itemId'} columns={columns} dataSource={proposals} />;
}
