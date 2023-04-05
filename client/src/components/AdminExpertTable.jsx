import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';

import { formattedAddress } from '../utils/index.js';

export default function AdminExpertTable({ events }) {
  const [filteredEvents, setFilteredEvent] = useState([]);

  function removeDuplicates(arr) {
    const uniqueArr = arr.reduce((acc, obj) => {
      if (!acc.some((item) => item._addr === obj._addr)) {
        acc.push(obj);
      }
      return acc;
    }, []);
    setFilteredEvent(uniqueArr);
  }

  useEffect(() => {
    if (events) {
      removeDuplicates(events);
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
