import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, List, Row, Typography, Image, Button } from 'antd';
import axios from 'axios';

import { formattedAddress } from '../utils';

export default function WatchPage() {
  let { id } = useParams();
  const [certificateUrl, setCertificateUrl] = useState();

  function removeIpfs(url) {
    return url.replace(/^ipfs?:\/\//, '');
  }

  const watches = useSelector((state) => state.watches.watches);

  const watch = watches.filter((watch) => watch.id == id)[0];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`https://ipfs.io/ipfs/${watch.ipfsHash}`);
        const data = await res.data;
        setCertificateUrl(removeIpfs(res.data.image));
      } catch (error) {
        console.log(error);
      }
    };
    if (watch && !certificateUrl && watch.ipfsHash) {
      fetch();
    }
  }, [watch]);

  return (
    <div className="container">
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
            src={`https://ipfs.io/ipfs/${certificateUrl}`}
            width={'50%'}
            // fallback={template}
          />
        </Col>
        <Col>
          <Typography.Title level={2}>
            {watch.brand} {watch.model}
          </Typography.Title>
          <Typography.Text>
            Owned by{' '}
            <Typography.Text strong>
              {formattedAddress(watch.address)}
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
              Buy at {watch.price} ETH
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
