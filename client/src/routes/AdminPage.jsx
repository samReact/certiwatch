import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Space, Table } from 'antd';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';

import { formattedAddress } from '../utils';
import abi from '../../abi/Watches.json';
import { add, update } from '../state/watchesSlice';
import { useCallback } from 'react';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function AdminPage() {
  const watches = useSelector((state) => state.watches.watches);
  const [selectedRow, setSelectedRow] = useState([]);
  const [dispatched, setDispatched] = useState(false);
  const dispatch = useDispatch();

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'mintItem',
    args: [selectedRow.address, `ipfs://${selectedRow.ipfsHash}`],
    enabled: Boolean(selectedRow.address)
  });
  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  });

  const handleSubmit = useCallback(
    (payload) => {
      dispatch(add(payload));
    },
    [data?.hash]
  );

  if (isSuccess) {
    const payload = { ...selectedRow, certified: true, txHash: data.hash };
    // const filteredState = watches.filter((elt) => elt.id !== payload.id);
    console.log(isSuccess);
    handleSubmit(payload);
    // console.log({ ...filteredState, ...payload });
    // setDispatched(true);
    // dispatch(add(payload));
    // console.log(data);
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
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        selectedRow.id == record.id ? (
          <Space size="middle">
            {selectedRow.address && (
              <Button
                loading={isLoading}
                disabled={!write}
                onClick={() => write()}
              >
                Mint
              </Button>
            )}
          </Space>
        ) : (
          ''
        )
    }
  ];
  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSelectedRow(selectedRows[0]);
    }
  };

  return (
    <div className="container">
      {isSuccess && <h2>Successfuly minted !</h2>}
      <Table
        rowSelection={{
          type: 'radio',
          ...rowSelection
        }}
        rowKey={'id'}
        columns={columns}
        dataSource={watches}
      />
    </div>
  );
}
