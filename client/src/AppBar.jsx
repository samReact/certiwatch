import { useAccount, useContractRead } from 'wagmi';
import { Row } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LogIn } from './LogIn';
import logo from './assets/logo-main.png';
import { abi } from '../contractsData/MarketPlace.json';
import { address } from '../contractsData/Marketplace-address.json';

const CONTRACT_ADDRESS = address;

export default function ResponsiveAppBar() {
  const { address } = useAccount();

  const { data } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'owner',
    watch: true,
    enabled: Boolean(address)
  });

  const isOwner = data && address && data === address;
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  return (
    <Row align="middle" style={{ height: '100%' }} justify={'space-between'}>
      <Row align="middle" style={{ height: '100%' }}>
        <img
          src={logo}
          alt="logo"
          width={200}
          onClick={() => navigate('/')}
          style={{ marginRight: 16 }}
        />
        <Link
          to={'/shop'}
          className={
            pathname.startsWith('/shop') ? `menu-item -selected` : 'menu-item'
          }
        >
          BUY
        </Link>
        <Link
          to={'/sell'}
          className={pathname === '/sell' ? `menu-item -selected` : 'menu-item'}
        >
          SELL
        </Link>
        <Link
          to={'/mint'}
          className={pathname === '/mint' ? `menu-item -selected` : 'menu-item'}
        >
          MINT
        </Link>
        {isOwner && (
          <Link
            to={'/admin'}
            className={
              pathname === '/admin' ? `menu-item -selected` : 'menu-item'
            }
          >
            Admin
          </Link>
        )}
      </Row>
      <LogIn />
    </Row>
  );
}
