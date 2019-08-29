"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("./api/web3"));
exports.getWeb3Api = web3_1.default;
const components_1 = require("./components");
exports.Web3ConnectButton = components_1.Web3ConnectButton;
exports.Web3ConnectManual = components_1.Web3ConnectManual;
/**
 * launchDappUI
 * @desc Set up function to init web3 frontend API and do anything else
 * W.I.P
 * @param { Web3Options } options
 */
function launchDappUI(options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return web3_1.default(options);
        }
        catch (error) {
            console.error('launchDappUI Error!', error);
            throw new Error(error);
        }
    });
}
exports.launchDappUI = launchDappUI;
//# sourceMappingURL=index.js.map