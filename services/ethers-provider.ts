import '../node_modules/ethers/dist/ethers.min.js';
// import { ethers } from 'ethers';

// TODO I would like to explicitly say window...so I would have to extend the window type somehow
const networkName: EthereumNetworkName = window.process.env.NODE_ENV === 'production' ? 'homestead' : 'kovan';
export const ethersProvider = ethers.getDefaultProvider(networkName);
// export const ethersProvider = new ethers.providers.InfuraProvider(networkName);