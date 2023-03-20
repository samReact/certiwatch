import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Button, Avatar, Space, Dropdown, Divider, Typography } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

import { formattedAddress } from './utils';
const { Text } = Typography;

export function ConnectedButton() {
  const { address, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  const [formatted, setFormatted] = useState('');
  const [open, setOpen] = useState(false);

  const avatar = address && jsNumberForAddress(address);
  useEffect(() => {
    if (address) {
      const formatted = formattedAddress(address);
      setFormatted(formatted);
    }
  }, [address]);

  return (
    <Dropdown
      trigger={['click']}
      onOpenChange={setOpen}
      dropdownRender={() => (
        <div
          style={{
            padding: 12,
            backgroundColor: '#fff'
          }}
        >
          <Space>
            <Avatar size={36} icon={<Jazzicon diameter={36} seed={avatar} />} />
            <Text>{formatted}</Text>
          </Space>
          <Divider />
          <Button size="small" onClick={disconnect}>
            log out
          </Button>
        </div>
      )}
    >
      <Button type="primary" value={'small'} ghost>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Avatar
            style={{ marginRight: 6 }}
            size={24}
            icon={<Jazzicon seed={avatar} />}
          />

          {formatted}
          {open ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </div>
      </Button>
    </Dropdown>
  );
}
