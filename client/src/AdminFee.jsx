import { Button, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addNotification } from './state/notificationSlice';

export default function AdminFee({ writeData, value, setValue }) {
  const { isLoading, isSuccess, write } = writeData;
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  async function handleSave() {
    if (!error) {
      write();
    }
  }

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
    if (isSuccess) {
      dispatch(
        addNotification({
          message: 'Fees rate changed !',
          description: 'A new rate fees has been set',
          type: 'success'
        })
      );
      setDisabled(true);
    }
  }, [isSuccess, dispatch]);

  return (
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
  );
}
