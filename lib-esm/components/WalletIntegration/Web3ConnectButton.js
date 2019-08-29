import React, { useState } from 'react';
import Web3Connect from 'web3connect';
// API
import getWeb3Api from '../../api/web3';
// Components
import DisplayWeb3 from '../DisplayWeb3';
import { SAFE_WALLETCONNECT_BRIDGE } from '../../globals';
const Web3ConnectButton = () => {
    const [web3Api, setWeb3Api] = useState();
    return (React.createElement(React.Fragment, null,
        React.createElement(Web3Connect.Button, { providerOptions: {
                walletconnect: {
                    bridge: SAFE_WALLETCONNECT_BRIDGE,
                },
            }, onConnect: async (provider) => {
                console.log('Web3Connect.Button::Connected to', typeof provider === 'object' ? provider.constructor.name : provider);
                const web3Api = await getWeb3Api({ customProvider: provider }); // add provider to web3Api
                setWeb3Api(web3Api);
            }, onClose: () => {
                console.log('Web3Connect Modal Closed'); // modal has closed
            }, label: web3Api ? 'Change Wallet' : 'Connect' }),
        web3Api && React.createElement(DisplayWeb3, { title: "WEB3CONNECT BUTTON", web3Api: web3Api })));
};
export default Web3ConnectButton;
//# sourceMappingURL=Web3ConnectButton.js.map