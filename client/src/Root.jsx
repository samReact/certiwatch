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
import ExpertForm from './components/AdminExpertForm';
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

const { Header, Content } = Layout;

export default function Root() {
  const [api, contextHolder] = notification.useNotification();
  const newNotification = useSelector((state) => state.notification);
  const { marketplaceAbi, marketplaceAddress } = useSelector(
    (state) => state.eth
  );

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

  const getOldProposalEvents = useCallback(
    async (eventName, key) => {
      let eventFilter = marketplace.filters[eventName]();
      let events = await marketplace.queryFilter(eventFilter);
      if (events.length) {
        let args = events.map((event) => event.args);
        dispatch(updateEvents({ name: key, value: args }));
      }
    },
    [marketplace, dispatch]
  );

  useEffect(() => {
    const { message, description, type } = newNotification;
    if (message && description && type) {
      openNotification(message, description, type);
    }
  }, [newNotification, openNotification]);

  useEffect(() => {
    if (marketplace.provider) {
      getOldProposalEvents('ItemUpdated', 'itemEvents');
      getOldProposalEvents('ExpertAdded', 'expertEvents');
    }
  }, [marketplace.provider, getOldProposalEvents]);

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
          <Route path="/expert/:id" element={<ExpertForm />} />
        </Routes>
      </Content>
      <FooterComponent />
    </Layout>
  );
}
