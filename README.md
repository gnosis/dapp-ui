# @gnosis.pm/dapp-ui
<strong>Reusable Dapp UI components and setup functions</strong>

## Setup
As is probably already familiar, run:

```sh
npm i
```

This will also automatically install the deps inside the `examples/ts-frontend` folder, allowing you to run the test frontend as seen in the `Running example frontend` instructions below.

## Running example frontend
```sh
npm run build
```

Troubleshooting: 
1. App wont build etc: Check that `node_modules` inside `examples/ts-frontend` are installed. Can be done manually via `cd ./examples/ts-frontend && npm i`
2. WalletConnect isn't working! It is known to have issues as it is still beta. Please try `test.walletconnect.org` and make sure to clear cache by disconnecting from the mobile app and hard refreshing. Gnosis Safe WalletConnect is currently NOT working.
3. I don't see any injected wallets! (Metamask, Safe, etc) - If in incognito mode, please check that wallet is allowed to run incognito; if using Safe, please check that site is whitelisted (click extension and check)
4. Safe is enabled but I still see Metamask! Make sure you only have ONE injected wallet instance running. E.g you CANNOT have both Metamask AND Safe enabled. It will result in a race condition for who injects first.

## Testing

```sh
npm run test
```

## Running CRA example

Build the library with `npm run build`

Inside `./examples/cra-test`, install dependencies `npm install` and run the example `npm start`

## Automatically Fixing Code in VS Code
To run `eslint --fix` on save add to the settings.json file:

```
"eslint.autoFixOnSave":  true,
"eslint.validate":  [
  "javascript",
  "javascriptreact",
  {"language":  "typescript",  "autoFix":  true  },
  {"language":  "typescriptreact",  "autoFix":  true  }
]
```
