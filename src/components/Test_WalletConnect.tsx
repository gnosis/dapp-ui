import WalletConnectProvider from '@walletconnect/web3-provider'

import React, { useState } from 'react'
import Web3 from 'web3'
import { provider } from 'web3-providers'
import DisplayWeb3 from './Test_DisplayWeb3'

export interface WalletConnectConnectorOptions {
    bridge?: string
    qrcode?: boolean
    onUri?: (uri: string) => void
}

const connectToWalletConnect = (opts: WalletConnectConnectorOptions): Promise<provider> => {
    return new Promise(async (resolve, reject) => {
        let bridge = 'https://bridge.walletconnect.org'
        let qrcode = true
        let onUri: (uti: string) => void | null = null

        if (opts) {
            bridge = opts.bridge || bridge
            qrcode = typeof opts.qrcode !== 'undefined' ? opts.qrcode : qrcode
            onUri = opts.onUri || onUri
        }

        if (!qrcode && !onUri) {
            throw new Error('Must provide onUri callback when qrcode is disabled')
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.log('qrcode', qrcode)
        console.log('bridge', bridge)
        const provider: provider & { wc: any } = new WalletConnectProvider({ bridge, qrcode })

        if (!provider.wc.connected) {
            const ses = await provider.wc.createSession()
            console.log('WalletConnect::session created', ses)

            if (onUri) {
                onUri(provider.wc.uri)
            }
        } else {
            console.log('WalletConnect::Already in active session')
            return resolve(provider)
        }

        provider.wc.on('connect', (error: Error) => {
            if (error) {
                console.log('Connect event::error', error.message)

                return reject(error)
            }

            console.log('WalletConnect::session started')
            return resolve(provider)
        })
    })
}

const WalletConnectConnector: React.FC = () => {
    const [web3, setWeb3] = useState<Web3>()

    const connectToProv = async (): Promise<void> => {
        try {
            const provider = await connectToWalletConnect({
                qrcode: true, // probably better to pass false and display QRcode ourselves in onUri
                onUri: uri => console.log('got WalletConnect uri', uri),
            })

            console.log(
                'WalletConnect::Connected to',
                typeof provider === 'object' ? provider.constructor.name : provider,
            )

            const web3 = new Web3(provider)
            setWeb3(web3)
        } catch (error) {
            console.warn('error', error)
        }
    }

    return (
        <>
            <button onClick={connectToProv} disabled={!!web3}>
                Conntect to WalletConnect
            </button>
            {web3 && <DisplayWeb3 web3={web3} />}
        </>
    )
}

export default WalletConnectConnector
