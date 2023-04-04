import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Spin, Result } from 'antd';

import { useEffect, useState } from 'react';
import {
  useAccount,
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useSigner
} from 'wagmi';
import { ethers } from 'ethers';
import { addNotification } from '../state/notificationSlice';
import WatchDetails from '../WatchDetails';
import { useCallback } from 'react';
import { fromWei, removeIpfs } from '../utils';

export default function WatchPage() {
  const [watch, setWatch] = useState();
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    marketplaceAbi,
    marketplaceAddress,
    nftCollectionAbi,
    nftCollectionAddress
  } = useSelector((state) => state.eth);

  const { address } = useAccount();
  const { data: signer } = useSigner();

  const { config } = usePrepareContractWrite({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'buyItem',
    enabled: Boolean(watch),
    args: [watch && parseInt(watch.itemId)],
    overrides: {
      value: watch && ethers.utils.parseEther(watch.totalPrice)
    }
  });
  const { write, isLoading, isSuccess } = useContractWrite(config);

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

  const isSeller = address && watch && address === watch.seller;

  async function handleBuy() {
    try {
      write();
    } catch (error) {
      dispatch(
        addNotification({
          message: 'Error',
          description: error.message,
          type: 'error'
        })
      );
    }
  }
  const loadMarketPlaceItems = useCallback(async () => {
    let item = await marketplace.items(id);
    if (item.status === 3) {
      try {
        const uri = await certificate.tokenURI(item.tokenId);
        const res = await fetch(uri);
        const metada = await res.json();
        let imagesUri = metada.attributes.filter((attr) => attr.images)[0];
        const finalUri = `https://ipfs.io/ipfs/${removeIpfs(imagesUri.value)}`;
        const res2 = await fetch(finalUri);
        const imagesMeta = await res2.json();
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        let watch = {
          totalPrice: fromWei(totalPrice),
          itemId: parseInt(item.itemId),
          seller: item.seller,
          tokenId: parseInt(item.tokenId),
          certificateUrl: metada.image,
          images: imagesMeta.images,
          model: item.model,
          brand: item.brand,
          attributes: metada.attributes,
          description: item.description
        };
        setWatch(watch);
      } catch (error) {
        dispatch(
          addNotification({
            message: 'Error',
            description: error.message,
            type: 'error'
          })
        );
      }
    }
  }, [marketplace, certificate, id, dispatch]);

  useEffect(() => {
    if (marketplace.signer) {
      loadMarketPlaceItems();
    }
  }, [marketplace.signer, loadMarketPlaceItems]);

  function handleClick() {
    navigate('/');
  }

  return (
    <div className="container">
      {isSuccess ? (
        <Result
          status="success"
          title="Successfully Purchased !"
          subTitle="Order number: 2017182818828182881 blockchain synchronization takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="console" onClick={handleClick}>
              Go Home
            </Button>
          ]}
        />
      ) : watch ? (
        <WatchDetails
          write={write}
          isSeller={isSeller}
          handleBuy={handleBuy}
          isLoading={isLoading}
          watch={watch}
        />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}
