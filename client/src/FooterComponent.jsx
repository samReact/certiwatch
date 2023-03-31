import React from 'react';
import {
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined
} from '@ant-design/icons';
import { Button, Divider, Layout, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo-main.png';

const { Footer } = Layout;

export default function FooterComponent() {
  const navigate = useNavigate();
  return (
    <Footer style={{ backgroundColor: '#fff' }}>
      <div style={{ height: 200 }}>
        <Row justify={'center'} style={{ marginTop: 50 }}>
          <img
            src={logo}
            alt="logo"
            width={200}
            onClick={() => navigate('/')}
          />
        </Row>
        <Divider />
        <Row justify={'center'} style={{ marginTop: 50 }}>
          <Space size={'large'}>
            <Button type="primary" shape="circle" icon={<TwitterOutlined />} />
            <Button type="primary" shape="circle" icon={<FacebookOutlined />} />
            <Button type="primary" shape="circle" icon={<YoutubeOutlined />} />
          </Space>
        </Row>
        <Row justify={'center'}>
          <Typography.Text type="secondary" style={{ marginTop: 30 }}>
            &copy; Certiwatch 2023
          </Typography.Text>
        </Row>
      </div>
    </Footer>
  );
}
