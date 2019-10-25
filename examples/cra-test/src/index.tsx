import React from 'react'
import ReactDOM from 'react-dom'

import ConnectButton from './components/ConnectButton'

const Hello: React.FC = () => {
    return (
        <div>
            <ConnectButton />
        </div>
    )
}


ReactDOM.render(<Hello />, document.getElementById('root'));
