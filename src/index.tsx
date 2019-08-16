// API Functions
import getWeb3API, { Web3SetupOptions, Web3FrontendAPI } from './api/web3'
// Components
import Web3ConnectButton from './components/Web3ConnectButton'

/**
 * setupGnosisUI
 * @desc Set up function to init web3 frontend API and do anything else
 * W.I.P
 * @param { Web3SetupOptions } options
 */
async function setupGnosisUI(options: Web3SetupOptions = {}): Promise<Web3FrontendAPI | Error> {
    try {
        return getWeb3API(options)
    } catch (error) {
        console.error('setupGnosisUI Error!', error)
        throw new Error(error)
    }
}

export {
    // Setup Fns
    getWeb3API,
    setupGnosisUI,
    // Components
    Web3ConnectButton,
    // Types
    Web3FrontendAPI,
}
