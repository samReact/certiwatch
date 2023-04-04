import { Button, Col, Image, List, Row, Space, Spin, Typography } from 'antd';
import React from 'react';
import { formattedAddress, removeIpfs } from './utils';
import placeholder from './assets/placeholder.png';

const { Text } = Typography;

export default function WatchDetails({
  watch,
  isSeller,
  write,
  handleBuy,
  isLoading
}) {
  console.log(watch.attributes);
  return (
    <Row gutter={32} style={{ height: '100%' }}>
      {!watch ? (
        <Spin />
      ) : (
        <>
          <Col xs={8}>
            <div>
              <Image
                preview={false}
                src={`https://gateway.pinata.cloud/ipfs/${removeIpfs(
                  watch.images[0]
                )}`}
                placeholder={placeholder}
                fallback={placeholder}
                style={{ marginBottom: 8 }}
                width={'100%'}
              />
            </div>
            <List
              loading={!watch}
              grid={{ column: 2, gutter: 8 }}
              dataSource={watch.images.filter((photo, i) => i !== 0)}
              renderItem={(url, i) => (
                <List.Item>
                  <Image
                    placeholder={placeholder}
                    preview={false}
                    src={`https://gateway.pinata.cloud/ipfs/${removeIpfs(url)}`}
                    width={'100%'}
                  />
                </List.Item>
              )}
            />
            <Image
              placeholder={placeholder}
              src={`https://gateway.pinata.cloud/ipfs/${removeIpfs(
                watch.certificateUrl
              )}`}
              width={'50%'}
            />
          </Col>
          <Col
            xs={16}
            style={{
              display: 'flex',
              flexDirection: 'column'
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
            <Space style={{ marginTop: 20, flexWrap: 'wrap' }}>
              {watch.attributes.map(
                (elt, i) =>
                  elt.trait_type && (
                    <div key={i} className="attributes-tag">
                      <Text
                        strong
                        style={{
                          fontSize: 12
                        }}
                      >
                        {elt.trait_type}
                      </Text>
                      <hr className="divider" />
                      <Text
                        style={{
                          fontSize: 12
                        }}
                      >
                        {elt.trait_type === 'Expert address'
                          ? formattedAddress(elt.value)
                          : elt.value}
                      </Text>
                    </div>
                  )
              )}
            </Space>
            <div style={{ marginTop: 24 }}>
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
        </>
      )}
    </Row>
  );
}
