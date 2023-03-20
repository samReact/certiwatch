import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import ResponsiveAppBar from './AppBar';
import { green, purple } from '@mui/material/colors';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material';
import HomePage from './HomePage';
import { Container } from '@mui/system';

const { provider, webSocketProvider } = configureChains(
  [hardhat],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
});

const theme = createTheme({
  palette: {
    primary: {
      main: purple[300]
    },
    secondary: {
      main: green[500]
    }
  }
});

function App() {
  return (
    <WagmiConfig client={client}>
      <ThemeProvider theme={theme}>
        <ResponsiveAppBar />
        <Container>
          <HomePage />
        </Container>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;
