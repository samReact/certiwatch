import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Space, Typography } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';

import { addNotification } from '../state/notificationSlice';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export default function AdminFee() {
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(false);
  const [value, setValue] = useState();

  const { marketplaceAddress, marketplaceAbi } = useSelector(
    (state) => state.eth
  );

  const { feeRate } = useSelector((state) => state.app);

  const dispatch = useDispatch();

  async function handleSave() {
    if (!error) {
      write();
    }
  }

  const { config } = usePrepareContractWrite({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'updateProfitRate',
    enabled: Boolean(value),
    args: [parseInt(value)]
  });

  const { write, isLoading } = useContractWrite({
    ...config,
    onSuccess(data) {
      dispatch(
        addNotification({
          message: 'Fees rate changed ! !',
          description: `Tansaction ${data.hash}`,
          type: 'success'
        })
      );
      setDisabled(true);
    },
    onError(error) {
      dispatch(
        addNotification({
          message: 'Error',
          description: error.message,
          type: 'error'
        })
      );
    }
  });

  function handleChange(e) {
    const value = e.target.value;
    if (value < 1 || value > 50) {
      setError(true);
    } else {
      setError(false);
    }
    setValue(value);
  }

  useEffect(() => {
    if (typeof parseInt(feeRate.data) === 'number') {
      setValue(feeRate);
    }
  }, [feeRate]);

  return (
    <>
      <Typography.Title level={3}>Profit Rate</Typography.Title>
      <Space>
        <Input
          value={value}
          onChange={handleChange}
          addonBefore="Rate fees"
          addonAfter="%"
          disabled={disabled}
          controls={false}
          status={error && 'error'}
        />
        <Button
          type="primary"
          disabled={!write}
          loading={isLoading}
          onClick={() => {
            disabled ? setDisabled(false) : handleSave();
          }}
          icon={disabled ? <EditOutlined /> : <SaveOutlined />}
        >
          {disabled ? 'Edit' : 'Save'}
        </Button>
      </Space>
    </>
  );
}
