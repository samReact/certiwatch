import { useAccount, useConnect } from 'wagmi';

export function ConnectButton() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {isDisconnected ? 'Log in' : address}
        </button>
      ))}
    </div>
  );
}
