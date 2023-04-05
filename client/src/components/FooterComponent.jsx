import React from 'react';
import {
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined
} from '@ant-design/icons';
import { Button, Divider, Layout, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo-main.png';

const { Footer } = Layout;

export default function FooterComponent() {
  const navigate = useNavigate();
  return (
    <Footer className="footer">
      <div className="footer-container">
        <Row justify={'center'} className="footer-item">
          <img
            src={logo}
            alt="logo"
            width={200}
            onClick={() => navigate('/')}
          />
        </Row>
        <Divider />
        <Row justify={'center'} className="footer-item">
          <Space size={'large'}>
            <Button type="primary" shape="circle" icon={<TwitterOutlined />} />
            <Button type="primary" shape="circle" icon={<FacebookOutlined />} />
            <Button type="primary" shape="circle" icon={<YoutubeOutlined />} />
          </Space>
        </Row>
        <Row justify={'center'}>
          <Typography.Text type="secondary" className="footer-item-last">
            &copy; Certiwatch 2023
          </Typography.Text>
        </Row>
      </div>
    </Footer>
  );
}
