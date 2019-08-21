import React, { ChangeEvent, useState } from '../../../node_modules/react'
import ReactDOM from '../../../node_modules/react-dom'

import { Web3ConnectButton, Web3ConnectManual } from '../../../src'

const Hello: React.FC = () => {
    const [walletConnectType, setWalletConnectType] = useState<string>(null)

    return (
        <div>
            <h1>Connecting options:</h1>
            <select
                id="wallet-type"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setWalletConnectType(e.target.value)}
            >
                <option value="">--Select Wallet Connect Type--</option>
                <option value="MANUAL">Manual</option>
                <option value="BUTTON">Button</option>
            </select>
            {walletConnectType === 'BUTTON' ? (
                <Web3ConnectButton />
            ) : walletConnectType === 'MANUAL' ? (
                <Web3ConnectManual />
            ) : null}
        </div>
    )
}

var mountNode = document.getElementById('app')
ReactDOM.render(<Hello />, mountNode)
