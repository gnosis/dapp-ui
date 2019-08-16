import React from '../../../node_modules/react'
import ReactDOM from '../../../node_modules/react-dom'

import { Web3ConnectButton } from '../../../src'

const Hello: React.FC = () => (
    <div>
        <h1>Hello World!</h1>
        <h2>Connect wallet</h2>
        <Web3ConnectButton />
    </div>
)

var mountNode = document.getElementById('app')
ReactDOM.render(<Hello />, mountNode)
