import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import { Web3ConnectButton, Web3ConnectManual } from '@gnosis.pm/dapp-ui'

// const Hello: React.FC = () => {
//     const [state] = useState<string>('STRING')

//     return (
//         <div>
//             <h1>Connecting options:</h1>
//             <Comp />
//             {state}
//         </div>
//     )
// }

const Hello: React.FC = () => {
    const [walletConnectType, setWalletConnectType] = useState<string>('')

    return (
        <div>
            <h1>Connecting options:</h1>
            <select
                id="wallet-type"
                onChange={(e) => setWalletConnectType(e.target.value)}
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


ReactDOM.render(<Hello />, document.getElementById('root'));
