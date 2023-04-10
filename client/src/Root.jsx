import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout, Result } from 'antd';

import ResponsiveAppBar from './components/AppBar';
import FooterComponent from './components/FooterComponent';
import { useAccount, useNetwork } from 'wagmi';
import HomePage from './routes/HomePage';
import SellPage from './routes/SellPage';
import ShopPage from './routes/ShopPage';
import WatchPage from './routes/WatchPage';
import CreatePage from './routes/CreatePage';
import AdminPage from './routes/AdminPage';
import ExpertPage from './routes/ExpertPage';
import ExpertFormPage from './routes/ExpertFormPage';
import EthProvider from './EthProvider';

const VALID_NETWORK = import.meta.env.VITE_VALID_NETWORK;

const { Header, Content } = Layout;

export default function Root() {
  const { chain } = useNetwork();
  const { isDisconnected } = useAccount();

  return (
    <Layout hasSider={false}>
      <Header>
        <ResponsiveAppBar />
      </Header>
      <Content>
        {isDisconnected ? (
          <Result
            status="warning"
            title={'You must be connected to enjoy our services !'}
          />
        ) : chain && chain.name !== VALID_NETWORK ? (
          <Result
            status="warning"
            title={`We do not support ${chain.name} network yet, Please switch to ${VALID_NETWORK} to enjoy our services`}
          />
        ) : (
          <EthProvider>
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
          </EthProvider>
        )}
      </Content>
      <FooterComponent />
    </Layout>
  );
}
