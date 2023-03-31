import React, { useEffect, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminPage from './routes/AdminPage';
import CreatePage from './routes/CreatePage';
import ExpertPage from './routes/ExpertPage';
import HomePage from './routes/HomePage';
import SellPage from './routes/SellPage';
import ShopPage from './routes/ShopPage';
import WatchPage from './routes/WatchPage';
import ExpertForm from './routes/ExpertForm';
import { Layout, notification } from 'antd';
import { useSelector } from 'react-redux';
import ResponsiveAppBar from './AppBar';
import FooterComponent from './FooterComponent';

const { Header, Content } = Layout;

export default function Root() {
  const [api, contextHolder] = notification.useNotification();
  const newNotification = useSelector((state) => state.notification);

  const openNotification = useCallback(
    (message, description, type) => {
      return (
        message,
        api[type]({
          description
        })
      );
    },
    [api]
  );

  useEffect(() => {
    const { message, description, type } = newNotification;
    if (message && description && type) {
      openNotification(message, description, type);
    }
  }, [newNotification, openNotification]);

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
