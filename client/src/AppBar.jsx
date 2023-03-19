import * as React from 'react';
import { Toolbar, AppBar, Box } from '@mui/material';

import { LogIn } from './LogIn';
import logo from './assets/logo-main.png';

export default function ResponsiveAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Box variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="logo" width={200} />
          </Box>
          <LogIn />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
