# rns-artifacts

RNS library for smart contract development.

## Setup

Requirement: [`truffle`](https://github.com/truffle-suite/truffle).

```
yarn install
```

## Run tests

```
truffle develop
truffle(develop)> test

truffle(develop)> test ./test/path/to/test.js
```

## Types of contracts

- [Registrar](/contracts/registrar): contract owner of a node. It can emit subnodes and set their owners. For example `rsk` can change `alice.rsk` owner.
- [Resolver](/contracts/resolver): contract responsible for performing resource lookups for a name - for instance, returning a contract address, a content hash, or IP address(es) as appropriate.
