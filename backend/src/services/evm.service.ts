import { ethers } from "ethers";

// will deal with all EVM payments, ETH/MATIC/BNB etc.
class EVMService {
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
}

export default new EVMService();
