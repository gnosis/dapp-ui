import React, { useEffect, useState } from 'react'
import {
    Provider,
    getProviderState,
    createSubscriptions,
    Subscriptions
} from '@gnosis.pm/dapp-ui'
import { useCurrentAccount, useNetwork, useIfMounted } from '../hooks'

interface DisplayProviderProps {
    provider: Provider
    title?: string
}

const logSubscriptions = (subs: Subscriptions) => Object.entries<(cb: Function) =>
    () => void>(subs as { [s: string]: any }).map(([key, sub]) => {
        const unsub = sub((...args: any) => {
            console.log(`${key} subscription:`, ...args)
        })

        return () => {
            console.log(`unsubbing from ${key}`)
            unsub()
        }
    });

const useAllAvailableSubscriptions = (provider: Provider) => {
    
    useEffect(() => {
        if (!provider) return
        const subscriptions = createSubscriptions(provider)

        const unsubs = logSubscriptions(subscriptions)

        return () => unsubs.forEach(unsub => unsub())
    }, [provider])
}

interface ClientVersion {
    id?: number
    jsonrpc?: string
    result: string
}

export const DisplayProvider: React.FC<DisplayProviderProps> = ({ provider, title }) => {
    const account = useCurrentAccount(provider)
    const network = useNetwork(provider)

    const providerState = getProviderState(provider)

    useAllAvailableSubscriptions(provider)

    const [clientVersion, setClientVersion] = useState<ClientVersion>()

    const ifMounted = useIfMounted()

    useEffect(() => {
        provider.send({
            method: 'web3_clientVersion',
        }, (e, clientVersion) => ifMounted(() => setClientVersion(clientVersion)))
    })

    return (
        <div>
            {title && <h5>{title}</h5>}
            <div>Account: {account}</div>
            <div>Network: {network}</div>
            <pre>
                Client Version:
                {JSON.stringify(clientVersion, null, 2)}
            </pre>
            <pre>
                Provider State:
                {JSON.stringify(providerState, null, 2)}
            </pre>
        </div>
    )
}

export default DisplayProvider
