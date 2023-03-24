import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Route, Routes } from 'react-router-dom';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { purple } from '@ant-design/colors';

import ResponsiveAppBar from './AppBar';
import HomePage from './routes/HomePage';
import './index.css';
import SellPage from './routes/SellPage';
import { store } from './state/store';
import ShopPage from './routes/ShopPage';

import WatchPage from './routes/WatchPage';
import AdminPage from './routes/AdminPage';

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
  components: {}
};
let persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiConfig client={client}>
          <ConfigProvider theme={theme}>
            <ResponsiveAppBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sell" element={<SellPage />}></Route>
              <Route path="/shop" element={<ShopPage />}></Route>
              <Route path="/shop/:id" element={<WatchPage />} />
              <Route path="/Admin" element={<AdminPage />} />
            </Routes>
          </ConfigProvider>
        </WagmiConfig>
      </PersistGate>
    </Provider>
  );
}

export default App;
