const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid/v1");
const rp = require("request-promise");
const port = process.argv[2];
const Blockchain = require("./blockchain");

const nodeAddress = uuid()
  .split("-")
  .join("");

const bitcoin = new Blockchain();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable("x-powered-by");

app.get("/blockchain", function(req, res) {
  res.send(bitcoin);
});

app.post("/transaction", function(req, res) {
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(
    newTransaction
  );
  res.json({
    note: `Transaction will be added in block ${blockIndex}`
  });
});

app.post("/transaction/broadcast", function(req, res) {
  const newTransaction = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];

  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(data => {
    res.json({
      note: "Transaction created and broadcast successfully."
    });
  });
});

app.get("/mine", function(req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock["index"] + 1
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-block",
      method: "POST",
      body: {
        newBlock: newBlock
      },
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then(data => {
      const requestOptions2 = {
        uri: bitcoin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress
        },
        json: true
      };

      return rp(requestOptions2);
    })
    .then(data => {
      res.json({
        note: "New Block Mined Successfully",
        block: newBlock
      });
    });
});

app.post("/receive-new-block", function(req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({
      note: "New block received and accepted.",
      newBlock: newBlock
    });
  } else {
    res.json({
      note: "New Block Rejected",
      newBlock: newBlock
    });
  }
});

app.post("/register-and-broadcast-node", function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
    bitcoin.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];

  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: {
        newNodeUrl: newNodeUrl
      },
      json: true
    };

    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
        },
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.json({
        note: "New Node registered with network successfully."
      });
    });
});

app.post("/register-node", function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl != newNodeUrl;

  if (nodeNotAlreadyPresent && notCurrentNode)
    bitcoin.networkNodes.push(newNodeUrl);

  res.json({
    note: "New Node Registered Successfully."
  });
});

app.post("/register-nodes-bulk", function(req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;

    const notCurrentNode = bitcoin.currentNodeUrl != networkNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode)
      bitcoin.networkNodes.push(networkNodeUrl);
  });

  res.json({
    note: "Bulk Registration Successful."
  });
});

app.get("/consensus", function(req, res) {
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/blockchain",
      method: "GET",
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(blockchains => {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !bitcoin.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current Chain has not been replaced",
        chain: bitcoin.chain
      });
    } else {
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced",
        chain: bitcoin.chain
      });
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on Port ${port}...`);
});
