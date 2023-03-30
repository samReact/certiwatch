import { ConfigProvider, Layout } from 'antd';
import { purple } from '@ant-design/colors';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
const { Header, Content } = Layout;

import ResponsiveAppBar from './AppBar';
import './index.css';
import { store } from './state/store';

import FooterComponent from './FooterComponent';
import Root from './root';

const { provider, webSocketProvider } = configureChains(
  [hardhat],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
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
            <Layout hasSider={false}>
              <Header>
                <ResponsiveAppBar />
              </Header>
              <Content>
                <Root />
              </Content>
              <FooterComponent />
            </Layout>
          </ConfigProvider>
        </WagmiConfig>
      </PersistGate>
    </Provider>
  );
}

export default App;
