const sha256 = require("sha256");
const uuid = require("uuid/v1");
const currentNodeUrl = process.argv[3];

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
  this.createNewBlock(100, "0", "0");
}

// Create a new Block, Clears Transactions, Push Block to Chain
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

// Returns the last block
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

// Creates a new Transaction and push to pending transaction and retrun block index which it belongs to
Blockchain.prototype.createNewTransaction = function(
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuid()
      .split("-")
      .join("")
  };

  return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function(
  transactionObj
) {
  this.pendingTransactions.push(transactionObj);
  return this.getLastBlock()["index"] + 1;
};

// Hash a block data to a hash string
Blockchain.prototype.hashBlock = function(
  previousBlockHash,
  currentBlockData,
  nonce
) {
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

  const hash = sha256(dataAsString);

  return hash;
};

// proof of work
Blockchain.prototype.proofOfWork = function(
  previousBlockHash,
  currentBlockData
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce;
};

module.exports = Blockchain;
