'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { chains, wagmiConfig } from '@/lib/wagmi';
import AccountInfo from '@/components/AccountInfo';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
     <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider coolMode theme={darkTheme()} chains={chains}>
          <AccountInfo />
          {children}
        </RainbowKitProvider>
        </WagmiConfig>
    </QueryClientProvider>
  );
}
