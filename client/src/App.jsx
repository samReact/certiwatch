import { ConfigProvider } from 'antd';
import { purple } from '@ant-design/colors';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { WagmiConfig, createClient, configureChains, goerli } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from '@wagmi/core';

import './styles/index.css';
import { store } from './state/store';

import Root from './Root';

const { chains, provider } = configureChains(
  [hardhat, goerli, sepolia],
  [publicProvider()]
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
let persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiConfig client={client}>
          <ConfigProvider theme={theme}>
            <Root />
          </ConfigProvider>
        </WagmiConfig>
      </PersistGate>
    </Provider>
  );
}

export default App;
