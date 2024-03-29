import fs from 'fs'
import Sentry from '@sentry/node'
import { importKey } from '@taquito/signer'
import { TezosToolkit } from '@taquito/taquito'
import {
  RPC,
  MIN,
  MAX,
  WALLET,
  SENTRY_DSN, 
  INTERVAL_MIN,
  INTERVAL_MAX,
  CONTRACT_ADDRESS
} from './config.js'
import './sentry.js'

const toolkit = new TezosToolkit(RPC)
const wallet = JSON.parse(fs.readFileSync(`./secrets/${WALLET}.json`).toString())
importKey(toolkit,
  wallet.privkey
).catch((e) => console.error(e));

function genRandomNumber(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min) 
}

export async function setEntropy() {
  let contract = await toolkit.contract.at(CONTRACT_ADDRESS)
  //let methods = contract.parameterSchema.ExtractSignatures()
  let rn = genRandomNumber(parseInt(MIN), parseInt(MAX))
  console.log('random', rn)
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
    Sentry.captureException(e)
    console.log(`FAIL`, e.message)
  }
  const interval = genRandomNumber(parseInt(INTERVAL_MIN), parseInt(INTERVAL_MAX))
  console.log(`interval`, interval)
  setTimeout(setEntropyLoop, interval*1000)
}

(async () => {
  await setEntropyLoop() 
})()
