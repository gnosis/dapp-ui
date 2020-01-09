import { MetamaskProvider, Provider, WalletConnectProvider } from '../provider/types'
import { MetamaskSubscriptions, WalletConnectSubscriptions } from '.'

interface GenerateFunctionWithProvider {
    (provider: MetamaskProvider): <T extends Exclude<keyof MetamaskSubscriptions, symbol>>(
        event: string,
    ) => (cb: Parameters<MetamaskSubscriptions[T]>[0], once?: Parameters<MetamaskSubscriptions[T]>[1]) => () => void
    (provider: WalletConnectProvider): <T extends Exclude<keyof WalletConnectSubscriptions, symbol>>(
        event: string,
    ) => (
        cb: Parameters<WalletConnectSubscriptions[T]>[0],
        once?: Parameters<WalletConnectSubscriptions[T]>[1],
    ) => () => void
}

export const generateSubscriptionFunctionForProvider: GenerateFunctionWithProvider = (provider: Provider) => (
    event: string,
) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: (...args: any[]) => void,
    once?: boolean,
) => {
    if (once) {
        provider.once(event, cb)
    } else {
        provider.on(event, cb)
    }

    return () => {
        provider.off(event, cb)
    }
}
