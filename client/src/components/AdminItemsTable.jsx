import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Space, Table, Tag } from 'antd';

import { filterEvents, formattedAddress } from '../utils/index.js';
import { addNotification } from '../state/notificationSlice.js';
import { useEffect } from 'react';

export default function AdminItemsTable({
  marketplace,
  nftCollection,
  itemEvents
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  useEffect(() => {
    if (itemEvents.length > 0) {
      const filtered = filterEvents(itemEvents);
      setProposals(filtered);
    }
  }, [itemEvents]);

  async function handleSubmit(record) {
    setSelectedRow(record);
    setLoading(true);
    try {
      await (await nftCollection.addToWhitelist(record.seller)).wait();
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
  return <Table rowKey={'itemId'} columns={columns} dataSource={proposals} />;
}
