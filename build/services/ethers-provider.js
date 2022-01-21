import "../node_modules/ethers/dist/ethers.min.js";
const networkName = process.env.NODE_ENV === "production" ? "homestead" : "kovan";
export const ethersProvider = ethers.getDefaultProvider(networkName);
