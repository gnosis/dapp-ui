import getWeb3Api from './api/web3'

import { Web3ConnectButton, Web3ConnectManual } from './components'
import { Web3Options, Web3Api } from './types'

/**
 * launchDappUI
 * @desc Set up function to init web3 frontend API and do anything else
 * W.I.P
 * @param { Web3Options } options
 */
async function launchDappUI(options: Web3Options = {}): Promise<Web3Api | Error> {
    try {
        return getWeb3Api(options)
    } catch (error) {
        console.error('launchDappUI Error!', error)
        throw new Error(error)
    }
}

export {
    // Setup Fns
    getWeb3Api,
    launchDappUI,
    // Components
    Web3ConnectButton,
    Web3ConnectManual,
    // Types
    Web3Api,
    Web3Options,
}
