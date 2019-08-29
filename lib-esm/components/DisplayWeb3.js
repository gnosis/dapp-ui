import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
export const DisplayWeb3 = ({ web3Api }) => {
    const [account, setAccount] = useState();
    const [balance, setBalance] = useState();
    const [networkName, setNetworkName] = useState();
    const [clientVersion, setClientVersion] = useState();
    useEffect(() => {
        const setter = async () => {
            const accountsProm = web3Api.getAccounts();
            const networkNameProm = web3Api.getNetworkName();
            const clientVersionProm = web3Api.web3.currentProvider.send('web3_clientVersion', []);
            const [account] = await accountsProm;
            const [balance, networkName, clientVersion] = await Promise.all([
                web3Api.getBalance(account),
                networkNameProm,
                clientVersionProm,
            ]);
            ReactDOM.unstable_batchedUpdates(() => {
                setAccount(account);
                setBalance(balance);
                setNetworkName(networkName);
                setClientVersion(clientVersion);
            });
        };
        setter();
    }, [web3Api]);
    return (React.createElement("div", null,
        React.createElement("div", null,
            "Account: ",
            account),
        React.createElement("div", null,
            "Balance: ",
            +balance / 1e18,
            " ETH"),
        React.createElement("div", null,
            "Network: ",
            networkName && networkName.toUpperCase()),
        React.createElement("pre", null,
            "Client Version:",
            JSON.stringify(clientVersion, null, 2))));
};
export default DisplayWeb3;
//# sourceMappingURL=DisplayWeb3.js.map