import { Button } from 'antd';
import { useAccount, useConnect } from 'wagmi';

import { ConnectedButton } from './ConnectedButton';

export function LogIn() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address, isConnecting, isDisconnected } = useAccount();

  if (isLoading || isConnecting) {
    return;
  }

  return (
    <>
      {isDisconnected ? (
        connectors.map((connector) => (
          <Button
            type="primary"
            value={'small'}
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            Log in
          </Button>
        ))
      ) : (
        <ConnectedButton />
      )}
    </>
  );
}
