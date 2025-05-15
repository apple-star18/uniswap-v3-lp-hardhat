'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import ProvideLiquidityForm from "@/components/ProvideLiquidityForm";

export default function Home() {
  return (
    <main style={{ padding: '2rem'}}>
      <h1>My Web3 DApp</h1>
      <ProvideLiquidityForm/>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ConnectButton />
      </div>
    </main>
  );
}