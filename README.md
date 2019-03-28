# rns-artifacts

RNS library for smart contract development.

Read the [wiki](wiki).

## Requirements: 

[`truffle`](https://github.com/truffle-suite/truffle).
```
Truffle v5.0.9 (core: 5.0.9)
Solidity - ^0.5.2 (solc-js)
Node v11.12.0
Web3.js v1.0.0-beta.37
```

## Setup

Install a new Solidity version:

```
cd /usr/local/lib/node_modules/truffle
npm install solc@0.5.x # x >= 2
```


```
yarn install
```

## Run tests

```
truffle develop
truffle(develop)> test

truffle(develop)> test ./test/path/to/test.js
```
