import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';

import { formattedAddress, removeDuplicates } from '../utils/index.js';

export default function AdminExpertTable({ events }) {
  const [filteredEvents, setFilteredEvent] = useState([]);

  useEffect(() => {
    if (events) {
      let filtered = removeDuplicates(events);
      setFilteredEvent(filtered);
    }
  }, [events]);

  const columns = [
    {
      title: 'name',
      dataIndex: '_name'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (_, record) => formattedAddress(record._addr)
    },
    {
      title: 'Status',
      render: () => <Tag color={'green'}>Approved</Tag>
    }
  ];

  return (
    <Table rowKey={'_addr'} columns={columns} dataSource={filteredEvents} />
  );
}
