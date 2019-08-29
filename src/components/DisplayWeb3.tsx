import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { Web3Api } from '../types'

interface DisplayWeb3Props {
    web3Api: Web3Api
    title?: string
}

interface ClientVersion {
    id?: number
    jsonrpc?: string
    result: string
}

export const DisplayWeb3: React.FC<DisplayWeb3Props> = ({ web3Api }) => {
    const [account, setAccount] = useState<string>()

    const [balance, setBalance] = useState<string>()

    const [networkName, setNetworkName] = useState<string>()

    const [clientVersion, setClientVersion] = useState<ClientVersion>()

    useEffect(() => {
        const setter = async (): Promise<void> => {
            const accountsProm = web3Api.getAccounts()
            const networkNameProm = web3Api.getNetworkName()
            const clientVersionProm = web3Api.web3.currentProvider.send('web3_clientVersion', [])

            const [account] = await accountsProm

            const [balance, networkName, clientVersion] = await Promise.all([
                web3Api.getBalance(account),
                networkNameProm,
                clientVersionProm,
            ])

            ReactDOM.unstable_batchedUpdates(() => {
                setAccount(account)
                setBalance(balance)
                setNetworkName(networkName)
                setClientVersion(clientVersion)
            })
        }

        setter()
    }, [web3Api])

    return (
        <div>
            <div>Account: {account}</div>
            <div>Balance: {+balance / 1e18} ETH</div>
            <div>Network: {networkName && networkName.toUpperCase()}</div>
            <pre>
                Client Version:
                {JSON.stringify(clientVersion, null, 2)}
            </pre>
        </div>
    )
}

export default DisplayWeb3
