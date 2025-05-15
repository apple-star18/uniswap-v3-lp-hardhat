'use client';

import { http, createConfig } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const chains = [mainnet, polygon, sepolia] as const;

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected({
      chains,
      options: {
        name: 'MetaMask',
        shimDisconnect: true,
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
