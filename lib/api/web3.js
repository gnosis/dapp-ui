"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
const utils_1 = require("../utils");
const globals_1 = require("../globals");
let web3Api;
let readOnly;
exports.default = (options = {}, force) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!force && web3Api)
        return web3Api;
    return setupWeb3(options);
});
const getWeb3Provider = ({ customProvider, onAccountsChange }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let provider;
    // wait window load then check window globals...
    yield utils_1.windowLoaded;
    // Use Custom Provider if passed in
    if (customProvider)
        provider = new web3_1.default(customProvider);
    // No Custom Provider? Check window.ethereum
    else if (window && window.ethereum) {
        provider = new web3_1.default(window.ethereum);
        // enable Provider, if possible
        yield window.ethereum.enable();
        onAccountsChange && onAccountsChange();
    }
    // Check for window.web3's current provider (if it exists)
    else if (window.web3 && window.web3.currentProvider)
        provider = new web3_1.default(window.web3.currentProvider);
    // Else setup localhost version
    else {
        try {
            const url = 'http://localhost:8545';
            yield fetch(url);
            console.debug('API/WEB3.ts => local node active');
            provider = new web3_1.default(url);
        }
        catch (error) {
            if (error.readyState === 4 && (error.status === 400 || error.status === 200)) {
                // the endpoint is active
                console.debug('API/WEB3.ts catch block => Success');
            }
            else {
                console.debug('API/WEB3.ts =>  No web3 instance injected. Falling back to null provider.');
                readOnly = true;
                provider = new web3_1.default(null);
            }
        }
    }
    return provider;
});
function setupWeb3(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const web3 = yield getWeb3Provider(options);
        function getCurrentAccount() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const [acct] = yield web3.eth.getAccounts();
                return acct;
            });
        }
        const getAccounts = () => tslib_1.__awaiter(this, void 0, void 0, function* () { return web3.eth.getAccounts(); });
        const getBalance = (account) => tslib_1.__awaiter(this, void 0, void 0, function* () { return web3.eth.getBalance(account); });
        const getBlock = (block = 'latest') => tslib_1.__awaiter(this, void 0, void 0, function* () { return getBlock(block); });
        const getNetwork = () => tslib_1.__awaiter(this, void 0, void 0, function* () { return web3.eth.net.getId(); });
        const getNetworkName = (id) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            id = +(id || (yield getNetwork()));
            return globals_1.NETWORK_ID_TO_NAME[id];
        });
        const getTransaction = (txHash) => tslib_1.__awaiter(this, void 0, void 0, function* () { return web3.eth.getTransaction(txHash); });
        const getTransactionReceipt = (txHash) => tslib_1.__awaiter(this, void 0, void 0, function* () { return web3.eth.getTransactionReceipt(txHash); });
        /* Provider Specific */
        const setProvider = web3.setProvider.bind(web3);
        const resetProvider = () => setProvider(web3.currentProvider);
        /* Provider Utils */
        const isReadOnly = () => readOnly;
        return {
            // Web3 Object
            web3,
            // Functions
            getCurrentAccount,
            getAccounts,
            getBalance,
            getBlock,
            getNetwork,
            getNetworkName,
            getTransaction,
            getTransactionReceipt,
            // Utils
            isReadOnly,
            setProvider,
            resetProvider,
        };
    });
}
//# sourceMappingURL=web3.js.map