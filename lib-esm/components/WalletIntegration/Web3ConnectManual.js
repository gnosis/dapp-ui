import React, { useState, useEffect } from 'react';
import Web3Connect from 'web3connect';
// Components
import Button from '../Button';
import DisplayWeb3 from '../DisplayWeb3';
// API
import getWeb3Api from '../../api/web3';
import { SAFE_WALLETCONNECT_BRIDGE } from '../../globals';
const web3Connect = new Web3Connect.Core({
    providerOptions: {
        walletconnect: {
            bridge: SAFE_WALLETCONNECT_BRIDGE,
        },
    },
});
// subscribe to close
web3Connect.on('close', () => {
    console.log('Web3Connect Modal Closed'); // modal has closed
});
const ManualConnector = () => {
    const [web3, setWeb3] = useState();
    useEffect(() => {
        web3Connect.on('connect', async (provider) => {
            try {
                console.log('Web3Connect.Core::Connected to', typeof provider === 'object' ? provider.constructor.name : provider);
                const web3 = await getWeb3Api({ customProvider: provider }); // add provider to web3Api
                setWeb3(web3);
            }
            catch (error) {
                console.error(error);
            }
        });
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { onClick: () => web3Connect.toggleModal(), secondary: true }, "Open web3connect Modal"),
        web3 && React.createElement(DisplayWeb3, { title: "WEB3CONNECT MANUAL", web3Api: web3 })));
};
export default ManualConnector;
//# sourceMappingURL=Web3ConnectManual.js.map