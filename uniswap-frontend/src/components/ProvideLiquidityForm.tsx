'use client';

import React, { useState } from "react";
import { useAccount }  from 'wagmi';
import { ethers } from 'ethers';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useProvideLiquidity } from "@/app/hooks/useProvideLiquidity";
import { Providers } from '@/providers/providers';

export default function ProvideLiquidityForm() {
    const { isConnected } = useAccount();

    const [poolAddress, setPoolAddress] = useState('');
    const [amount0, setAmount0] = useState('');
    const [amount1, setAmount1] = useState('');
    const [widthBps, setWidthBps] = useState('1000');

    const { provideLiquidity, isLoading, isSuccess, error } = useProvideLiquidity();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!provideLiquidity) return;

        try {
            const tx = await provideLiquidity([
                poolAddress,
                BigInt(ethers.parseUnits(amount0, 18).toString()),
                BigInt(ethers.parseUnits(amount1, 18).toString()),
                Number(widthBps),
            ]);
            console.log('Transaction sent:', tx.hash);
        } catch(err) {
            console.error(err);
        }
    };

    if (!isConnected) return;

    return (
        <form onSubmit={handleSubmit} style={{
            maxWidth: 480,
            margin: '2rem auto',
            padding: '2rem',
            border: '1px solid #ccc',
            borderRadius: '12px',
            backgroundColor: '#1a1b1f',
            fontFamily: 'Arial, sans-serif'
            }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Provide Liquidity</h2>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Pool Address:
                </label>
                <input
                    type="text"
                    value={poolAddress}
                    onChange={e => setPoolAddress(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Amount Token0:
                </label>
                <input
                    type="number"
                    step="any"
                    value={amount0}
                    onChange={e => setAmount0(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Amount Token1:
                </label>
                <input
                    type="number"
                    step="any"
                    value={amount1}
                    onChange={e => setAmount1(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Width (bps):
                </label>
                <input
                    type="number"
                    min={1}
                    max={10000}
                    value={widthBps}
                    onChange={e => setWidthBps(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: isLoading ? '#ccc' : '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                }}
            >
                {isLoading ? 'Providing...' : 'Provide Liquidity'}
            </button>

            {isSuccess && (
                <p style={{ marginTop: '1rem', color: 'green', textAlign: 'center' }}>
                    ✅ Liquidity provided successfully!
                </p>
            )}
            {error && (
                <p style={{ marginTop: '1rem', color: 'red', textAlign: 'center' }}>
                    ❌ Error: {error.message}
                </p>
            )}
        </form>

    );
}