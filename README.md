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
const method = new Method({
  apiKey: '<API_KEY>',
  env: Environments.dev,
});
```

## Entities

### Create Individual Entity

```jsx
const entity = await method.entities.create({
  type: 'individual',
  individual: {
    first_name: 'Kevin',
    last_name: 'Doyle',
    phone: '+16505555555',
    email: 'kevin.doyle@gmail.com',
    dob: '1997-03-18',
  },
  address: {
    line1: '3300 N Interstate 35',
    line2: null,
    city: 'Austin',
    state: 'TX',
    zip: '78705',
  },
});
```

### Create Corporation Entity

```jsx
const entity = await method.entities.create({
  type: 'c_corporation',
  corporation: {
    name: 'Alphabet Inc.',
    dba: 'Google',
    ein: '641234567',
    owners: [
      {
        first_name: 'Sergey',
        last_name: 'Brin',
        phone: '+16505555555',
        email: 'sergey@google.com',
        dob: '1973-08-21',
        address: {
          line1: '600 Amphitheatre Parkway',
          line2: null,
          city: 'Mountain View',
          state: 'CA',
          zip: '94043',
        },
      },
    ],
  },
  address: {
    line1: '1600 Amphitheatre Parkway',
    line2: null,
    city: 'Mountain View',
    state: 'CA',
    zip: '94043',
  },
});
```

### Retrieve Entity

```jsx
const entity = await method.entities.get('ent_au22b1fbFJbp8');
```

### Update Entity

```jsx
const entity = await method.entities.update('ent_au22b1fbFJbp8', {
  individual: {
    first_name: 'Kevin',
    last_name: 'Doyle',
    email: 'kevin.doyle@gmail.com',
    dob: '1997-03-18',
  },
});
```

### List Entities

```jsx
const entities = await method.entities.list();
```

### Refresh Capabilities

```jsx
const entity = await method.entities.refreshCapabilities('ent_au22b1fbFJbp8');
```

### Create Individual Auth Session

```jsx
const response = await method.entities.createAuthSession('ent_au22b1fbFJbp8');
```

### Update Individual Auth Session

```jsx
const response = await method.entities.updateAuthSession('ent_au22b1fbFJbp8', {
  answers: [
    {
      "question_id": "qtn_ywWqCnXDGGmmg",
      "answer_id": "ans_74H68MJjqNhk8"
    },
    ...
  ]
});
```

## Accounts

### Create Ach Account

```jsx
const account = await method.accounts.create({
  holder_id: 'ent_y1a9e1fbnJ1f3',
  ach: {
    routing: '367537407',
    number: '57838927',
    type: 'checking',
  },
});
```

### Create Liability Account

```jsx
const account = await method.accounts.create({
  holder_id: 'ent_au22b1fbFJbp8',
  liability: {
    mch_id: 'mch_2',
    account_number: '1122334455',
  }
});
```

### Retrieve Account

```jsx
const account = await method.accounts.get('acc_Zc4F2aTLt8CBt');
```

### List Accounts

```jsx
const accounts = await method.accounts.list();
```

## ACH Verification

### Create Micro-Deposits Verification

```jsx
const verification = await method
  .accounts('acc_b9q2XVAnNFbp3')
  .verification
  .create({ type: 'micro_deposits' });
```

### Create Plaid Verification

```jsx
const verification = await method
  .accounts('acc_b9q2XVAnNFbp3')
  .verification
  .create({
    type: 'plaid',
    plaid: {
      balances: {
        available : 100,
        current : 110,
        iso_currency_code : 'USD',
        limit : null,
        unofficial_currency_code : null,
      },
      transactions: [
        ...
      ],
    },
  });
```

### Create Teller Verification

```jsx
const verification = await method
  .accounts('acc_b9q2XVAnNFbp3')
  .verification
  .create({
    type: 'teller',
    teller: {
      balances: {
        account_id: 'acc_ns9gkibeia6ad0rr6s00q',
        available: '93011.13',
        ledger: '93011.13',
        links: {
          account: 'https://api.teller.io/accounts/acc_ns9gkibeia6ad0rr6s00q',
          self: 'https://api.teller.io/accounts/acc_ns9gkibeia6ad0rr6s00q/balances'
        },
      },
      transactions: [
        {
          account_id: 'acc_ns9gkia42a6ad0rr6s000',
          amount: '-51.19',
          date: '2022-01-04',
          description: 'Venmo Payment',
          details: {
            category: 'services',
            counterparty: {
              name: 'LOUISE BENTLEY',
              type: 'person',
            },
            processing_status: 'complete',
          },
          id: 'txn_ns9gkiph2a6ad0rr6s000',
          links: {
            account: 'https://api.teller.io/accounts/acc_ns9gkia42a6ad0rr6s000',
            self: 'https://api.teller.io/accounts/acc_ns9gkia42a6ad0rr6s000/transactions/txn_ns9gkiph2a6ad0rr6s000',
          },
          running_balance: null,
          status: 'pending',
          type: 'digital_payment',
        },
      ],
    },
  });
```

### Create MX Verification

```jsx
const verification = await method
  .accounts('acc_b9q2XVAnNFbp3')
  .verification
  .create({
    type: 'mx',
    mx: {
      account : {
        institution_code: 'chase',
        guid: 'ACT-06d7f44b-caae-0f6e-1384-01f52e75dcb1',
        account_number: null,
        apr: null,
        apy: null,
        available_balance: 1000.23,
        available_credit: null,
        balance: 1000.23,
        cash_balance: 1000.32,
        cash_surrender_value: 1000.23,
        created_at: '2016-10-13T17:57:37+00:00',
        ...
      },
      transactions: [
        ...
      ],
    },  
  );
```

### Update Verification

```jsx
const verification = await method
  .accounts('acc_b9q2XVAnNFbp3')
  .verification
  .update({
    micro_deposits: {
      amounts: [10, 4],
    },
  });
```

### Retrieve Verification

```jsx
const verification = await method
  .accounts('acc_b9q2XVAnNFbp3')
  .verification
  .get();
```

## Merchants 

### List Merchants

```jsx
const merchants = await method.merchants.list();
```

### Retrieve Merchant

```jsx
const merchant = await method.merchants.get('mch_1');
```

## Payments

### Create Payment
```jsx
const payment = await method.payments.create({
  amount: 5000,
  source: 'acc_JMJZT6r7iHi8e',
  destination: 'acc_AXthnzpBnxxWP',
  description: 'Loan Pmt',
});
```

### Retrieve Payment

```jsx
const payment = await method.payments.get('pmt_rPrDPEwyCVUcm');
```

### Delete Payment

```jsx
const payment = await method.payments.delete('pmt_rPrDPEwyCVUcm');
```

### List Payments

```jsx
const payments = await method.payments.list();
```

## Reversals

### Retrieve Reversal

```jsx
const reversal = await method.payments('pmt_rPrDPEwyCVUcm').reversals.get('rvs_eaBAUJtetgMdR');
```

### Update Reversal

```jsx
const reversal = await method
  .payments('pmt_rPrDPEwyCVUcm')
  .reversals
  .update('rvs_eaBAUJtetgMdR', { status: 'pending' });
```

### List Reversals for Payment

```jsx
const reversals = await method.payments('pmt_rPrDPEwyCVUcm').reversals.list();
```

## Webhooks

### Create Webhook

```jsx
const webhook = await method.webhooks.create({
  type: 'payment.update',
  url: 'https://api.example.app/webhook',
  auth_token: 'md7UqcTSmvXCBzPORDwOkE',
});
```

### Retrieve Webhook

```jsx
const webhook = await method.webhooks.get('whk_cSGjA6d9N8y8R');
```

### Delete Webhoook

```jsx
const webhook = await method.webhooks.delete('whk_cSGjA6d9N8y8R');
```

### List Webhooks

```jsx
const webhooks = await method.webhooks.list();
```

## Reports

### Create Report

```jsx
const report = await method.reports.create({ type: 'payments.created.current' });
```

### Retrieve Report

```jsx
const report = await method.reports.get('rpt_cj2mkA3hFyHT5');
```

### Download Report

```jsx
const reportCSV = await method.reports.download('rpt_cj2mkA3hFyHT5');
```

## Connections

### List Connections

```jsx
const connections = await method.connections.list();
```

### Retrieve Connection

```jsx
const connection = await method.connections.get('cxn_iENwAPKnNqA5j');
```

### Update Connection

```jsx
const connection = await method.connections.update('cxn_iENwAPKnNqA5j', { status: 'syncing' });
```