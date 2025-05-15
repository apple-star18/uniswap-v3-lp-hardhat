'use client';

import React from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';

export default function AccountInfo() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address
  });
  const chain = useChainId;

  if (!isConnected) return <div>Please connect your wallet.</div>;

  return (
    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <p><strong>Address:</strong> {address}</p>
      <p>
        <strong>Balance:</strong>{' '}
        {balanceLoading ? 'Loading...' : `${balance?.formatted} ${balance?.symbol}`}
      </p>
      <p><strong>Network:</strong> {chain?.name}</p>
    </div>
  );
}
