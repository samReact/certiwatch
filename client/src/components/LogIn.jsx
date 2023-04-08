import { Button } from 'antd';
import { useAccount, useConnect } from 'wagmi';

import { ConnectedButton } from './ConnectedButton';

export function LogIn() {
  const { connect, connectors, isLoading } = useConnect();
  const { isDisconnected } = useAccount();

  return (
    <>
      {isDisconnected || isLoading ? (
        connectors.map((connector) => (
          <Button
            loading={isLoading}
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
