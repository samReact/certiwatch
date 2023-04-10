import { ConfigProvider } from 'antd';
import { purple } from '@ant-design/colors';
import { Provider } from 'react-redux';
import { WagmiConfig, createClient, configureChains, goerli } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { InjectedConnector } from '@wagmi/core';

import './styles/index.css';
import { store } from './state/store';
import Root from './Root';

const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;

const { chains, provider } = configureChains(
  [hardhat, goerli, sepolia],
  [
    infuraProvider({ apiKey: INFURA_API_KEY, priority: 0 }),
    publicProvider({ priority: 1 })
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider
});

const theme = {
  token: {
    colorPrimary: purple[3]
  },
  components: {
    Layout: {
      Header: {
        backgroundColor: purple[3]
      }
    }
  }
};

function App() {
  return (
    <Provider store={store}>
      <WagmiConfig client={client}>
        <ConfigProvider theme={theme}>
          <Root />
        </ConfigProvider>
      </WagmiConfig>
    </Provider>
  );
}

export default App;
