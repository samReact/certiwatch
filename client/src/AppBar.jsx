import { useAccount, useContractRead } from 'wagmi';
import { Row, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import { LogIn } from './LogIn';
import logo from './assets/logo-main.png';
import abi from '../abi/Watches.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function ResponsiveAppBar() {
  const { address } = useAccount();
  const result = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'owner',
    watch: true
  });

  const isOwner = result.data === address;

  const navigate = useNavigate();
  return (
    <div style={{ boxShadow: '0px 1px 5px #a5a5a5' }}>
      <Row
        justify={'space-between'}
        align="middle"
        style={{ padding: 12, boxShadow: '10px' }}
      >
        <Row sx={{ flexGrow: 1 }} align="middle">
          <Space size={'large'}>
            <img
              src={logo}
              alt="logo"
              width={200}
              onClick={() => navigate('/')}
            />
            <Link to={'/shop'} style={{ color: '#B37FEB' }}>
              I Buy
            </Link>
            <Link to={'/sell'} style={{ color: '#B37FEB' }}>
              I Sell
            </Link>
            {isOwner && (
              <Link to={'/admin'} style={{ color: '#B37FEB' }}>
                Admin
              </Link>
            )}
          </Space>
        </Row>
        <LogIn />
      </Row>
    </div>
  );
}
