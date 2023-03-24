import { Card, List, Typography } from 'antd';
import Meta from 'antd/es/card/Meta';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    title: 'Title 1'
  },
  {
    title: 'Title 2'
  },
  {
    title: 'Title 3'
  },
  {
    title: 'Title 4'
  }
];

export default function ShopPage() {
  const watches = useSelector((state) => state.watches.watches);
  const navigate = useNavigate();
  console.log(watches);
  return (
    <div className="container">
      <div className="container-content">
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 4
          }}
          dataSource={watches}
          renderItem={(item) => (
            <List.Item>
              <Card
                onClick={() => navigate(`/shop/${item.id}`)}
                hoverable
                style={{ width: 300 }}
                cover={<img alt="example" src={item.photos[0]} />}
              >
                <Typography.Text strong>{item.model}</Typography.Text>
                <Meta title={`${item.price} ETH`} description={item.brand} />
                <p>{item.description}</p>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
