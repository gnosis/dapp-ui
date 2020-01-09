declare module '@walletconnect/web3-provider' {
    interface WalletConnectOptionsCommon {
        bridge?: string
        qrcode?: boolean
        chainId?: number
    }

    interface WalletConnectOptionsInfura extends WalletConnectOptionsCommon {
        infuraId: string
    }

    interface WalletConnectOptionsRPC extends WalletConnectOptionsCommon {
        rpc: {
            [K: number]: string
        }
    }

    export default interface WalletConnectProviderClass {
        new (options: WalletConnectOptionsInfura | WalletConnectOptionsRPC)
    }
}
