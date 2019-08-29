"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const web3connect_1 = tslib_1.__importDefault(require("web3connect"));
// API
const web3_1 = tslib_1.__importDefault(require("../../api/web3"));
// Components
const DisplayWeb3_1 = tslib_1.__importDefault(require("../DisplayWeb3"));
const globals_1 = require("../../globals");
const Web3ConnectButton = () => {
    const [web3Api, setWeb3Api] = react_1.useState();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(web3connect_1.default.Button, { providerOptions: {
                walletconnect: {
                    bridge: globals_1.SAFE_WALLETCONNECT_BRIDGE,
                },
            }, onConnect: (provider) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                console.log('Web3Connect.Button::Connected to', typeof provider === 'object' ? provider.constructor.name : provider);
                const web3Api = yield web3_1.default({ customProvider: provider }); // add provider to web3Api
                setWeb3Api(web3Api);
            }), onClose: () => {
                console.log('Web3Connect Modal Closed'); // modal has closed
            }, label: web3Api ? 'Change Wallet' : 'Connect' }),
        web3Api && react_1.default.createElement(DisplayWeb3_1.default, { title: "WEB3CONNECT BUTTON", web3Api: web3Api })));
};
exports.default = Web3ConnectButton;
//# sourceMappingURL=Web3ConnectButton.js.map