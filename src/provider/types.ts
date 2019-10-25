import { EventEmitter } from 'events'
import { Duplex } from 'stream'
import {
    JSONRPCRequestPayload as RequestPayload,
    JSONRPCResponsePayload as ResponsePayload,
    JSONRPCErrorCallback,
    Transaction,
} from 'ethereum-protocol'
import Web3ProviderEngine from 'web3-provider-engine'
import { IConnector as WalletConnector } from '@walletconnect/types'

interface AnyObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K: string]: any
}

export type JSONRPCResponsePayload = Partial<ResponsePayload> &
    Pick<ResponsePayload, 'result'> & {
        error?: FormattedError
    }
export type JSONRPCRequestPayload = Partial<RequestPayload> & Pick<RequestPayload, 'method'>

export { WalletConnector }

type RpcMiddleware = (
    req: JSONRPCRequestPayload,
    res: JSONRPCResponsePayload,
    next: (cb?: Error | Function) => void,
    end: (err?: Error) => void,
) => void

interface RpcEngine extends EventEmitter {
    handle(req: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void
    push(middleware: RpcMiddleware): void
}

interface ObservableStore<T = AnyObject> extends EventEmitter {
    getState(): T
    pushState(newState: T): void
    updateState(partialState: Partial<T>): void
    subscribe(handler: Parameters<EventEmitter['on']>[1]): void
    unsubscribe(handler: Parameters<EventEmitter['on']>[1]): void
}

interface ObjectMultiplex extends Duplex {
    createStream(name: string): Duplex
    ignoreStream(name: string): void
}

export interface MetamaskProvider extends EventEmitter {
    isMetaMask: true
    autoRefreshOnNetworkChange: boolean
    networkVersion: string
    chainId: string
    selectedAddress: string | null
    isConnected(): boolean
    _metamask: {
        isEnabled(): boolean
        isApproved(): Promise<boolean>
        isUnlocked(): Promise<boolean>
    }
    mux: ObjectMultiplex
    rpcEngine: RpcEngine
    publicConfigStore: ObservableStore
    on(event: 'accountsChanged', callback: (accounts: string[]) => void): this
    on(event: 'networkChanged', callback: (networkId: string) => void): this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: 'data', callback: (error: Error | null, payload: any) => void): this
    on(event: 'error', callback: (message: string) => void): this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string | symbol, callback: (...args: any[]) => void): this
    once(event: 'accountsChanged', callback: (accounts: string[]) => void): this
    once(event: 'networkChanged', callback: (networkId: string) => void): this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(event: 'data', callback: (error: Error | null, payload: any) => void): this
    once(event: 'error', callback: (message: string) => void): this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(event: string | symbol, callback: (...args: any[]) => void): this
    send(payload: JSONRPCRequestPayload, callback?: JSONRPCErrorCallback): void
    send(payload: JSONRPCRequestPayload): JSONRPCResponsePayload
    sendAsync(payload: JSONRPCRequestPayload, callback?: JSONRPCErrorCallback): void
}

interface FormattedError {
    message: string
    code: number
}

interface HttpConnection extends EventEmitter {
    url: string
    post: {
        body: null | string
        headers: { 'Content-Type': 'application/json' }
        method: 'POST'
    }
    formatError(
        payload: Omit<JSONRPCResponsePayload, 'result'>,
        message: string,
        code: number,
    ): {
        error: FormattedError
        id: JSONRPCResponsePayload['id']
        jsonrpc: JSONRPCResponsePayload['jsonrpc']
    }
    send(payload: JSONRPCRequestPayload): Promise<FormattedError | JSONRPCResponsePayload>
    send(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): Promise<never>
}

export type Block = {
    number: string
    hash: string
    parentHash: string
    nonce: string
    sha3Uncles: string
    logsBloom: string
    transactionsRoot: string
    stateRoot: string
    miner: string
    difficulty: string
    totalDifficulty: string
    extraData: string
    size: string
    gasLimit: string
    gasUsed: string
    timestamp: string
    uncles: string[]
    mixHash: string
    receiptsRoot: string
    transactions: string[] | Transaction[]
}

export type BufferBlock = {
    transactions: string[] | Transaction[]
} & Record<Exclude<keyof Block, 'transactions'>, Uint8Array>

// have to override sendAsync explicitly
type Web3ProviderEngineAsEventEmitter = Omit<Web3ProviderEngine, 'sendAsync'> & EventEmitter

export interface WalletConnectProvider extends Web3ProviderEngineAsEventEmitter {
    bridge: string
    qrcode: boolean
    infuraId: string
    currentBlock: BufferBlock | null
    wc: WalletConnector
    http?: HttpConnection
    isConnecting: boolean
    isWalletConnect: true
    rpc: {
        [K: number]: string
    }
    connectCallbacks: ((wc: WalletConnector) => void)[]
    accounts: string[]
    chainId: number
    networkId: number
    rpcUrl: string
    enable(): Promise<string[]>
    send(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void
    send(payload: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload>
    sendAsync(payload: JSONRPCRequestPayload, callback?: JSONRPCErrorCallback): void
    onConnect(callback: (wc: WalletConnector) => void): void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    triggerConnect(connector: any): void
    close(): Promise<void>
    // addProvider(provider), start(), stop() are inherited from Web3ProviderEngine
    handleRequest(payload: JSONRPCRequestPayload): Promise<void | JSONRPCResponsePayload>
    formatResponse(
        payload: Omit<JSONRPCResponsePayload, 'result'>,
        result: JSONRPCResponsePayload['result'],
    ): JSONRPCResponsePayload
    handleOtherRequests(payload: JSONRPCRequestPayload): Promise<void | FormattedError | JSONRPCResponsePayload>
    handleReadRequests(payload: JSONRPCRequestPayload): Promise<void | FormattedError | JSONRPCResponsePayload>
    getWalletConnector(): Promise<WalletConnector>
    on(event: 'chainChanged', callback: (chainId: number) => void): this
    // on(event: 'open', callback: () => void): this  // doesn't emit
    // on(event: 'close', callback: (code: number, reason: string) => void): this  // doesn't emit
    on(event: 'accountsChanged', callback: (accounts: string[]) => void): this
    on(event: 'networkChanged', callback: (networkId: string) => void): this // never emits
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: 'payload', callback: (payload: any) => void): this
    on(event: 'connect', callback: () => void): this // this happens in web3connect/connector on provider.enable(), can't catch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string | symbol, callback: (...args: any[]) => void): this
    once(event: 'chainChanged', callback: (chainId: number) => void): this
    // once(event: 'open', callback: () => void): this  // doesn't emit, even if it's in the docs
    // once(event: 'close', callback: (code: number, reason: string) => void): this  // doesn't emit, even if it's in the docs
    once(event: 'accountsChanged', callback: (accounts: string[]) => void): this
    once(event: 'networkChanged', callback: (networkId: string) => void): this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(event: 'payload', callback: (payload: any) => void): this
    once(event: 'connect', callback: () => void): this // this happens in web3connect/connector on provider.enable(), can't catch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(event: string | symbol, callback: (...args: any[]) => void): this

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    on(event: 'block', callback: (block: BufferBlock) => void): this
    on(event: 'rawBlock', callback: (block: BufferBlock) => void): this
    on(event: 'latest', callback: (block: BufferBlock) => void): this
    on(event: 'sync', callback: ({ oldBlock, newBlock }: { oldBlock: Block; newBlock: Block }) => void): this
    on(event: 'start', callback: () => void): this
    on(event: 'stop', callback: () => void): this
    on(event: 'error', callback: (error: Error) => void): this

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    once(event: 'block', callback: (block: BufferBlock) => void): this
    once(event: 'rawBlock', callback: (block: BufferBlock) => void): this
    once(event: 'latest', callback: (block: BufferBlock) => void): this
    once(event: 'sync', callback: ({ oldBlock, newBlock }: { oldBlock: Block; newBlock: Block }) => void): this
    once(event: 'start', callback: () => void): this
    once(event: 'stop', callback: () => void): this
    once(event: 'error', callback: (error: Error) => void): this
}

export type Provider = WalletConnectProvider | MetamaskProvider
