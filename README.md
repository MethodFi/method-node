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

Entities are a representation of your application’s end-users (individuals or corporation). Throughout Method’s ecosystem, an Entity is the legal owner of an account, and is the primary object for many of Method’s API endpoints.

> Entities should be persisted with a 1:1 relationship throughout the lifecycle of your end-user.

### PII Requirements

Entity PII requirements are pre-defined during onboarding based on your team’s specific use case. Entities require at a minimum name + phone number for most services. Some Products and Subscriptions may require additional information to be provided to Method to enable certain features. Contact your Method CSM for more information.

### Core Methods

#### Create Individual Entity

```jsx
const entity = await method.entities.create({
  type: "individual",
  individual: {
    first_name: "Kevin",
    last_name: "Doyle",
    phone: "+16505555555",
    email: "kevin.doyle@gmail.com",
    dob: "1997-03-18",
  },
  address: {
    line1: "3300 N Interstate 35",
    line2: null,
    city: "Austin",
    state: "TX",
    zip: "78705",
  },
});
```

#### Create Corporation Entity

```jsx
const entity = await method.entities.create({
  type: 'corporation',
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

#### Retrieve Entity

```jsx
const entity = await method.entities.retrieve('ent_au22b1fbFJbp8');
```

#### Update Entity

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

#### List Entities

```jsx
const entities = await method.entities.list();
```

#### Withdraw an Entity's consent

```jsx
const entity = await method.entities.withdrawConsent('ent_au22b1fbFJbp8');
```

### Connect

The Connect endpoint identifies & connects all the liability accounts (e.g. Credit Card, Mortgage, Auto Loans, Student Loans, etc.) for an Entity across Method’s network of 1500+ FI / Lenders.

#### Create a Connect

```jsx
const entity = await method
  .entities("ent_qKNBB68bfHGNA")
  .connect
  .create();
```

#### Retrieve a Connect

```jsx
const entity = await method
  .entities("ent_qKNBB68bfHGNA")
  .connect
  .retrieve("cxn_4ewMmBbjYDMR4");
```

### Entity Verification Sessions

The Entity Verification Sessions manages phone and identity verification sessions for Entities. Entities need to verify their identity and/or phone in order for them to be used throughout the Method API.
​
####Verification Requirements

Entity verification requirements differ on a team-by-team basis. A team’s unique verification process is pre-defined during onboarding based on your team’s specific use case. Contact your Method CSM for more information.

The method key in entity.verification object will enumerate the phone & identity verifications available for your Entity. Refer to the Entity Object.

>Any Entity Verification Session will expire 10 minutes after creation. If the verification is not completed within that time limit, another verification session will need to be created.

#### Retrieve a Verification Session

```jsx
const response = await method
  .entities("ent_au22b1fbFJbp8")
  .verificationSessions
  .retrieve("evf_qTNNzCQ63zHJ9");
```

#### Create a BYO KYC Verification

```jsx
const response = await method
  .entities("ent_XgYkTdiHyaz3e")
  .verificationSessions
  .create({
    type: "identity",
    method: "byo_kyc",
    byo_kyc: {},
  });
```

#### Create a KBA Verification

```jsx
const response = await method
  .entities("ent_hy3xhPDfWDVxi")
  .verificationSessions
  .create({
    type: "identity",
    method: "kba",
    kba: {},
  });
```

#### Update a KBA Verification

```jsx
const response = await method
  .entities("ent_hy3xhPDfWDVxi")
  .verificationSessions
  .update("evf_ywizPrR6WDxDG", {
    type: "identity",
    method: "kba",
    kba: {
      answers: [
        {
          question_id: "qtn_xgP6cGhq34fHW",
          answer_id: "ans_dbKCwDGwrrBgi"
        },
        {
          question_id: "qtn_kmfdEftQ9zc6T",
          answer_id: "ans_LXN83xnJAUNFb"
        },
        {
          question_id: "qtn_6mWegPLBpAFxb",
          answer_id: "ans_EKi47D8wA6YN3"
        }
      ]
    }
  });
```

#### Create a BYO SMS Verification

```jsx
const response = await method
  .entities("ent_XgYkTdiHyaz3e")
  .verificationSessions
  .create({
    type: "phone",
    method: "byo_sms",
    byo_sms: {
      timestamp: "2023-12-28T14:35:15.816Z",
    },
  });
```

#### Create a SMS Verification

```jsx
const response = await method
  .entities("ent_au22b1fbFJbp8")
  .verificationSessions
  .create({
    type: "phone",
    method: "sms",
    sms: {},
  });
```

#### Update a SMS Verification

```jsx
const response = await method
  .entities("ent_au22b1fbFJbp8")
  .verificationSessions
  .update("evf_3VT3bHTCnPbrm", {
    type: "phone",
    method: "sms",
    sms: { sms_code: "884134" },
  });
```

#### Create a SNA Verification

```jsx
const response = await method
  .entities("ent_au22b1fbFJbp8")
  .verificationSessions
  .create({
    type: "phone",
    method: "sna",
    sna: {},
  });
```

#### Update a SNA Verification

```jsx
const response = await method
  .entities("ent_BYdNCVApmp7Gx")
  .verificationSessions
  .update("evf_qTNNzCQ63zHJ9", {
    type: "phone",
    method: "sna",
    sna: {},
  });
```

### Credit Scores

The Credit Score endpoint returns the latest credit score and score factors for an Entity.

#### Create Individual Credit Scores

```jsx
const entity = await method
  .entities('ent_au22b1fbFJbp8')
  .creditScores
  .create();
```

#### Retrieve Individual Credit Scores

```jsx
const entity = await method
  .entities('ent_au22b1fbFJbp8')
  .creditScores
  .retrieve('crs_pn4ca33GXFaCE');
```

### Identities

The identities endpoint is used to retrieve the underlying identity (PII) of an Entity. The Identity endpoint requires an Entity to have at least a name and phone number.

For an active entity or entities with a matched identity (verification.identity.matched) the identity endpoint will return a single identity with the PII.

For all other entities the identity endpoint could return multiple identities as the provided PII was not enough to disambiguate and match a single identity.

>The Identity endpoint is restricted to most teams. Contact your Method CSM for more information.

#### Create Identities

```jsx
const entity = await method
  .entities("ent_au22b1fbFJbp8")
  .identities
  .create();
```

#### Retrieve Identities

```jsx
const entity = await method
  .entities('ent_au22b1fbFJbp8')
  .identities
  .retrieve('idn_NhTRUVEknYaFM');
```

### Entity Products

The Entity Products endpoint outlines the Products (capabilities) an Entity has access to, and provides an overview of the status of all the Products.

>Access to most products requires an Entity to be active. However, some products have restricted access requiring team-by-team enablement.

#### List all Products

```jsx
const response = await method
  .entities('ent_TYHMaRJUUeJ7U')
  .products
  .list();
```

#### Retrieve a Product

```jsx
const response = await method
  .entities("ent_TYHMaRJUUeJ7U")
  .products
  .retrieve("prd_jPRDcQPMk43Ek");
```

### Entity Subscriptions

The Entity Subscriptions endpoint controls the state of all Subscriptions for an Entity.

Subscriptions are Products that can provide continuous updates via Webhooks. (e.g. Credit Score Subscription provides updates on an Entity’s credit score)

>Most subscriptions are accessible by default. However, some subscriptions have restricted access requiring team-by-team enablement and elevated account verification.

#### Create a Subscription

```jsx
const response = await method
  .entities("ent_TYHMaRJUUeJ7U")
  .subscriptions
  .create('credit_score');
```

#### List all Subscriptions

```jsx
const response = await method
  .entities('ent_TYHMaRJUUeJ7U')
  .subscriptions
  .list();
```

#### Retrieve a Subscription

```jsx
const response = await method
  .entities("ent_TYHMaRJUUeJ7U")
  .subscriptions
  .retrieve("sub_6f7XtMLymQx3f");
```

#### Delete a Subscription

```jsx
const response = await method
  .entities('ent_TYHMaRJUUeJ7U')
  .subscriptions
  .delete('sub_6f7XtMLymQx3f');
```

## Accounts

Accounts are a representation of an Entity’s financial accounts. An Account can be a checking or savings account (ACH) or a credit card, student loan, mortgage, personal loan, etc. (Liability).

### Core

#### Create Ach Account

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

#### Create Liability Account

```jsx
const account = await method.accounts.create({
  holder_id: 'ent_au22b1fbFJbp8',
  liability: {
    mch_id: 'mch_2',
    account_number: '1122334455',
  }
});
```

#### Retrieve Account

```jsx
const account = await method.accounts.retrieve('acc_Zc4F2aTLt8CBt');
```

#### List Accounts

```jsx
const accounts = await method.accounts.list();
```

#### Withdraw an Account's consent

```jsx
const account = await method.accounts.withdrawConsent('acc_yVf3mkzbhz9tj');
```

### Updates

The Updates endpoint retrieves in real-time account data including Balance, due dates, APRs, directly from the Account’s financial institution.

#### Create an Update

```jsx
const response = await method
  .accounts('acc_aEBDiLxiR8bqc')
  .updates
  .create();
```

#### List all Updates

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .updates
  .list();
```

#### Retrieve an Update

```jsx
const response = await method
  .accounts('acc_aEBDiLxiR8bqc')
  .updates
  .retrieve('upt_NYV5kfjskTTCJ');
```

### Transactions

The Transactions endpoint retrieves real-time transaction (authorization, clearing, etc) notifications for Credit Card Accounts directly from the card networks.

>Subscription to Transactions is required before receiving transactional data for an account

#### List all Transactions

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .transactions
  .list({
    from_date: '2024-03-13',
    to_date: '2024-03-15',
  });
```

#### Retrieve a Transaction

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .transactions
  .retrieve('txn_aRrDMAmEAtHti');
```

### Card Brand

The CardBrand endpoint retrieves the associated credit card metadata (Product / Brand Name, Art, etc) directly from the card issuer.

#### Create a Card Brand

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .cardBrands
  .create();
```

#### Retrieve a Card Brand

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .cardBrands
  .retrieve('cbrd_eVMDNUPfrFk3e');
```

### Payoffs

The Payoffs endpoint retrieves a payoff quote in real-time from the Account’s financial institution / lender.

>Payoffs are currently only available for Auto Loan accounts

#### Create a Payoff

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .payoffs
  .create();
```

#### List all Payoffs

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .payoffs
  .list();
```

#### Retrieve a Payoff

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .payoffs
  .retrieve('pyf_ELGT4hfikTTCJ');
```

### Balances

The Balance endpoint retrieves the real-time balance from the Account’s financial institution.

#### Create a Balance

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .balances
  .create();
```

#### List all Balances

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .balances
  .list();
```

#### Retrieve a Balance

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .balances
  .retrieve('bal_ebzh8KaR9HCBG');
```

### Account Sensitive

The Sensitive endpoint returns underlying sensitive Account information (e.g. PAN, CVV, account number). This product is only available for Liabilities.

>The Sensitive endpoint is restricted to most teams, and requires PCI compliance to access. Contact your Method CSM for more information.

#### Create a Sensitive

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .sensitive
  .create({
    expand: [
      'credit_card.number',
      'credit_card.exp_month',
      'credit_card.exp_year',
      'credit_card.cvv'
    ],
  });
```

#### Retrieve a Sensitive

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .sensitive
  .retrieve('astv_9WBBA6TH7n7iX');
```

### Account Products

The Account Products endpoint outlines the Products (capabilities) an Account has access to, and provides an overview of the status of all the Products.

>Most products are accessible by default. However, some products have restricted access requiring team-by-team enablement and elevated account verification.

#### List all Products

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .products
  .list();
```

#### Retrieve a Product

```jsx
const response = await method
  .accounts("acc_yVf3mkzbhz9tj")
  .products
  .retrieve("prd_FQFHqVNiCRb7J");
```
### Account Subscriptions

The Account Subscriptions endpoint controls the state of all Subscriptions for an Account.

Subscriptions are Products that can provide continuous updates via Webhooks. (e.g. Transaction Subscription provides real-time updates on a Credit Card’s transactions)

>Most subscriptions are accessible by default. However, some subscriptions have restricted access requiring team-by-team enablement and elevated account verification.

#### Create a Subscription

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .subscriptions
  .create('update');
```

#### List all Subscriptions

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .subscriptions
  .list();
```

#### Retrieve a Subscription

```jsx
const response = await method
  .accounts("acc_yVf3mkzbhz9tj")
  .subscriptions
  .retrieve("sub_P8c4bjj6xajxF");
```

#### Delete a Subscription

```jsx
const response = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .subscriptions
  .delete('sub_xM4VcfRWcJP8D');
```

### Account Verification Sessions

The account verification manages required verification to enable products for ACH or Liability accounts.

For example, ACH Accounts require a verified AccountVerificationSession before they can be used as a source for Payments.

#### Create Verification

```jsx
const verification = await method
  .accounts('acc_b9q2XVAnNFbp3')
  .verificationSessions
  .create({ type: '<verification session type>' });
```

#### Update Micro Deposits Verification

```jsx
const verification = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .verificationSessions
  .update('avf_yBQQNKmjRBTqF', {
    micro_deposits: {
      amounts: [10, 34]
    }
  });
```

#### Update Plaid Verification

```jsx
const verification = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .verificationSessions
  .update('avf_DjkdemgTQfqRD', {
    plaid: {
      balances: {
        available: 100,
        current: 110,
        iso_currency_code: 'USD',
        limit: null,
        unofficial_currency_code: null
      },
      transactions: [
        ...
      ]
    }
  });
```

#### Update Teller Verification

```jsx
const verification = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .verificationSessions
  .update('avf_DjkdemgTQfqRD', {
    teller: {
      balances: {
        account_id: 'acc_ns9gkibeia6ad0rr6s00q',
        available: '93011.13',
        ledger: '93011.13',
        links: {
          account: 'https://reference.teller.io/accounts/acc_ns9gkibeia6ad0rr6s00q',
          self: 'https://reference.teller.io/accounts/acc_ns9gkibeia6ad0rr6s00q/balances'
        }
      },
      transactions: [
        ...
      ]
    }
  });
```

#### Update MX Verification

```jsx
const verification = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .verificationSessions
  .update('avf_DjkdemgTQfqRD', {
    mx: {
      account: {
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
      ]
    }
  });
```

#### Update Standard Verification

```jsx
const verification = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .verificationSessions
  .update('avf_DjkdemgTQfqRD', {
    standard: {
      number: '4111111111111111',
    }
  });
```

#### Update Pre-auth Verification

```jsx
const verification = await method
  .accounts('acc_yVf3mkzbhz9tj')
  .verificationSessions
  .update('avf_DjkdemgTQfqRD', {
    pre_auth: {
      cvv: '031'
    }
  });
```

#### Retrieve Verification

```jsx
const verification = await method
  .accounts('acc_b9q2XVAnNFbp3')
  .verificationSessions
  .retrieve('avf_DjkdemgTQfqRD');
```

## Merchants

Merchants are resources that represent a specific type of liability for a financial institution. Method supports the majority of the financial institutions in the U.S.

>Financial institutions that offer multiple liability products are represented in Method as separate Merchants.

### Core

#### List Merchants

```jsx
const merchants = await method.merchants.list();
```

#### Retrieve Merchant

```jsx
const merchant = await method.merchants.retrieve('mch_1');
```

## Payments

A Payment is the transfer of funds from a source checking or savings bank account to a destination credit card, auto loan, mortgage, student loan, and more.

All Payments are processed electronically between the source and destination, and take 2-3 business days depending on the receiving financial institution.

### Core

#### Create Payment
```jsx
const payment = await method.payments.create({
  amount: 5000,
  source: 'acc_JMJZT6r7iHi8e',
  destination: 'acc_AXthnzpBnxxWP',
  description: 'Loan Pmt',
});
```

#### Retrieve Payment

```jsx
const payment = await method.payments.retrieve('pmt_rPrDPEwyCVUcm');
```

#### Delete Payment

```jsx
const payment = await method.payments.delete('pmt_rPrDPEwyCVUcm');
```

#### List Payments

```jsx
const payments = await method.payments.list();
```

### Reversals

#### Retrieve Reversal

```jsx
const reversal = await method.payments('pmt_rPrDPEwyCVUcm').reversals.retrieve('rvs_eaBAUJtetgMdR');
```

#### Update Reversal

```jsx
const reversal = await method
  .payments('pmt_rPrDPEwyCVUcm')
  .reversals
  .update('rvs_eaBAUJtetgMdR', { status: 'pending' });
```

#### List Reversals for Payment

```jsx
const reversals = await method.payments('pmt_rPrDPEwyCVUcm').reversals.list();
```

## Webhooks

Webhooks allow the Method API to notify your application when certain events occur.

To receive Webhook notifications, create a Webhook by registering a URL pointing to your application where triggered events should be sent to. This URL is where Method will send event information in an HTTPS POST request.

​
Handling webhooks
A Webhook event is considered successfully delivered when the corresponding URL endpoint responds with an HTTP status code of 200 within 5 seconds.

If the criteria is not met, Method will reattempt 4 more times with each new attempt being delayed according to an exponential backoff algorithm, where the delay period between each attempt exponentially increases.

>Webhooks that consistently fail to respond with a 200 will automatically be disabled.

### Core

#### Create Webhook

```jsx
const webhook = await method.webhooks.create({
  type: 'payment.update',
  url: 'https://api.example.app/webhook',
  auth_token: 'md7UqcTSmvXCBzPORDwOkE',
});
```

#### Retrieve Webhook

```jsx
const webhook = await method.webhooks.retrieve('whk_cSGjA6d9N8y8R');
```

#### Delete Webhoook

```jsx
const webhook = await method.webhooks.delete('whk_cSGjA6d9N8y8R');
```

#### List Webhooks

```jsx
const webhooks = await method.webhooks.list();
```

## Reports

Reports provide a filtered snapshot view of a specific resource. Method provides a fixed set of filters (Report Types) which include the following:

 - The resource to filter
 - The applied filter
 - The snapshot window

### Core

#### Create Report

```jsx
const report = await method.reports.create({ type: 'payments.created.current' });
```

#### Retrieve Report

```jsx
const report = await method.reports.retrieve('rpt_cj2mkA3hFyHT5');
```

#### Download Report

```jsx
const reportCSV = await method.reports.download('rpt_cj2mkA3hFyHT5');
```

## Simulations

To provide a seamless integration experience with Method in the development environment, you can simulate creations or updates for specific resources on-demand.

This ensures that your application handles all cases for multistep flows that would naturally occur in live environments (sandbox and production).

>Simulation endpoints are only accessible in the development environment. Attempts to access these endpoints in sandbox or production will result in a 403 Forbidden error.

### Core

#### Update a payment's status

```jsx
const payment = await method
  .simulate
  .payments
  .update('pmt_rPrDPEwyCVUcm', { status: 'processing' });
```

#### Create a Transaction

```jsx
const transaction = await method
  .simulate
  .accounts('acc_r6JUYN67HhCEM')
  .transactions
  .create();
```
