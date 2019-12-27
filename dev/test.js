const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1577436627538,
      transactions: [],
      nonce: 100,
      hash: "0",
      previousBlockHash: "0"
    },
    {
      index: 2,
      timestamp: 1577436652464,
      transactions: [],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0"
    },
    {
      index: 3,
      timestamp: 1577436728771,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "ede7e320288511ea80845bab29df2f48",
          transactionId: "fcc85410288511ea80845bab29df2f48"
        },
        {
          amount: 10,
          sender: "HGHFHHJFGGMNB",
          recipient: "DSFFHFGKJF",
          transactionId: "2061a3e0288611ea80845bab29df2f48"
        },
        {
          amount: 20,
          sender: "HGHFHHJFGGMNB",
          recipient: "DSFFHFGKJF",
          transactionId: "239b9930288611ea80845bab29df2f48"
        },
        {
          amount: 30,
          sender: "HGHFHHJFGGMNB",
          recipient: "DSFFHFGKJF",
          transactionId: "26d7ff80288611ea80845bab29df2f48"
        }
      ],
      nonce: 139466,
      hash: "00004892d3c5c953faf256a55d4a09ac8521108422dec59f57a73fed7f8206c0",
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
      index: 4,
      timestamp: 1577436759582,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "ede7e320288511ea80845bab29df2f48",
          transactionId: "2a3f4660288611ea80845bab29df2f48"
        },
        {
          amount: 40,
          sender: "HGHFHHJFGGMNB",
          recipient: "DSFFHFGKJF",
          transactionId: "347b3580288611ea80845bab29df2f48"
        },
        {
          amount: 50,
          sender: "HGHFHHJFGGMNB",
          recipient: "DSFFHFGKJF",
          transactionId: "366fb280288611ea80845bab29df2f48"
        },
        {
          amount: 60,
          sender: "HGHFHHJFGGMNB",
          recipient: "DSFFHFGKJF",
          transactionId: "3866a080288611ea80845bab29df2f48"
        },
        {
          amount: 70,
          sender: "HGHFHHJFGGMNB",
          recipient: "DSFFHFGKJF",
          transactionId: "3a0c1320288611ea80845bab29df2f48"
        }
      ],
      nonce: 40623,
      hash: "00002496221957a897bab9a1abee2bb47df0edfe6a73597a193b37bde1d3d276",
      previousBlockHash:
        "00004892d3c5c953faf256a55d4a09ac8521108422dec59f57a73fed7f8206c0"
    },
    {
      index: 5,
      timestamp: 1577436770909,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "ede7e320288511ea80845bab29df2f48",
          transactionId: "3c9ca910288611ea80845bab29df2f48"
        }
      ],
      nonce: 29203,
      hash: "00005c7fb7272cfe74c89baa20582c207c3e2be7e7895eb028105f65272b9d71",
      previousBlockHash:
        "00002496221957a897bab9a1abee2bb47df0edfe6a73597a193b37bde1d3d276"
    },
    {
      index: 6,
      timestamp: 1577436775530,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "ede7e320288511ea80845bab29df2f48",
          transactionId: "435d0600288611ea80845bab29df2f48"
        }
      ],
      nonce: 96799,
      hash: "00001a56bdd3e8470335b238e2814095e4ba00477c2c0b4927c5e9fd39a47f82",
      previousBlockHash:
        "00005c7fb7272cfe74c89baa20582c207c3e2be7e7895eb028105f65272b9d71"
    }
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: "00",
      recipient: "ede7e320288511ea80845bab29df2f48",
      transactionId: "461dfac0288611ea80845bab29df2f48"
    }
  ],
  currentNodeUrl: "http://localhost:3001",
  networkNodes: []
};

console.log("Valid: ", bitcoin.chainIsValid(bc1.chain));
