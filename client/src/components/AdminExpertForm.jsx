import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { ethers } from 'ethers';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../state/notificationSlice';

export default function AdminExpertForm() {
  const [form] = Form.useForm();
  const [fields, setFields] = useState({ address: '', name: '' });
  const dispatch = useDispatch();

  const { marketplaceAbi, marketplaceAddress } = useSelector(
    (state) => state.eth
  );

  const isValidAddress = ethers.utils.isAddress(fields.address);

  const { config } = usePrepareContractWrite({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'addExpert',
    enabled: isValidAddress && fields.name.length > 0,
    args: [fields.address, fields.name]
  });
  const { write, isLoading } = useContractWrite({
    ...config,
    onSuccess(data) {
      dispatch(
        addNotification({
          message: 'Expert Added !',
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
        name="address"
        rules={[
          { required: true, message: 'Please input expert address !' },
          () => ({
            validator(_, value) {
              const isValidAddress = ethers.utils.isAddress(value);
              if (!isValidAddress) {
                return Promise.reject(new Error('Invalid ETH address '));
              }
              return Promise.resolve();
            }
          })
        ]}
      >
        <Input placeholder="ETH Address" name="address" />
      </Form.Item>
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Please input expert name !' }]}
      >
        <Input placeholder="Name" name="name" />
      </Form.Item>
      <Button
        type="primary"
        onClick={onSubmit}
        disabled={!write}
        loading={isLoading}
      >
        Add
      </Button>
    </Form>
  );
}
