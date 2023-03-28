import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, List, Row, Typography, Image, Button, Spin, Space } from 'antd';

import { formattedAddress, removeIpfs } from '../utils';
import { useEffect, useState } from 'react';

export default function WatchPage() {
  const [watch, setWatch] = useState();
  let { id } = useParams();

  const watches = useSelector((state) => state.watches.fullWatches);

  useEffect(() => {
    if (id && watches) {
      const watch = watches.filter((watch) => watch.id == id)[0];
      setWatch(watch);
    }
  }, [id]);

  return (
    <div className="container">
      {watch ? (
        <Row gutter={32}>
          <Col xs={8}>
            <Image
              placeholder
              src={watch.photos[0]}
              width={'100%'}
              style={{ marginBottom: 8 }}
            />
            <List
              grid={{ column: 2, gutter: 8 }}
              dataSource={watch.photos.filter((photo, i) => i !== 0)}
              renderItem={(url, i) => (
                <List.Item>
                  <Image src={url} width={'100%'} />
                </List.Item>
              )}
            />
            <Image
              placeholder
              src={` https://ipfs.io/ipfs/${removeIpfs(watch.image)}`}
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
                    {formattedAddress(watch.seller)}
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
              <Button type="primary" size="large">
                Buy at {watch.totalPrice} ETH
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}
