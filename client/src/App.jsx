import { WagmiConfig, createClient, configureChains, goerli } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import ResponsiveAppBar from './AppBar';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const { provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
});

function App() {
  return (
    <WagmiConfig client={client}>
      <ResponsiveAppBar />
    </WagmiConfig>
  );
}

export default App;
