# hardhat-html-fund-me

1. HTML / Javascript
2. Later on, we will use Nextjs / Reactjs

## Shortcuts

- '!' in VSC (emmet) -> html scaffold

## Imports in Browser's Javascript

- replace:

```html
<script src="./index.js" type="text/javascript"></script>
```

with:

```html
<script src="./index.js" type="module"></script>
```

and move the onclick attributes and similar
from html to javascript.

## Contracts ABI and Address

You can copy the abi from the backend:
artifacts/contracts/FundMe.sol/FundMe.json
and paste it in constants.js in the front-end
then import it in the javascript file.

What about the address?
We'll use a local network, therefore we could spin-up a blockchain
from the back-end project running:

- yarn hardhat node

and get the address from the console.
Or (easier) run the node from a second terminal from the front-end project.

We need to connect Metamask to our local node.
