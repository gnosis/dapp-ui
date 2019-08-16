declare module '@walletconnect/web3-provider'

declare global {
    interface Window {
        ethereum: provider & {
            enable: () => Promise<string[]>
            on?: () => EventListener
        }
        web3: Web3
    }
}
