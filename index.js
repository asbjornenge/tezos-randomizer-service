import fs from 'fs'
import { importKey } from '@taquito/signer'
import { TezosToolkit } from '@taquito/taquito'
import {
  CONTRACT_ADDRESS,
  INTERVAL,
  WALLET,
  RPC,
  MIN,
  MAX
} from './config.js'

const toolkit = new TezosToolkit(RPC)
const wallet = JSON.parse(fs.readFileSync(`./secrets/${WALLET}.json`).toString())
importKey(toolkit,
  wallet.privkey
).catch((e) => console.error(e));

function genRandomNumber() {  
  return Math.floor(
    Math.random() * (MAX - MIN + 1) + MIN
  )
}

export async function setEntropy() {
  let contract = await toolkit.contract.at(CONTRACT_ADDRESS)
  //let methods = contract.parameterSchema.ExtractSignatures()
  let rn = genRandomNumber()
  console.log(rn)
  let op = await contract.methods.setEntropy(rn).send()
  await op.confirmation(1)
  return op.hash 
}

;

const setEntropyLoop = async () => {
  try {
    const hash = await setEntropy()
    console.log(`SUCCESS`, hash)
  } catch(e) {
    console.log(`FAIL`, e.message)
  }
  setTimeout(setEntropyLoop, INTERVAL*1000)
}

(async () => {
  await setEntropyLoop() 
})()
