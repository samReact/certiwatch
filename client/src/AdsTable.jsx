import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Popover, Row, Space, Table, Tag, Typography } from 'antd';

import { formattedAddress } from './utils/index.js';

export default function AdsTable() {
  const [proposals, setProposals] = useState([]);

  const { itemEvents } = useSelector((state) => state.eth);

  const navigate = useNavigate();

  async function handleSubmit(record) {
    navigate(`/expert/${record.itemId}`);
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
        const content = (
          <div>
            <div>
              <b>Model: </b> {record.model}
            </div>
          </div>
        );
        return (
          <Space size="middle">
            <Popover content={content} title={record.brand} trigger="hover">
              <Button
                disabled={record.status !== 1}
                onClick={() => handleSubmit(record)}
              >
                Certified
              </Button>
            </Popover>
          </Space>
        );
      }
    }
  ];

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

  return (
    <>
      {proposals.length ? (
        <Table rowKey={'itemId'} columns={columns} dataSource={proposals} />
      ) : (
        <Row justify={'center'}>
          <Typography>No pending certification</Typography>
        </Row>
      )}
    </>
  );
}
