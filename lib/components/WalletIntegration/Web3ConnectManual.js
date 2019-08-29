"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const web3connect_1 = tslib_1.__importDefault(require("web3connect"));
// Components
const Button_1 = tslib_1.__importDefault(require("../Button"));
const DisplayWeb3_1 = tslib_1.__importDefault(require("../DisplayWeb3"));
// API
const web3_1 = tslib_1.__importDefault(require("../../api/web3"));
const globals_1 = require("../../globals");
const web3Connect = new web3connect_1.default.Core({
    providerOptions: {
        walletconnect: {
            bridge: globals_1.SAFE_WALLETCONNECT_BRIDGE,
        },
    },
});
// subscribe to close
web3Connect.on('close', () => {
    console.log('Web3Connect Modal Closed'); // modal has closed
});
const ManualConnector = () => {
    const [web3, setWeb3] = react_1.useState();
    react_1.useEffect(() => {
        web3Connect.on('connect', (provider) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log('Web3Connect.Core::Connected to', typeof provider === 'object' ? provider.constructor.name : provider);
                const web3 = yield web3_1.default({ customProvider: provider }); // add provider to web3Api
                setWeb3(web3);
            }
            catch (error) {
                console.error(error);
            }
        }));
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Button_1.default, { onClick: () => web3Connect.toggleModal(), secondary: true }, "Open web3connect Modal"),
        web3 && react_1.default.createElement(DisplayWeb3_1.default, { title: "WEB3CONNECT MANUAL", web3Api: web3 })));
};
exports.default = ManualConnector;
//# sourceMappingURL=Web3ConnectManual.js.map