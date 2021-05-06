# Fractal Wallet

The Fractal Wallet allows you to connect to Metamask and store your distributed
identity credential. You can issue and store different type of credentials on
the blockchain, without compromising your data or privacy.

Generating a credential on the Fractal wallet will speed up your KYC processes
on different websites and give you control of what data you share.

It also enables you to stake your FCL.

**Table of Contents**

- [Instalation](#instalation)
- [Setup](#setup)
- [Development](#development)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)
- [About](#about)

## Instalation

## Setup

First, clone & setup the repository:

```
git clone git@github.com:trustfractal/wallet.git
cd wallet
yarn install
```

You'll need to set up the environment. To do so, run:

```
cp .env.example .env
```

Afterwards, fill in with the appropriate values.

## Development

To start your development environment run:

```
yarn start
```

This will create a new unpacked extension on `dev/`.

Afterwards open Google Chrome and go to
[`chrome://extensions`](chrome://extensions). Enable developer mode on the
top-right corner and refresh the page.

Click the "Load Unpacked" button and go all the way to the `dev/` folder and
select it.

That's it! You're ready to run the Fractal Wallet.

## Contribution Guidelines

Contributions must follow [Subvisual's guides](https://github.com/subvisual/guides).

## License

Wallet is copyright &copy; 2021 Trust Fractal GmbH.

It is open-source, made available for free, and is subject to the terms in its [license].

## About

Fractal Wallet was created and is maintained with :heart: by [Fractal Protocol][fractal].

[license]: ./LICENSE
[fractal]: https://protocol.fractal.id/
