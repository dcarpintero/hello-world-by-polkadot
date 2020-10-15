
// Subscribes to the upcoming 10 blocks
const { ApiPromise, WsProvider } = require('@polkadot/api');
const wsProvider = new WsProvider('wss://rpc.polkadot.io');

async function main () {
  const api = await ApiPromise.create({provider: wsProvider});

  let count = 0;

  const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Chain is at block: #${header.number} ${header.hash}`);

    if (++count === 10) {
      unsubscribe();
      process.exit(0);
    }
  });
}

main().catch(console.error);