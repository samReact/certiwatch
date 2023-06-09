import { Row } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LogIn } from './LogIn';
import logo from '../assets/logo-main.png';
import { useSelector } from 'react-redux';

export default function ResponsiveAppBar() {
  const { isOwner, isExpert } = useSelector((state) => state.eth);

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  return (
    <Row align="middle" className="menu" justify={'space-between'}>
      <Row align="middle">
        <img src={logo} alt="logo" width={200} onClick={() => navigate('/')} />
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
        {isExpert && (
          <Link
            to={'/expert'}
            className={
              pathname.startsWith('/expert')
                ? `menu-item -selected`
                : 'menu-item'
            }
          >
            Expert
          </Link>
        )}
      </Row>
      <LogIn />
    </Row>
  );
}
