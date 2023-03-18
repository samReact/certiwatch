import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ConnectButton } from './ConnectButton';

export default function ResponsiveAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Certiwatch
          </Typography>
          <ConnectButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
