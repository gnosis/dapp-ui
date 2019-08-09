import Web3Connect from 'web3connect'
import Web3 from 'web3'
import { provider } from 'web3-providers'

import React, { useState, useEffect } from 'react'

import DisplayWeb3 from './Test_DisplayWeb3'

const web3Connect = new Web3Connect.Core({
    providerOptions: {
        portis: {
            id: 'PORTIS_ID', // required
            // network: "mainnet" // optional
        },
        fortmatic: {
            key: 'FORTMATIC_KEY', // required
            // network: "mainnet" // optional
        },
    },
})

// subscibe to connect
web3Connect.on('connect', (provider: provider) => {
    console.log('Web3Connect.Core::Connected to', typeof provider === 'object' ? provider.constructor.name : provider)
    // const web3 = new Web3(provider) // add provider to web3
})

// subscibe to close
web3Connect.on('close', () => {
    console.log('Web3Connect Modal Closed') // modal has closed
})

// web3Connect.toggleModal() // open modal on button click

const ManualConnector: React.FC = () => {
    const [web3, setWeb3] = useState<Web3>()

    useEffect(() => {
        web3Connect.on('connect', (provider: provider) => {
            console.log(
                'Web3Connect.Core::Connected to',
                typeof provider === 'object' ? provider.constructor.name : provider,
            )
            const web3 = new Web3(provider) // add provider to web3
            setWeb3(web3)
        })
    }, [])

    return (
        <>
            <button onClick={() => web3Connect.toggleModal()} disabled={!!web3}>
                Open web3connect Modal
            </button>
            {web3 && <DisplayWeb3 web3={web3} />}
        </>
    )
}

export default ManualConnector
