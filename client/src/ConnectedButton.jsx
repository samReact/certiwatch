import { useEffect, useState } from 'react';
import { Avatar, Button, Popover, Stack, Typography } from '@mui/material';
import { useAccount, useDisconnect } from 'wagmi';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { formattedAddress } from './utils';

export function ConnectedButton() {
  const { address, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  const [anchorEl, setAnchorEl] = useState(null);
  const [formatted, setFormatted] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  }
  const open = Boolean(anchorEl);

  const avatar = address && jsNumberForAddress(address);
  useEffect(() => {
    if (address) {
      const formatted = formattedAddress(address);
      setFormatted(formatted);
    }
  }, [address]);

  return (
    <div>
      <>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
        >
          <Stack direction={'row'} alignItems="center" spacing={1}>
            <Avatar sx={{ width: 24, height: 24 }}>
              <Jazzicon diameter={24} seed={avatar} />
            </Avatar>
            <Typography sx={{ lineHeight: 1.75 }} variant="body2">
              {formatted}
            </Typography>
          </Stack>
        </Button>
        <Popover
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <Stack padding={2}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <Avatar sx={{ width: 36, height: 36 }}>
                <Jazzicon diameter={36} seed={avatar} />
              </Avatar>
              <Typography variant="body1">{formatted}</Typography>
            </Stack>

            <Button size="small" onClick={disconnect}>
              log out
            </Button>
          </Stack>
        </Popover>
      </>
    </div>
  );
}
