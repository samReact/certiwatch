import { Button, Col, Image, List, Row, Space, Typography } from 'antd';
import React from 'react';
import { formattedAddress, removeIpfs } from './utils';

export default function WatchDetails({
  watch,
  isSeller,
  write,
  handleBuy,
  isLoading
}) {
  return (
    <div>
      <Row gutter={32}>
        <Col xs={8}>
          <Image
            placeholder
            src={`https://gateway.pinata.cloud/ipfs/${removeIpfs(
              watch.images[0]
            )}`}
            width={'100%'}
            style={{ marginBottom: 8 }}
          />
          <List
            grid={{ column: 2, gutter: 8 }}
            dataSource={watch.images.filter((photo, i) => i !== 0)}
            renderItem={(url, i) => (
              <List.Item>
                <Image
                  src={`https://gateway.pinata.cloud/ipfs/${removeIpfs(url)}`}
                  width={'100%'}
                />
              </List.Item>
            )}
          />
          <Image
            placeholder
            src={`https://gateway.pinata.cloud/ipfs/${removeIpfs(
              watch.certificateUrl
            )}`}
            width={'50%'}
          />
        </Col>
        <Col xs={16}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
          >
            <div>
              <Typography.Title level={2} style={{ marginTop: 0 }}>
                {watch.brand} {watch.model}
              </Typography.Title>
              <Typography.Text>
                Owned by{' '}
                <Typography.Text strong>
                  {isSeller ? 'you' : formattedAddress(watch.seller)}
                </Typography.Text>
              </Typography.Text>
            </div>
            <div style={{ marginTop: 20 }}>
              <Typography.Text>{watch.description}</Typography.Text>
            </div>
            <Space style={{ marginTop: 20 }} direction="vertical">
              <Typography.Text>
                Case material: {watch.watch_case}
              </Typography.Text>
              <Typography.Text>
                Bracelet material: {watch.bracelet}
              </Typography.Text>
              <Typography.Text>Color: {watch.color}</Typography.Text>
              <Typography.Text>Movement: {watch.movement}</Typography.Text>
              <Typography.Text>Year: {watch.year}</Typography.Text>
              <Typography.Text>Gender: {watch.gender}</Typography.Text>
              <Typography.Text>Serial: {watch.serial}</Typography.Text>
            </Space>
            <Button
              type="primary"
              size="large"
              disabled={isSeller || !write}
              onClick={handleBuy}
              loading={isLoading}
            >
              Buy at {watch.totalPrice} ETH
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
