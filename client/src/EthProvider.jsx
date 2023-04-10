import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';

import {
  useAccount,
  useContract,
  useContractEvent,
  useContractRead,
  useSigner
} from 'wagmi';
import { updateEvents, updateExpert, updateOwner } from './state/ethSlice';
import { updateFeeRate } from './state/appSlice';

export default function EthProvider({ children }) {
  const [api, contextHolder] = notification.useNotification();
  const newNotification = useSelector((state) => state.notification);
  const { marketplaceAbi, marketplaceAddress, factoryAddress, factoryAbi } =
    useSelector((state) => state.eth);

  const dispatch = useDispatch();

  const { data: signer } = useSigner();

  const openNotification = useCallback(
    (message, description, type) => {
      return api[type]({
        message,
        description,
        duration: 2
      });
    },
    [api]
  );

  const { address } = useAccount();

  const marketplace = useContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    signerOrProvider: signer
  });

  const factory = useContract({
    address: factoryAddress,
    abi: factoryAbi,
    signerOrProvider: signer
  });

  const { data } = useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'owner',
    watch: true,
    enabled: Boolean(address && marketplaceAddress)
  });

  const expert = useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'experts',
    watch: true,
    enabled: Boolean(address && marketplaceAddress),
    args: [address]
  });

  const feeRate = useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'feeRate',
    watch: true,
    enabled: Boolean(address && marketplaceAddress)
  });

  useContractEvent({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    eventName: 'ItemUpdated',
    listener(a, b, c, d, e, f, g, event) {
      if (event) {
        dispatch(updateEvents({ name: 'itemEvents', value: [event.args] }));
      }
    }
  });

  useContractEvent({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    eventName: 'ExpertAdded',
    listener(node, label, event) {
      if (event) {
        dispatch(updateEvents({ name: 'expertEvents', value: [event.args] }));
      }
    }
  });

  useContractEvent({
    address: factoryAddress,
    abi: factoryAbi,
    eventName: 'CollectionAdded',
    listener(node, label, a, event) {
      if (event) {
        dispatch(
          updateEvents({ name: 'collectionEvents', value: [event.args] })
        );
      }
    }
  });

  const getOldProposalEvents = useCallback(
    async (contract, eventName, key) => {
      let eventFilter = contract.filters[eventName]();
      let events = await contract.queryFilter(eventFilter);
      if (events.length) {
        let args = events.map((event) => event.args);
        dispatch(updateEvents({ name: key, value: args }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const { message, description, type } = newNotification;
    if (message && description && type) {
      openNotification(message, description, type);
    }
  }, [newNotification, openNotification]);

  useEffect(() => {
    if (marketplace.provider && factory.provider) {
      getOldProposalEvents(marketplace, 'ItemUpdated', 'itemEvents');
      getOldProposalEvents(marketplace, 'ExpertAdded', 'expertEvents');
      getOldProposalEvents(factory, 'CollectionAdded', 'collectionEvents');
    }
  }, [marketplace, factory, getOldProposalEvents]);

  useEffect(() => {
    if (typeof parseInt(feeRate.data) === 'number') {
      dispatch(updateFeeRate(feeRate.data));
    }
  }, [feeRate.data, dispatch]);

  useEffect(() => {
    if (data && address) {
      const isOwner = data === address;
      dispatch(updateOwner(isOwner));
    }
  }, [data, address, dispatch]);

  useEffect(() => {
    if (expert && address) {
      const isExpert = expert.data && expert.data.authorized;
      dispatch(updateExpert(isExpert));
    }
  }, [address, dispatch, expert]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}
