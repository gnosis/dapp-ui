import React from 'react'
import {
    WalletConnectInits,
} from '@gnosis.pm/dapp-ui'
import WalletConnectProvider from "@walletconnect/web3-provider";

import {useProvider, useWeb3} from '../hooks'


import Button from './Button'
import DisplayWeb3 from './DisplayWeb3'
import DisplayProvider from './DisplayProvider'

const wcOptions: WalletConnectInits = {
    package: WalletConnectProvider,
    options: {
        infuraId: '8b4d9b4306294d2e92e0775ff1075066'
    }

}

const ConnectWallet: React.FC = () => {

    const {connectToProvider, disconnectFromProvider, provider, error} = useProvider(wcOptions)

    const web3 = useWeb3(provider)

    console.log('web3', !!web3);

    (window as any).provider = provider;
    (window as any).web3 = web3;

    return (
        <>
            <Button onClick={connectToProvider}>
                Open web3connect Modal
            </Button>
            {provider && <Button onClick={disconnectFromProvider} secondary>
                Disconnect
            </Button>}
            {provider && <DisplayProvider title="Provider data" provider={provider} />}
            <hr/>
            {web3 && provider && <DisplayWeb3 title="Web3 data" web3={web3} provider={provider} />}
            {error && <pre>Error: {error.message}</pre>}
        </>
    )
}

export default ConnectWallet
