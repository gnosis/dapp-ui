import { Block } from 'web3-eth';
import { provider } from 'web3-providers';
import { TransactionReceipt, Transaction } from 'web3-core';
import Web3 from 'web3';
declare global {
    interface Window {
        ethereum: provider & {
            enable: () => Promise<string[]>;
            on?: () => EventListener;
        };
        web3: Web3;
    }
}
interface Web3Api {
    web3: Web3;
    getCurrentAccount: () => Promise<string>;
    getAccounts: () => Promise<string[]>;
    getBalance: (account?: string) => Promise<string>;
    getBlock: (blockNumberOrString: string | number) => Promise<Partial<Block>>;
    getNetwork: () => Promise<number>;
    getNetworkName: (id?: number | string) => Promise<string>;
    getTransaction: (txHash: string) => Promise<Transaction>;
    getTransactionReceipt: (txHash: string) => Promise<TransactionReceipt>;
    isReadOnly: () => boolean;
    resetProvider(): void;
    setProvider(provider: string): void;
}
interface Web3Options {
    customProvider?: provider | string;
    onAccountsChange?: Function;
}
export { Block, provider, TransactionReceipt, Transaction, Web3Api, Web3Options };
//# sourceMappingURL=types.d.ts.map