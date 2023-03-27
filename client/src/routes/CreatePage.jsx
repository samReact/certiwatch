import { useContract, useSigner } from 'wagmi';

import CreateTable from './CreateTable';
import { abi as abiMarketplace } from '../../contractsData/Marketplace.json';
import { abi as abiCertificate } from '../../contractsData/Certificate.json';
import { address as certificateAddress } from '../../contractsData/Certificate-address.json';
import { address as marketplaceAddress } from '../../contractsData/Marketplace-address.json';

export default function CreatePage() {
  const { data: signer } = useSigner();

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
      <CreateTable marketplace={marketplace} certificate={certificate} />
    </div>
  );
}
