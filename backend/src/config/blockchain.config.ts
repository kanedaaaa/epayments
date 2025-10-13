export type NetworkType = "mainnet" | "testnet";

export const NETWORK: NetworkType =
  (process.env.BLOCKCHAIN_NETWORK as NetworkType) || "testnet";

export const ETH_RPC_URL =
  NETWORK === "mainnet"
    ? process.env.ETH_MAINNET_RPC || ""
    : process.env.ETH_TESTNET_RPC || "";

export const SUPPORTED_CURRENCIES = ["ETH"];
