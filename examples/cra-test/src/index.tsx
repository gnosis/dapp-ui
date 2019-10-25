import React from 'react'
import ReactDOM from 'react-dom'

import ConnectButton from './components/ConnectButton'

const App: React.FC = () => {
    return (
        <div>
            <ConnectButton />
        </div>
    )
}


ReactDOM.render(<App />, document.getElementById('root'));
