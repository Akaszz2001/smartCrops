const { Web3 } = require("web3");
require("dotenv").config();

const INFURA_URL = process.env.INFURA_URL;
const ADMIN_PRIVATE_KEY =`0x${process.env.PRIVATE_KEY.trim()}`
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

// Load Admin Wallet
const adminAccount = web3.eth.accounts.privateKeyToAccount(ADMIN_PRIVATE_KEY);
web3.eth.accounts.wallet.add(adminAccount);

const contractABI = require("../contractABI.json");
const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

module.exports = { web3, adminAccount, contract };
