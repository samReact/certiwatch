import { useAccount, useContract, useSigner } from 'wagmi';
import { Row, Typography } from 'antd';

import CreateTable from './CreateTable';
import { abi as abiMarketplace } from '../../contractsData/Marketplace.json';
import { abi as abiCertificate } from '../../contractsData/NFTCollection.json';
import { address as certificateAddress } from '../../contractsData/NFTCollection-address.json';
import { address as marketplaceAddress } from '../../contractsData/Marketplace-address.json';

export default function CreatePage() {
  const { data: signer } = useSigner();
  const { address, isDisconnected } = useAccount();

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
