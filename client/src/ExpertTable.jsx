import { Table, Tag } from 'antd';

import { formattedAddress } from './utils/index.js';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';

export default function ExpertTable({ events }) {
  const [experts, setExperts] = useState([]);

  const getExperts = useCallback(async () => {
    const experts = [];
    for (let i = 0; i < events.length; i++) {
      let { _addr, _name } = events[i].args;

      experts.push({
        address: _addr,
        name: _name,
        authorized: true
      });
    }
    setExperts(experts);
  }, [events]);

  useEffect(() => {
    if (events.length > 0) {
      getExperts();
    }
  }, [events, getExperts]);

  const columns = [
    {
      title: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (_, record) => formattedAddress(record.address)
    },
    {
      title: 'Status',
      dataIndex: 'authorized',
      render: (_, record) =>
        record.authorized ? (
          <Tag color={'purple'}>Approved</Tag>
        ) : (
          <Tag>Pending</Tag>
        )
    }
  ];

  return <Table rowKey={'address'} columns={columns} dataSource={experts} />;
}
