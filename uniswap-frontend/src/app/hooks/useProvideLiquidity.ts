import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import POSITION_MANAGER_ABI from '../abi/ProvideLiquidity.json';
import { POSITION_MANAGER_ADDRESS } from '../abi/contracts';
import { useState } from "react";
import { initScriptLoader } from "next/script";

export function useProvideLiquidity() {
    const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

    const { writeContractAsync, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
        query: {
            enabled: !!txHash,
        },
    });

    const provideLiquidity = async (args: [string, bigint, bigint, number]) => {
        try {
            const hash = await writeContractAsync({
                address: POSITION_MANAGER_ADDRESS,
                abi: POSITION_MANAGER_ABI,
                functionName: 'provideLiquidity',
                args,
            });
            setTxHash(hash);
        } catch (err) {
            console.error('Contract call failed', err);
            throw err;
        }
    };

    return {
        provideLiquidity,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
    };
}