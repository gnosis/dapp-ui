import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'

import {
    Provider,
} from '@gnosis.pm/dapp-ui'
import { useAccountBalance, useCurrentAccount, useNetwork, useCurrentBlock, useIfMounted } from '../hooks'

interface DisplayWeb3Props {
    web3: Web3
    provider: Provider
    title?: string
}

export const DisplayWeb3: React.FC<DisplayWeb3Props> = ({ web3, provider, title }) => {
    const [networkName, setNetworkName] = useState<number>()

    const network = useNetwork(provider)

    const ifMounted = useIfMounted()

    useEffect(() => {
        if (!web3) return
        const setter = async (): Promise<void> => {
            const networkName = await web3.eth.net.getId()

            ifMounted(() => {
                ReactDOM.unstable_batchedUpdates(() => {
                    setNetworkName(networkName)
                })
            })

        }

        setter()
    }, [web3, network, ifMounted])

    const account = useCurrentAccount(provider)

    const balance = useAccountBalance({account, web3})

    const block = useCurrentBlock({provider, web3})

    return (
        <div>
            {title && <h5>{title}</h5>}
            <div>Account: {account}</div>
            <div>Balance: {+balance / 1e18} ETH</div>
            <div>Network from Web3: {networkName && networkName}</div>
            <pre>
                Latest Block:
                {JSON.stringify(block, null, 2)}
            </pre>
        </div>
    )
}

export default DisplayWeb3
