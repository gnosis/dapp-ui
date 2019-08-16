import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { Web3FrontendAPI } from '../api/web3'

interface DisplayWeb3Props {
    web3FrontendAPI: Web3FrontendAPI
}

interface ClientVersion {
    id?: number
    jsonrpc?: string
    result: string
}

export const DisplayWeb3: React.FC<DisplayWeb3Props> = ({ web3FrontendAPI }) => {
    const [account, setAccount] = useState<string>()

    const [balance, setBalance] = useState<string>()

    const [networkName, setNetworkName] = useState<string>()

    const [clientVersion, setClientVersion] = useState<ClientVersion>()

    useEffect(() => {
        const setter = async (): Promise<void> => {
            const accountsProm = web3FrontendAPI.getAccounts()
            const networkNameProm = web3FrontendAPI.getNetworkName()
            const clientVersionProm = web3FrontendAPI.web3.currentProvider.send('web3_clientVersion', [])

            const [account] = await accountsProm

            const [balance, networkName, clientVersion] = await Promise.all([
                web3FrontendAPI.getBalance(account),
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
    }, [web3FrontendAPI])

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
