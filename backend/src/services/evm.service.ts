import { ethers } from "ethers";
import { ETH_RPC_URL } from "../config/blockchain.config.js";

class EVMService {
  private provider = new ethers.JsonRpcProvider(ETH_RPC_URL);

  public generateTempWallet(): { address: string; privateKey: string } {
    const wallet = ethers.Wallet.createRandom();

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  public isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  public async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }
}

export default new EVMService();
