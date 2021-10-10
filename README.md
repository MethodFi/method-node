# method-node
Node.js library for the Method API

[![NPM](https://img.shields.io/npm/v/method-node.svg)](https://www.npmjs.com/package/method-node)

## Install

```bash
npm install --save method-node
```

## Usage

```jsx
import { Method, Environments } from 'method-node';

const client = new Method({
  apiKey: '<API_KEY>',
  env: Environments.dev,
});
```
