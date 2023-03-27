import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Route, Routes } from 'react-router-dom';
import {
  WagmiConfig,
  createClient,
  configureChains,
  useContract,
  useProvider
} from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { purple } from '@ant-design/colors';
import { abi as abiMarketplace } from '../contractsData/Marketplace.json';
import { abi as abiCertificate } from '../contractsData/Certificate.json';
import { address as certificateAddress } from '../contractsData/Certificate-address.json';

import ResponsiveAppBar from './AppBar';
import HomePage from './routes/HomePage';
import './index.css';
import SellPage from './routes/SellPage';
import { store } from './state/store';
import ShopPage from './routes/ShopPage';

import WatchPage from './routes/WatchPage';
import AdminPage from './routes/AdminPage';
import CreatePage from './routes/CreatePage';

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
  const provide = useProvider();

  const marketplace = useContract({
    address: marketplaceAddress,
    abi: abiMarketplace,
    signerOrProvider: provide
  });

  const certificate = useContract({
    address: certificateAddress,
    abi: abiCertificate,
    signerOrProvider: provide
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiConfig client={client}>
          <ConfigProvider theme={theme}>
            <ResponsiveAppBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route
                path="/shop"
                element={<ShopPage />}
                marketplace={marketplace}
              />
              <Route path="/shop/:id" element={<WatchPage />} />
              <Route
                path="/create"
                element={<CreatePage />}
                marketplace={marketplace}
                certificate={certificate}
              />
              <Route path="/Admin" element={<AdminPage />} />
            </Routes>
          </ConfigProvider>
        </WagmiConfig>
      </PersistGate>
    </Provider>
  );
}

export default App;
