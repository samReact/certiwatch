import { useState } from 'react';
import { Table } from 'antd';

import { formattedAddress, removeDuplicates } from '../utils/index.js';
import { useEffect } from 'react';

export default function AdminCollectionTable({ collectionEvents }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (collectionEvents.length > 0) {
      let filtered = removeDuplicates(collectionEvents);
      setCollections(filtered);
    }
  }, [collectionEvents]);

  const columns = [
    {
      title: 'Name',
      dataIndex: '_name'
    },
    {
      title: 'Symbol',
      dataIndex: '_symbol'
    },
    {
      title: 'Contract Address',
      render: (_, record) => formattedAddress(record._addr)
    }
  ];
  return <Table rowKey={'_addr'} columns={columns} dataSource={collections} />;
}
