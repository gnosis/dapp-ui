import React from 'react'

import Web3Connector from './Web3ConnectButton'
import Web3ConnectorManual from './Test_Web3Connect_man'
import Web3ProviderConnector from './Test_Web3Provider'
import WalletConnector from './Test_WalletConnect'
import WalletConnectorImg from './Test_WalletConnectImg'

const Web3Comp: React.FC = () => {
    return (
        <div>
            <div>
                <h2>web3connect component</h2>
                <Web3Connector />
                {/* This one interferes with Web3ConnectorManual */}
            </div>
            <div>
                <h2>web3connect manual</h2>
                <Web3ConnectorManual />
            </div>
            <div>
                <h2>web3 provider default</h2>
                <Web3ProviderConnector />
            </div>
            <div>
                <h2>web3 injected providers</h2>
            </div>
            <div>
                <h2>WalletConnect</h2>
                <WalletConnector />
            </div>
            <div>
                <h2>WalletConnectImg</h2>
                <WalletConnectorImg />
            </div>
        </div>
    )
}

export default Web3Comp
