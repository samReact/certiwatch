import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { ethers } from 'ethers';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { address as contractAddress } from '../contractsData/Marketplace-address.json';
import { abi } from '../contractsData/Marketplace.json';
import { useDispatch } from 'react-redux';
import { addNotification } from './state/notificationSlice';

export default function AddExpertForm() {
  const [form] = Form.useForm();
  const [fields, setFields] = useState({ address: '', name: '' });
  const dispatch = useDispatch();

  const isValidAddress = ethers.utils.isAddress(fields.address);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'addExpert',
    enabled: isValidAddress && fields.name.length > 0,
    args: [fields.address, fields.name]
  });
  const { write, isSuccess, isLoading } = useContractWrite(config);

  const successNotification = useCallback(() => {
    if (isSuccess) {
      dispatch(
        addNotification({
          message: 'Expert Added !',
          description: 'A new expert has been added',
          type: 'success'
        })
      );
    }
  }, [isSuccess, dispatch]);

  const onSubmit = async () => {
    try {
      let validate = await form.validateFields();
      const { errorFields } = validate;
      if (!errorFields) {
        write();
        form.resetFields();
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

  useEffect(() => {
    if (isSuccess) {
      successNotification();
    }
  }, [isSuccess, successNotification]);

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
