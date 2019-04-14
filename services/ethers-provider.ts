import '../node_modules/ethers/dist/ethers.min.js';

// TODO I would like to explicitly say window...so I would have to extend the window type somehow
const networkName: EthereumNetworkName = process.env.NODE_ENV === 'production' ? 'homestead' : 'ropsten';
export const ethersProvider = ethers.getDefaultProvider(networkName);
// export const ethersProvider = new ethers.providers.InfuraProvider(networkName);