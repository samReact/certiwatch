import { useEffect, useCallback } from 'react';
import { Card, List, Row, Typography } from 'antd';
import { ethers } from 'ethers';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';
import { useContract, useSigner } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';

import { initFull } from '../state/watchesSlice';
import { abi as abiMarketplace } from '../../contractsData/Marketplace.json';
import { abi as abiCertificate } from '../../contractsData/NFTCollection.json';
import { address as certificateAddress } from '../../contractsData/NFTCollection-address.json';
import { address as marketplaceAddress } from '../../contractsData/Marketplace-address.json';

export default function ShopPage() {
  const watches = useSelector((state) => state.watches.watches);
  const fullWatches = useSelector((state) => state.watches.fullWatches);

  const { data: signer } = useSigner();
  const dispatch = useDispatch();

  const marketplace = useContract({
    address: marketplaceAddress,
    abi: abiMarketplace,
    signerOrProvider: signer
  });

  const certificate = useContract({
    address: certificateAddress,
    abi: abiCertificate,
    signerOrProvider: signer
  });

  const navigate = useNavigate();

  const loadMarketPlaceItems = useCallback(async () => {
    const itemCount = await marketplace.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      let item = await marketplace.items(i);
      const uri = await certificate.tokenURI(item.tokenId);
      const res = await fetch(uri);
      const metada = await res.json();
      const totalPrice = await marketplace.getTotalPrice(item.itemId);
      const filtered = watches.filter(
        (watch) => watch.tokenId === parseInt(item.tokenId)
      )[0];

      items.push({
        ...filtered,
        totalPrice: ethers.utils.formatEther(totalPrice),
        image: metada.image,
        itemId: parseInt(item.itemId),
        seller: item.seller,
        tokenId: parseInt(item.tokenId)
      });
    }
    dispatch(initFull(items));
  }, [marketplace]);

  useEffect(() => {
    if (marketplace.signer) {
      loadMarketPlaceItems();
    }
  }, [marketplace]);

  return (
    <div className="container">
      <div className="container-content">
        {fullWatches.length ? (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 4
            }}
            dataSource={fullWatches}
            renderItem={(item) => (
              <List.Item>
                <Card
                  onClick={() => navigate(`/shop/${item.id}`)}
                  hoverable
                  style={{ width: 300 }}
                  cover={<img alt="example" src={item.photos[0]} />}
                >
                  <Typography.Text strong>{item.model}</Typography.Text>
                  <Meta
                    title={`${item.totalPrice} ETH`}
                    description={item.brand}
                  />
                  <p>{item.description}</p>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Row justify={'center'}>
            <Typography>No items to buy</Typography>
          </Row>
        )}
      </div>
    </div>
  );
}
