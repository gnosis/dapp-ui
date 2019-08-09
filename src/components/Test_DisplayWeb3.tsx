import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'

interface DisplayWeb3Props {
    web3: Web3
}

interface ClientVersion {
    id?: number
    jsonrpc?: string
    result: string
}

export const DisplayWeb3: React.FC<DisplayWeb3Props> = ({ web3 }) => {
    const [account, setAccount] = useState<string>()

    const [balance, setBalance] = useState<string>()

    const [networkId, setNetworkId] = useState<number>()

    const [clientVersion, setClientVersion] = useState<ClientVersion>()

    useEffect(() => {
        const setter = async (): Promise<void> => {
            const accountsProm = web3.eth.getAccounts()
            const idProm = web3.eth.net.getId()
            const clientVersionProm = web3.currentProvider.send('web3_clientVersion', [])

            const [account] = await accountsProm

            const [balance, networkId, clientVersion] = await Promise.all([
                web3.eth.getBalance(account),
                idProm,
                clientVersionProm,
            ])

            ReactDOM.unstable_batchedUpdates(() => {
                setAccount(account)
                setBalance(balance)
                setNetworkId(networkId)
                setClientVersion(clientVersion)
            })
        }

        setter()
    }, [web3])

    return (
        <div>
            <div>Account {account}</div>
            <div>Balance {+balance / 1e18} ETH</div>
            <div>Network ID {networkId}</div>
            <pre>
                Client Version:
                {JSON.stringify(clientVersion, null, 2)}
            </pre>
        </div>
    )
}

export default DisplayWeb3
