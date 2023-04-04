import { useEffect, useCallback, useState } from 'react';
import { Card, List, Typography } from 'antd';
import { ethers } from 'ethers';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';
import { useContract, useSigner } from 'wagmi';
import ProgressiveImage from 'react-progressive-graceful-image';

import { removeIpfs } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../state/notificationSlice';
import placeholder from '../assets/placeholder.png';

export default function ShopPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    marketplaceAbi,
    marketplaceAddress,
    nftCollectionAbi,
    nftCollectionAddress
  } = useSelector((state) => state.eth);

  const dispatch = useDispatch();

  const { data: signer } = useSigner();

  const marketplace = useContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    signerOrProvider: signer,
    watch: true
  });

  const certificate = useContract({
    address: nftCollectionAddress,
    abi: nftCollectionAbi,
    signerOrProvider: signer
  });

  const navigate = useNavigate();

  const loadMarketPlaceItems = useCallback(async () => {
    setLoading(true);
    const itemCount = await marketplace.itemCount();
    let items = [];
    if (parseInt(itemCount) === 0) {
      return setLoading(false);
    }

    for (let i = 1; i <= itemCount; i++) {
      try {
        let item = await marketplace.items(i);
        if (item.status === 3) {
          const uri = await certificate.tokenURI(item.tokenId);
          const res = await fetch(uri);
          const metada = await res.json();
          let imagesUri = metada.attributes.filter((attr) => attr.images)[0];
          const finalUri = `https://ipfs.io/ipfs/${removeIpfs(
            imagesUri.value
          )}`;
          const res2 = await fetch(finalUri);
          const imagesMeta = await res2.json();
          const totalPrice = await marketplace.getTotalPrice(item.itemId);

          setItems([...items]);
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
      } catch (error) {
        dispatch(
          addNotification({
            message: 'Error',
            description: error.message,
            type: 'error'
          })
        );
        setLoading(false);
      }
    }
    setItems(items);
    setLoading(false);
  }, [marketplace, certificate, dispatch]);

  useEffect(() => {
    if (marketplace.signer) {
      loadMarketPlaceItems();
    }
  }, [marketplace.signer, loadMarketPlaceItems]);

  return (
    <div className="container">
      <div className="container-content">
        <List
          loading={loading}
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
                onClick={() => navigate(`/shop/${item.itemId}`)}
                hoverable
                style={{ width: 300 }}
                cover={
                  <ProgressiveImage
                    src={`https://gateway.pinata.cloud/ipfs/${removeIpfs(
                      item.images[0]
                    )}`}
                    placeholder={placeholder}
                  >
                    {(src) => {
                      return <img src={src} alt="" />;
                    }}
                  </ProgressiveImage>
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
      </div>
    </div>
  );
}
