require('dotenv').config();
const { Web3 } = require('web3');
const fs = require('fs');
const solc = require('solc');



 // Increase fee cap

// ✅ Load environment variables
const INFURA_URL = process.env.INFURA_URL;
const PRIVATE_KEY = `0x${process.env.PRIVATE_KEY.trim()}`; // Ensure correct format

// ✅ Correct way to create a provider in Web3.js v4
const provider = new Web3.providers.HttpProvider(INFURA_URL);
const web3 = new Web3(provider);

// ✅ Get deployer account
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;


web3.eth.transactionBlockTimeout = 50; // (Optional) Prevent timeout errors on slow networks
web3.eth.transactionPollingTimeout = 480; // (Optional) Increase timeout for polling
web3.eth.maxFeePerGas = web3.utils.toWei('2', 'ether'); 
console.log("Using Account:", account.address);

// ✅ Compile contract
const contractPath = './contracts/ProductContract.sol';  // Adjust if needed
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Product.sol': { content: source },
  },
  settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
const abi = compiled.contracts['Product.sol'].ProductRegistry.abi;
const bytecode = compiled.contracts['Product.sol'].ProductRegistry.evm.bytecode.object;

// ✅ Deploy contract
const deployContract = async () => {
  try {
    const contract = new web3.eth.Contract(abi);

    console.log("Deploying contract...");

    const deployedContract = await contract.deploy({ data: bytecode }).send({
      from: account.address,
      gas: 6000000,
      maxFeePerGas: web3.utils.toWei('2', 'gwei'),  // Safe max fee
      maxPriorityFeePerGas: web3.utils.toWei('1.5', 'gwei') // For faster confirmation
    });
    
    

    console.log('✅ Contract deployed at:', deployedContract.options.address);
    fs.writeFileSync('./contractABI.json', JSON.stringify(abi, null, 2));
    fs.writeFileSync('./contractAddress.txt', deployedContract.options.address);
  } catch (error) {
    console.error("❌ Deployment error:", error);
  }
};

deployContract();
