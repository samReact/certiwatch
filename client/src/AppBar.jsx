import { Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import { LogIn } from './LogIn';
import logo from './assets/logo-main.png';

export default function ResponsiveAppBar() {
  const navigate = useNavigate();
  return (
    <div style={{ boxShadow: '0px 1px 5px #a5a5a5' }}>
      <Row
        justify={'space-between'}
        align="middle"
        style={{ padding: 12, boxShadow: '10px' }}
      >
        <div sx={{ flexGrow: 1 }}>
          <img
            src={logo}
            alt="logo"
            width={200}
            onClick={() => navigate('/')}
          />
        </div>
        <LogIn />
      </Row>
    </div>
  );
}
