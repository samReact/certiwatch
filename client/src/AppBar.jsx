import { Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import { LogIn } from './LogIn';
import logo from './assets/logo-main.png';

export default function ResponsiveAppBar() {
  const navigate = useNavigate();
  return (
    <Row justify={'space-between'} align="middle" style={{ padding: 12 }}>
      <div sx={{ flexGrow: 1 }}>
        <img src={logo} alt="logo" width={200} onClick={() => navigate('/')} />
      </div>
      <LogIn />
    </Row>
  );
}
