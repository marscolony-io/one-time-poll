/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

 const HDWalletProvider = require('@truffle/hdwallet-provider');
 //
 // const fs = require('fs');
 // const mnemonic = fs.readFileSync(".secret").toString().trim();
 const { key } = require("./secrets")
 
 module.exports = {
   networks: {
     development: {
       host: "127.0.0.1",
       port: 9545,
       network_id: "*"
     },
     harmain: {
       provider: () => {
         return new HDWalletProvider({
           mnemonic: key,
           providerOrUrl: /* 'https://api.fuzz.fi', */ /*'https://api.harmony.one',*/ 'https://rpc.hermesdefi.io/',
           derivationPath: `m/44'/60'/0'/0/`,
           confirmations: 0,
           timeoutBlocks: 200,
         });
       },
       network_id: 1666600000,
     },
     hartest: {
       provider: () => {
         return new HDWalletProvider({
           mnemonic: key,
           providerOrUrl: 'https://api.s0.b.hmny.io',
           derivationPath: `m/44'/60'/0'/0/`
         });
       },
       network_id: 1666700000,
     },
   },
   compilers: {
     solc: {
       version: '0.8.13',
       settings: {
         optimizer: {
           enabled: true,
           runs: 200,
         },
       },
     },
   },
   plugins: ["solidity-coverage"]
 }