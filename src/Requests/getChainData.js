const { JsonRpc } = require('eosjs');
const fetch = require('node-fetch');
const rpc = new JsonRpc('https://api.eosdetroit.io/', { fetch });

 export async function getHeadBlock() {
    try {
      let info = await rpc.get_info();
      return info;
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

  export async function getBlocks(startingBlock, tillValue) {
    try {
      let x = 0;
      let arrayToPass = []
      while (x < tillValue) {
      let returnedValue = await rpc.get_block((startingBlock - x));
      arrayToPass.push(returnedValue);
      x++;
    }
      return arrayToPass;
    } catch (error) {
      console.error(JSON.stringify(error));
  }
  }