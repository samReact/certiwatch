import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Space, Table, Tag, Typography } from 'antd';
import axios from 'axios';

import { formattedAddress } from './utils/index.js';
import { update } from './state/watchesSlice';
import { useNavigate } from 'react-router-dom';

export default function AdsTable() {
  const watches = useSelector((state) => state.watches.watches);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const navigate = useNavigate();

  async function handleSubmit(record) {
    navigate(`/expert/${record.id}`);
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
        const tags = [];
        record.approved ? tags.push('Approved') : tags.push('Pending');
        if (record.certified) {
          tags.push('Certified');
        }
        return (
          <>
            {tags.map((elt) => {
              return (
                <Tag key={elt} color={elt === 'Approved' ? 'green' : 'purple'}>
                  {elt}
                </Tag>
              );
            })}
          </>
        );
      }
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={!record.approved || record.certified}
            onClick={() => handleSubmit(record)}
            loading={selectedRow && selectedRow.id === record.id && loading}
          >
            Certified
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      {watches.length ? (
        <Table rowKey={'id'} columns={columns} dataSource={watches} />
      ) : (
        <Row justify={'center'}>
          <Typography>No pending certification</Typography>
        </Row>
      )}
    </>
  );
}
