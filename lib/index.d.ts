import getWeb3Api from './api/web3';
import { Web3ConnectButton, Web3ConnectManual } from './components';
import { Web3Options, Web3Api } from './types';
/**
 * launchDappUI
 * @desc Set up function to init web3 frontend API and do anything else
 * W.I.P
 * @param { Web3Options } options
 */
declare function launchDappUI(options?: Web3Options): Promise<Web3Api | Error>;
export { getWeb3Api, launchDappUI, Web3ConnectButton, Web3ConnectManual, Web3Api, Web3Options, };
//# sourceMappingURL=index.d.ts.map