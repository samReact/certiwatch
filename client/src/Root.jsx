import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { Layout, notification } from 'antd';

import AdminPage from './routes/AdminPage';
import CreatePage from './routes/CreatePage';
import ExpertPage from './routes/ExpertPage';
import HomePage from './routes/HomePage';
import SellPage from './routes/SellPage';
import ShopPage from './routes/ShopPage';
import WatchPage from './routes/WatchPage';
import ResponsiveAppBar from './components/AppBar';
import FooterComponent from './components/FooterComponent';
import {
  useAccount,
  useContract,
  useContractEvent,
  useContractRead,
  useSigner
} from 'wagmi';
import { updateEvents } from './state/ethSlice';
import { updateFeeRate } from './state/appSlice';
import ExpertFormPage from './routes/ExpertFormPage';

const { Header, Content } = Layout;

export default function Root() {
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

  return (
    <Layout hasSider={false}>
      <Header>
        <ResponsiveAppBar />
      </Header>
      {contextHolder}
      <Content>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:id" element={<WatchPage />} />
          <Route path="/mint" element={<CreatePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/expert" element={<ExpertPage />} />
          <Route path="/expert/:id" element={<ExpertFormPage />} />
        </Routes>
      </Content>
      <FooterComponent />
    </Layout>
  );
}