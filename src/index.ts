import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import invariant from 'tiny-invariant'
import BloctoProvider from '@blocto/sdk'

interface BloctoConnectorArguments {
  chainId: number
  rpc: string
}

const chainIdToNetwork: { [network: number]: string } = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan'
}

export class BloctoConnector extends AbstractConnector {
  private readonly chainId: number
  private readonly rpc: string
  public Blocto: any

  constructor({ chainId, rpc }: BloctoConnectorArguments) {
    invariant(Object.keys(chainIdToNetwork).includes(chainId.toString()), `Unsupported chainId ${chainId}`)
    super({ supportedChainIds: [chainId] })
    this.chainId = chainId
    this.rpc = rpc
  }

  public async activate(): Promise<ConnectorUpdate> {
    const bloctoProvider = new BloctoProvider({
      chainId: this.chainId,
      rpc: this.rpc
    })

    this.Blocto = bloctoProvider

    const [account] = await Promise.all([bloctoProvider.enable().then((accounts: string[]) => accounts[0])])

    return { provider: bloctoProvider, chainId: this.chainId, account: account }
  }

  public async getProvider(): Promise<any> {
    return this.Blocto.getProvider()
  }

  public async getChainId(): Promise<number | string> {
    return this.chainId
  }

  public async getAccount(): Promise<null | string> {
    return this.Blocto.getProvider()
      .send('eth_accounts')
      .then((accounts: string[]): string => accounts[0])
  }

  public deactivate() {}
}
