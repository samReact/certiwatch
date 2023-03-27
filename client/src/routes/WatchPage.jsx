import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, List, Row, Typography, Image, Button, Spin } from 'antd';

import { formattedAddress } from '../utils';
import { useEffect, useState } from 'react';

export default function WatchPage() {
  const [watch, setWatch] = useState();
  let { id } = useParams();

  function removeIpfs(url) {
    return url.replace(/^ipfs?:\/\//, '');
  }

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
            <List
              grid={{ gutter: 4, column: 2 }}
              dataSource={watch.photos}
              renderItem={(url) => (
                <List.Item>
                  <Image src={url} />
                </List.Item>
              )}
            />
            <Image
              placeholder
              src={`https://ipfs.io/ipfs/${removeIpfs(watch.image)}`}
              width={'50%'}
            />
          </Col>
          <Col>
            <Typography.Title level={2}>
              {watch.brand} {watch.model}
            </Typography.Title>
            <Typography.Text>
              Owned by{' '}
              <Typography.Text strong>
                {formattedAddress(watch.seller)}
              </Typography.Text>
            </Typography.Text>
            <div style={{ marginTop: 20 }}>
              <Typography.Text>{watch.description}</Typography.Text>
            </div>
            <div style={{ marginTop: 20 }}>
              <Typography.Text>Year: {watch.year}</Typography.Text>
            </div>
            <div style={{ marginTop: 20 }}>
              <Typography.Text>Serial: {watch.serial}</Typography.Text>
            </div>
            <div style={{ marginTop: 20 }}>
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
