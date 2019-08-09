import WalletConnectProvider from '@walletconnect/web3-provider'
import qr from 'qr-image'

import React, { useState } from 'react'
import Web3 from 'web3'
import { provider } from 'web3-providers'
import DisplayWeb3 from './Test_DisplayWeb3'

import styled from 'styled-components'

const SQRCodeDisplay = styled.div`
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    padding: 20px;
    & svg {
        width: 100%;
    }
`

export interface WalletConnectConnectorOptions {
    bridge?: string
    qrcode?: boolean
    onUri?: (uri: string) => void
    onSessionUpdate?: () => void
    onDisconnect?: () => void
}

const connectToWalletConnect = ({
    bridge = 'https://bridge.walletconnect.org',
    qrcode = false,
    onUri,
    onSessionUpdate,
    onDisconnect,
}: WalletConnectConnectorOptions): Promise<provider> => {
    return new Promise(async resolve => {
        if (!qrcode && !onUri) {
            throw new Error('Must provide onUri callback when qrcode is disabled')
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.log('bridge', bridge)
        console.log('qrcode', qrcode)
        const provider: provider & { wc: any } = new WalletConnectProvider({ bridge, qrcode })
        // return resolve(provider)

        if (!provider.wc.connected) {
            console.log('provider.isConnecting', (provider as any).isConnecting)
            await provider.wc.createSession()
            console.log('WalletConnect::session created')

            if (onUri) {
                onUri(provider.wc.uri)
            }
            console.log('provider.isConnecting', (provider as any).isConnecting)
            // provider.wc.on('connect', (error: Error) => {
            //     if (error) {
            //         console.log('Connect event::error', error.message)

            //         return reject(error)
            //     }

            //     console.log('WalletConnect::session started')
            //     return resolve(provider)
            // })
        }

        provider.wc.on('session_update', async (error: Error, payload: any) => {
            console.log('walletConnector.on("session_update")') // tslint:disable-line
            console.log('payload', payload)

            if (error) {
                console.log('error', error)
                throw error
            }

            onSessionUpdate && onSessionUpdate()

            // const { chainId, accounts } = payload.params[0]
        })
        ;(window as any).wc = provider

        provider.wc.on('connect', (error: Error, payload: any) => {
            console.log('walletConnector.on("connect")') // tslint:disable-line
            console.log('payload', payload)

            if (error) {
                console.log('error', error)
                throw error
            }
            return resolve(provider)
        })

        provider.wc.on('disconnect', (error: Error, payload: any) => {
            console.log('walletConnector.on("disconnect")') // tslint:disable-line
            console.log('payload', payload)

            onDisconnect && onDisconnect()

            if (error) {
                console.log('error', error)
                throw error
            }
        })

        if (provider.wc.connected) {
            console.log('Already connected')
            // const { chainId, accounts } = provider.wc
            console.log('provider.wc', provider.wc)
            // const address = accounts[0]
            return resolve(provider)
        }
    })
}

const WalletConnectConnector: React.FC = () => {
    const [web3, setWeb3] = useState<Web3>()
    const [provider, setProvider] = useState()
    const [uri, setUri] = useState<string>()
    const [update, setUpdate] = useState(true)
    console.log('uri', uri)

    const connectToProv = async (): Promise<void> => {
        try {
            const provider = await connectToWalletConnect({
                qrcode: false, // probably better to pass false and display QRcode ourselves in onUri
                onUri: uri => (console.log('got WalletConnect uri', uri), setUri(uri)),
                onSessionUpdate: () => setUpdate(flag => !flag),
                onDisconnect: () => setWeb3(null),
            })

            console.log(
                'WalletConnect::Connected to',
                typeof provider === 'object' ? provider.constructor.name : provider,
            )

            const web3 = new Web3(provider)
            ;(window as any).web3WC = web3

            setProvider(provider)
            setWeb3(web3)
            setUri('')
        } catch (error) {
            console.warn('error', error)
        }
    }

    const disconnect = (): void => provider && provider.wc.killSession()

    return (
        <>
            <button onClick={connectToProv} disabled={!!web3}>
                Conntect to WalletConnect
            </button>
            <button onClick={disconnect} disabled={!web3}>
                Disconnect from to WalletConnect
            </button>
            {uri && (
                <SQRCodeDisplay dangerouslySetInnerHTML={{ __html: qr.imageSync(uri, { type: 'svg' }) as string }} />
            )}
            {/* shouldn't use key, it's there to quickly remount and refetch */}
            {web3 && <DisplayWeb3 web3={web3} key={+update} />}
        </>
    )
}

export default WalletConnectConnector

// Tentative lib interface
//
// const lib = {
//     getInjectedProvider: () => {
//         provider, name: METAMASK
//     },
//     connectToInjected: async () => {
//         provider
//     },
//     connectToWalletConnect: (options) => {provider, wallectConnector}
// }
