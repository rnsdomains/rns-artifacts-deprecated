# Registrar contract

The Registrar is the contract that handles the domain issuing logic.

Any account owner of an RNS domain can emit subdomains under it. A Registrar contract usually owns a node and emits subnodes under it.

_[Further reading](https://docs.rns.rsk.co/architecture/registrar)_

## Resources

- [SubdomainRegistrar](/DOCS/Subdomain_Registrar.md): this contract is owner of a node and lets anyone to emit subnodes.
- [PublicSubdomainRegistrar](/DOCS/Public_Subdomain_Registrar.md): this contract is owner of many nodes and lets anyone to emit subnodes under any of them.
- [PriceSubdomainRegitrar](/DOCS/Price_Subdomain_Registrar.md): this contract gives a price to anyone who is whitelisted and registers it's subnode.
