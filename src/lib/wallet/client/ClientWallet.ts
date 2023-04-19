import { CHAINID_LINEA, CHAINID_MUMBAI } from "@/const/chainParams";
import { ethers } from "ethers";

export type AddEthereumChainParameter = {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
};

export const chainsParams: { [key: string]: AddEthereumChainParameter } = {
  "0x13881": {
    chainId: CHAINID_MUMBAI,
    chainName: "Matic Testnet Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    iconUrls: [],
  },
  "0xe704": {
    chainId: CHAINID_LINEA,
    chainName: "Linea Goerli test network",
    nativeCurrency: {
      name: "LineaETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.goerli.linea.build"],
    blockExplorerUrls: ["https://explorer.goerli.linea.build"],
    iconUrls: [],
  },
};

export class ClientWallet {
  private static _instance: ClientWallet;
  private constructor(public readonly provider: ethers.BrowserProvider) {}

  /**
   * Create instance (singleton)
   * @return {Promise<ClientWallet>} instance
   */
  public static async instance(): Promise<ClientWallet> {
    if (!this._instance) {
      const { ethereum } = window as any;
      if (!_isInstallWallet(ethereum))
        throw new Error("Please install MetaMask wallet");
      const provider = new ethers.BrowserProvider(ethereum);
      this._instance = new ClientWallet(provider);
    }
    return this._instance;
  }

  /**
   * Connect to wallet
   * @return {Promise<string[]>} connected addresses
   */
  connect = async (): Promise<string[]> => {
    const connectedAddresses = await this.provider.send(
      "eth_requestAccounts",
      [],
    );
    console.log(`Connected: ${connectedAddresses}`);
    return connectedAddresses;
  };

  /**
   * Get connected chain id
   * @return {Promise<string>} chain id
   */
  getChainId = async (): Promise<string> => {
    return await this.provider.send("eth_chainId", []);
  };

  /**
   * Change chain
   * @param chainId chain id
   */
  switchChain = async (chainId: string) => {
    await this.provider.send("wallet_switchEthereumChain", [
      {
        chainId: chainId,
      },
    ]);
  };

  /**
   * Add chain
   * @param params chain params
   */
  addChain = async (params: AddEthereumChainParameter) => {
    await this.provider.send("wallet_addEthereumChain", [params]);
  };

  /**
   * Change chain if not exist, add chain
   * @param chainId chain id
   */
  switchChainIfNotExistAdd = async (chainId: string) => {
    try {
      await this.switchChain(chainId);
    } catch (e) {
      console.log(e);
      console.log("Chain is not exist, add chain");
      await this.addChain(chainsParams[chainId]);
    }
  };

  /**
   * Get connected addresses
   * @return {Promise<string[]>} connected addresses
   */
  getConnectedAddresses = async (): Promise<string[]> => {
    return await this.provider.send("eth_accounts", []);
  };

  /**
   * Get signer
   * @return {Promise<ethers.JsonRpcSigner>} signer
   */
  getSigner = async (): Promise<ethers.JsonRpcSigner> => {
    return await this.provider.getSigner();
  };
}

/**
 * Check install wallet
 * @param ethereum window.ethereum
 * @return {boolean} true -> already installed / false -> not install
 */
const _isInstallWallet = (ethereum: any): boolean => {
  return typeof ethereum !== "undefined";
};
