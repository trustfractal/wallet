# Fractal Data Wallet - Plugin

This project was bootstrapped with [Create React Extension](https://github.com/VasilyShelkov/create-react-extension).

**Table of Contents**

- [Setup](#setup)
- [Development](#development)
- [Deployment](#deployment)

## Setup

To setup the project you need to follow these instructions:

- Clone or download this repository:

```sh
$ git clone git@github.com:subvisual/fractal.git
```

- Run the setup steps:

```sh
$ ./bin/setup
```

## Development

To start the development server, run:

```sh
$ ./bin/server
```

The page will automatically reload if you make changes to the code.
You will see the build errors and lint warnings in the console.

To build the assets only once, not watching for changes, run:

```sh
$ yarn build
```

## Deployment

To load an extension to Google Chrome you need to follow these instructions:

- Build an unpacked extension:

```sh
$ yarn build # or yarn dev
```

- Open your browser extensions page ([chrome://extensions](chrome://extensions)):

```
... -> More Tools -> Extensions
```

- Make sure you have developer mode **ON** so you can load an unpacked extension

- Click on **Load unpacked** and select the unpacked extension folder.
