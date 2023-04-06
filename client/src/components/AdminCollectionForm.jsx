import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../state/notificationSlice';

export default function AdminCollectionForm() {
  const [form] = Form.useForm();
  const [fields, setFields] = useState({ name: '', symbol: '' });
  const dispatch = useDispatch();

  const { factoryAddress, factoryAbi } = useSelector((state) => state.eth);

  const { config } = usePrepareContractWrite({
    address: factoryAddress,
    abi: factoryAbi,
    functionName: 'createCollection',
    enabled: fields.symbol.length > 0 && fields.name.length > 0,
    args: [fields.name, fields.symbol]
  });
  const { write, isLoading } = useContractWrite({
    ...config,
    onSuccess(data) {
      dispatch(
        addNotification({
          message: 'Collection Added !',
          description: `Tansaction ${data.hash}`,
          type: 'success'
        })
      );
      form.resetFields();
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

  const onSubmit = async () => {
    try {
      let validate = await form.validateFields();
      const { errorFields } = validate;
      if (!errorFields) {
        write();
      }
    } catch (error) {
      dispatch(
        addNotification({
          title: 'Error',
          message: error.message,
          type: 'error'
        })
      );
    }
  };

  return (
    <Form
      layout="inline"
      form={form}
      onChange={(e) =>
        setFields({ ...fields, [e.target.name]: e.target.value })
      }
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Please input collection name !' }]}
      >
        <Input placeholder="Name" name="name" />
      </Form.Item>
      <Form.Item
        name="symbol"
        rules={[
          { required: true, message: 'Please input collection symbol !' }
        ]}
      >
        <Input placeholder="Symbol" name="symbol" />
      </Form.Item>
      <Button
        type="primary"
        onClick={onSubmit}
        disabled={!write}
        loading={isLoading}
      >
        Create
      </Button>
    </Form>
  );
}
