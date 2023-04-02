import { useEffect, useCallback, useState } from 'react';
import { Card, List, Row, Typography } from 'antd';
import { ethers } from 'ethers';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';
import { useContract, useSigner } from 'wagmi';

import { abi as abiMarketplace } from '../../contractsData/Marketplace.json';
import { abi as abiCertificate } from '../../contractsData/NFTCollection.json';
import { address as certificateAddress } from '../../contractsData/NFTCollection-address.json';
import { address as marketplaceAddress } from '../../contractsData/Marketplace-address.json';
import { removeIpfs } from '../utils';

export default function ShopPage() {
  const [items, setItems] = useState([]);

  const { data: signer } = useSigner();

  const marketplace = useContract({
    address: marketplaceAddress,
    abi: abiMarketplace,
    signerOrProvider: signer,
    watch: true
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
      if (item.status === 3) {
        const uri = await certificate.tokenURI(item.tokenId);
        const res = await fetch(uri);
        const metada = await res.json();
        let imagesUri = metada.attributes.filter((attr) => attr.images)[0];

        const finalUri = `https://ipfs.io/ipfs/${removeIpfs(imagesUri.value)}`;
        const res2 = await fetch(finalUri);
        const imagesMeta = await res2.json();
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        items.push({
          totalPrice: ethers.utils.formatEther(totalPrice),
          itemId: parseInt(item.itemId),
          seller: item.seller,
          tokenId: parseInt(item.tokenId),
          certificateUrl: metada.image,
          images: imagesMeta.images,
          model: item.model,
          brand: item.brand
        });
      }
    }
    setItems(items);
  }, [marketplace, certificate]);

  useEffect(() => {
    if (marketplace.signer) {
      loadMarketPlaceItems();
    }
  }, [marketplace.signer, loadMarketPlaceItems]);

  return (
    <div className="container">
      <div className="container-content">
        {items.length ? (
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
            dataSource={items}
            renderItem={(item) => (
              <List.Item>
                <Card
                  onClick={() => navigate(`/shop/${item.tokenId}`)}
                  hoverable
                  style={{ width: 300 }}
                  cover={
                    <img
                      alt="example"
                      src={`https://gateway.pinata.cloud/ipfs/${removeIpfs(
                        item.images[0]
                      )}`}
                      loading="lazy"
                    />
                  }
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
