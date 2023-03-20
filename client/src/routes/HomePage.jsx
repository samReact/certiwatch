import React from 'react';
import { Col, Row, Button } from 'antd';
import { useContractRead, useContractWrite } from 'wagmi';
import abi from '../../abi/SimpleStorage.json';
import { useNavigate } from 'react-router-dom';
import { Space, Typography } from 'antd';

const { Text, Title } = Typography;

export default function HomePage() {
  const navigate = useNavigate();
  // const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  // const { data, isLoading, isSuccess, write } = useContractWrite({
  //   mode: 'recklesslyUnprepared',
  //   address: contractAddress,
  //   abi: abi,
  //   functionName: 'setNumber',
  //   args: [10]
  // });

  // const result = useContractRead({
  //   address: contractAddress,
  //   abi: abi,
  //   functionName: 'getNumber',
  //   watch: true
  // });
  return (
    // <div>
    //   {parseInt(result.data)}
    //   <button onClick={() => write()}>Feed</button>
    // </div>
    <>
      <div style={{ height: '50vh', position: 'relative' }}>
        <Title
          level={2}
          style={{
            textAlign: 'center',
            position: 'absolute',
            top: '10%',
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '60vw'
          }}
        >
          The largest certified marketplace for watch lovers
        </Title>
        <div
          style={{
            position: 'absolute',
            top: '70%',
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '30vw'
          }}
        >
          <Row justify={'space-between'}>
            <Button type="primary" value="small">
              Je suis acheteur
            </Button>
            <Button
              type="primary"
              value="small"
              onClick={() => navigate('/sell')}
            >
              Je suis vendeur
            </Button>
          </Row>
        </div>
        <img
          src="https://placehold.co/600x400"
          alt=""
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
      <div className="container">
        <Row gutter={16} align="middle">
          <Col xs={24} md={12}>
            <img src="https://placehold.co/500x300" alt="" width={'100%'} />
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>A Certified Watch portfolio</Title>
            <Text>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem.
            </Text>
          </Col>
        </Row>
      </div>
      <div style={{ backgroundColor: '#F5F5F5' }}>
        <div className="container">
          <Row gutter={16} align="middle">
            <Col xs={24} md={12}>
              <Title level={4}>BLOCKCHAIN ENABLED PLATFORM</Title>
              <Text>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem.
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <img src="https://placehold.co/500x300" alt="" width={'100%'} />
            </Col>
          </Row>
        </div>
      </div>
      <div height={300}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Title level={2}>BUY AND SELL SAFELY</Title>
          <Text>
            TextLorem ipsum dolor Titleipiscing elit, sed do eiusmod tempor it
            labore
          </Text>
        </div>
      </div>
    </>
  );
}
