import { Col, Row, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';

import image1 from '../assets/rolex_ai.png';
import image2 from '../assets/rolex_ai-2.png';
import tokenImage from '../assets/token.png';
import blockImage from '../assets/blockchain.png';

const { Text, Title } = Typography;

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          height: '50vh',
          position: 'relative',
          background:
            'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(244,70,252,1) 100%)'
        }}
      >
        <Title
          level={1}
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
            <Button
              type="primary"
              value="small"
              onClick={() => navigate('/shop')}
            >
              I BUY A WATCH
            </Button>
            <Button
              type="primary"
              value="small"
              onClick={() => navigate('/sell')}
            >
              I SELL A WATCH
            </Button>
          </Row>
        </div>
      </div>
      <div style={{ backgroundColor: '#fff' }}>
        <div className="container">
          <Row gutter={16} align="middle" justify={'space-between'}>
            <Col xs={24} md={10}>
              <img src={image1} alt="" width={'100%'} />
            </Col>
            <Col xs={24} md={10}>
              <Title level={4}>A Certified Watch portfolio</Title>
              <Text>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem.
              </Text>
            </Col>
          </Row>
        </div>
      </div>
      <div className="container">
        <Row gutter={16} align="middle" justify={'space-between'}>
          <Col xs={24} md={10}>
            <Title level={4}>BLOCKCHAIN ENABLED PLATFORM</Title>
            <Text>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem.
            </Text>
          </Col>
          <Col xs={24} md={10}>
            <img src={image2} alt="" width={'100%'} />
          </Col>
        </Row>
      </div>
      <div style={{ backgroundColor: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Title level={2}>BUY AND SELL SAFELY</Title>
          <Text>
            TextLorem ipsum dolor Titleipiscing elit, sed do eiusmod tempor it
            labore
          </Text>
          <Row justify={'space-around'} style={{ marginTop: 50 }}>
            <img src={tokenImage} alt="token" />
            <img src={blockImage} alt="token" />
          </Row>
        </div>
      </div>
    </>
  );
}
