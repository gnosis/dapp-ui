import React, { useState, useEffect, ChangeEvent } from 'react'
import ReactDOM from 'react-dom'

import Button from './Button'

import { toWei } from '../utils'

import { Web3Api, TransactionReceipt } from '../types'

interface DisplayWeb3Props {
    title: string
    web3Api: Web3Api
}

interface ClientVersion {
    id?: number
    jsonrpc?: string
    result: string
}

const DEFAULT_RECIPIENT = '0x286E20d6e20d12D5Ba06F8eC2dAe91B7725f9188'

export const DisplayWeb3: React.FC<DisplayWeb3Props> = ({ title = 'Web3 Data', web3Api }) => {
    // User State
    const [account, setAccount] = useState<string>()
    const [balance, setBalance] = useState<string>()
    const [networkName, setNetworkName] = useState<string>()
    const [clientVersion, setClientVersion] = useState<ClientVersion>()
    // Send
    const [amountToSend, setAmountToSend] = useState<string>('0')
    const [recipientAddress, setRecipientAddress] = useState<string>(null)
    // Async
    const [error, setError] = useState<Error>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const setter = async (): Promise<void> => {
            try {
                setError(null)
                setLoading(true)

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
            } catch (error) {
                console.error(error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        setter()
    }, [web3Api])

    const handleSendTransaction = async (): Promise<TransactionReceipt | void> => {
        try {
            // setError(null)
            setLoading(true)
            const txReceipt = await web3Api.web3.eth.sendTransaction({
                from: account,
                to: recipientAddress || DEFAULT_RECIPIENT,
                value: toWei(amountToSend),
            })
            console.log('TX Receipt: ', txReceipt)

            return txReceipt
        } catch (error) {
            console.error(error)
            throw error
            // setError(error.message || error)
        } finally {
            // setError(null)
            setLoading(false)
        }
    }
    if (error) return <pre>ERROR! {JSON.stringify(error, null, 2)}</pre>

    return (
        <div>
            <h1>{title}</h1>
            {/* Web3 Data */}
            <div>Account: {showData(account, loading)}</div>
            <div>Balance: {showData(`${+balance / 1e18} ETH`, loading)}</div>
            <div>Network: {showData(networkName && networkName.toUpperCase(), loading)}</div>
            <pre>
                Client Version:
                {showData(JSON.stringify(clientVersion, null, 2), loading)}
            </pre>
            {/* Send Tx */}
            <div>
                <h3>Test transaction - Rinkeby only</h3>
                <pre>Sending: {amountToSend || '0'} ETH</pre>
                <input type="number" onChange={(e: ChangeEvent<HTMLInputElement>) => setAmountToSend(e.target.value)} />
                <pre>Recipient Address: {recipientAddress || DEFAULT_RECIPIENT}</pre>
                <input
                    type="text"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRecipientAddress(e.target.value)}
                />
                <Button disabled={+amountToSend <= 0 || loading} onClick={handleSendTransaction}>
                    {loading ? '...' : 'Send TX'}
                </Button>
            </div>
        </div>
    )
}

function showData(data: string | number, loading: boolean, loadMsg: string = 'Loading...'): string | number {
    return loading ? loadMsg : data
}

export default DisplayWeb3
