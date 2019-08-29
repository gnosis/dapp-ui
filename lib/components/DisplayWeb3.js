"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
exports.DisplayWeb3 = ({ web3Api }) => {
    const [account, setAccount] = react_1.useState();
    const [balance, setBalance] = react_1.useState();
    const [networkName, setNetworkName] = react_1.useState();
    const [clientVersion, setClientVersion] = react_1.useState();
    react_1.useEffect(() => {
        const setter = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const accountsProm = web3Api.getAccounts();
            const networkNameProm = web3Api.getNetworkName();
            const clientVersionProm = web3Api.web3.currentProvider.send('web3_clientVersion', []);
            const [account] = yield accountsProm;
            const [balance, networkName, clientVersion] = yield Promise.all([
                web3Api.getBalance(account),
                networkNameProm,
                clientVersionProm,
            ]);
            react_dom_1.default.unstable_batchedUpdates(() => {
                setAccount(account);
                setBalance(balance);
                setNetworkName(networkName);
                setClientVersion(clientVersion);
            });
        });
        setter();
    }, [web3Api]);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", null,
            "Account: ",
            account),
        react_1.default.createElement("div", null,
            "Balance: ",
            +balance / 1e18,
            " ETH"),
        react_1.default.createElement("div", null,
            "Network: ",
            networkName && networkName.toUpperCase()),
        react_1.default.createElement("pre", null,
            "Client Version:",
            JSON.stringify(clientVersion, null, 2))));
};
exports.default = exports.DisplayWeb3;
//# sourceMappingURL=DisplayWeb3.js.map