import { useAccount, useContract, useSigner } from 'wagmi';
import { Row, Typography } from 'antd';

import CreateTable from '../components/CreateTable';
import { useSelector } from 'react-redux';

export default function CreatePage() {
  const { data: signer } = useSigner();
  const { address, isDisconnected } = useAccount();

  const {
    marketplaceAbi,
    marketplaceAddress,
    nftCollectionAddress,
    nftCollectionAbi
  } = useSelector((state) => state.eth);

  const marketplace = useContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    signerOrProvider: signer
  });

  const certificate = useContract({
    address: nftCollectionAddress,
    abi: nftCollectionAbi,
    signerOrProvider: signer
  });

  return (
    <div className="container">
      {isDisconnected ? (
        <Row justify={'center'}>
          <Typography>
            To have access to this functionality you must be connected{' '}
          </Typography>
        </Row>
      ) : (
        <CreateTable
          marketplace={marketplace}
          certificate={certificate}
          address={address}
        />
      )}
    </div>
  );
}
