import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Popover, Row, Space, Table, Tag, Typography } from 'antd';

import { formattedAddress } from './utils/index.js';

export default function AdsTable() {
  const [proposals, setProposals] = useState([]);

  const { proposalEvents } = useSelector((state) => state.eth);

  const navigate = useNavigate();

  async function handleSubmit(record) {
    navigate(`/expert/${record.proposalId}`);
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
        }
        return <Tag color={tag === 'Approved' ? 'green' : 'purple'}>{tag}</Tag>;
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
                disabled={record.status === 2}
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

  return (
    <>
      {proposals.length ? (
        <Table rowKey={'proposalId'} columns={columns} dataSource={proposals} />
      ) : (
        <Row justify={'center'}>
          <Typography>No pending certification</Typography>
        </Row>
      )}
    </>
  );
}
