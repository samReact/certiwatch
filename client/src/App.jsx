import { ConfigProvider } from 'antd';
import { Route, Routes } from 'react-router-dom';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { magenta } from '@ant-design/colors';

import ResponsiveAppBar from './AppBar';
import HomePage from './routes/HomePage';
import './index.css';
import SellPage from './routes/SellPage';
import { store } from './state/store';
import { Provider } from 'react-redux';

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
    colorPrimary: magenta[5]
  },
  components: {}
};

function App() {
  return (
    <Provider store={store}>
      <WagmiConfig client={client}>
        <ConfigProvider theme={theme}>
          <ResponsiveAppBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sell" element={<SellPage />} />
          </Routes>
        </ConfigProvider>
      </WagmiConfig>
    </Provider>
  );
}

export default App;
