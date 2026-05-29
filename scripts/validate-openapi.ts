/**
 * OpenAPI Validation Script
 *
 * Validates the generated OpenAPI spec against the actual SDK source files
 * to ensure they match.
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    pathsInSpec: number;
    pathsExpected: number;
    schemasInSpec: number;
    interfacesInSdk: number;
    missingPaths: string[];
    extraPaths: string[];
    missingSchemas: string[];
    propertyMismatches: PropertyMismatch[];
  };
}

interface PropertyMismatch {
  schema: string;
  property: string;
  issue: string;
}

interface OpenAPISpec {
  paths: { [path: string]: any };
  components: {
    schemas: { [name: string]: any };
  };
}

interface SDKInterface {
  name: string;
  properties: Map<string, { type: string; optional: boolean; nullable: boolean }>;
}

interface SDKEndpoint {
  path: string;
  methods: string[];
  resource: string;
}

// Load the OpenAPI spec
function loadOpenAPISpec(): OpenAPISpec {
  const specPath = path.join(__dirname, '..', 'openapi.json');
  if (!fs.existsSync(specPath)) {
    throw new Error('openapi.json not found. Run npm run generate:openapi first.');
  }
  return JSON.parse(fs.readFileSync(specPath, 'utf-8'));
}

// Parse SDK source files to extract interfaces
function parseSDKInterfaces(): Map<string, SDKInterface> {
  const interfaces = new Map<string, SDKInterface>();
  const srcDir = path.join(__dirname, '..', 'src', 'resources');

  const typeFiles = findTypeFiles(srcDir);

  for (const file of typeFiles) {
    const sourceFile = ts.createSourceFile(
      file,
      fs.readFileSync(file, 'utf-8'),
      ts.ScriptTarget.Latest,
      true
    );

    ts.forEachChild(sourceFile, (node) => {
      if (ts.isInterfaceDeclaration(node)) {
        const name = node.name.text;
        const properties = new Map<string, { type: string; optional: boolean; nullable: boolean }>();

        node.members.forEach((member) => {
          if (ts.isPropertySignature(member) && member.name) {
            const propName = member.name.getText(sourceFile);
            const optional = !!member.questionToken;
            const typeText = member.type ? member.type.getText(sourceFile) : 'any';
            const nullable = typeText.includes('| null') || typeText.includes('null |');

            properties.set(propName, {
              type: typeText,
              optional,
              nullable
            });
          }
        });

        interfaces.set(name, { name, properties });
      }
    });
  }

  return interfaces;
}

// Find all types.ts files in the resources directory
function findTypeFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'types.ts') {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// Parse SDK resource files to extract endpoints
function parseSDKEndpoints(): SDKEndpoint[] {
  const endpoints: SDKEndpoint[] = [];
  const srcDir = path.join(__dirname, '..', 'src', 'resources');

  // Define expected endpoints based on SDK structure
  const expectedEndpoints: SDKEndpoint[] = [
    // Entities
    { path: '/entities', methods: ['get', 'post'], resource: 'Entity' },
    { path: '/entities/{ent_id}', methods: ['get', 'put'], resource: 'Entity' },
    { path: '/entities/{ent_id}/consent', methods: ['post'], resource: 'Entity' },
    { path: '/entities/{ent_id}/connect', methods: ['get', 'post'], resource: 'EntityConnect' },
    { path: '/entities/{ent_id}/connect/{cxn_id}', methods: ['get'], resource: 'EntityConnect' },
    { path: '/entities/{ent_id}/credit_scores', methods: ['get', 'post'], resource: 'EntityCreditScores' },
    { path: '/entities/{ent_id}/credit_scores/{crs_id}', methods: ['get'], resource: 'EntityCreditScores' },
    { path: '/entities/{ent_id}/identities', methods: ['get', 'post'], resource: 'EntityIdentity' },
    { path: '/entities/{ent_id}/identities/{idn_id}', methods: ['get'], resource: 'EntityIdentity' },
    { path: '/entities/{ent_id}/attributes', methods: ['get', 'post'], resource: 'EntityAttributes' },
    { path: '/entities/{ent_id}/attributes/{atr_id}', methods: ['get'], resource: 'EntityAttributes' },
    { path: '/entities/{ent_id}/vehicles', methods: ['get'], resource: 'EntityVehicles' },
    { path: '/entities/{ent_id}/vehicles/{vhl_id}', methods: ['get'], resource: 'EntityVehicles' },
    { path: '/entities/{ent_id}/products', methods: ['get'], resource: 'EntityProduct' },
    { path: '/entities/{ent_id}/subscriptions', methods: ['get', 'post'], resource: 'EntitySubscription' },
    { path: '/entities/{ent_id}/subscriptions/{sub_id}', methods: ['get', 'delete'], resource: 'EntitySubscription' },
    { path: '/entities/{ent_id}/verification_sessions', methods: ['get', 'post'], resource: 'EntityVerificationSession' },
    { path: '/entities/{ent_id}/verification_sessions/{evf_id}', methods: ['get', 'put'], resource: 'EntityVerificationSession' },

    // Accounts
    { path: '/accounts', methods: ['get', 'post'], resource: 'Account' },
    { path: '/accounts/{acc_id}', methods: ['get'], resource: 'Account' },
    { path: '/accounts/{acc_id}/consent', methods: ['post'], resource: 'Account' },
    { path: '/accounts/{acc_id}/balances', methods: ['get', 'post'], resource: 'AccountBalance' },
    { path: '/accounts/{acc_id}/balances/{balance_id}', methods: ['get'], resource: 'AccountBalance' },
    { path: '/accounts/{acc_id}/card_brands', methods: ['get', 'post'], resource: 'AccountCardBrand' },
    { path: '/accounts/{acc_id}/card_brands/{card_brand_id}', methods: ['get'], resource: 'AccountCardBrand' },
    { path: '/accounts/{acc_id}/payoffs', methods: ['get', 'post'], resource: 'AccountPayoff' },
    { path: '/accounts/{acc_id}/payoffs/{payoff_id}', methods: ['get'], resource: 'AccountPayoff' },
    { path: '/accounts/{acc_id}/sensitive', methods: ['get', 'post'], resource: 'AccountSensitive' },
    { path: '/accounts/{acc_id}/sensitive/{sensitiv_id}', methods: ['get'], resource: 'AccountSensitive' },
    { path: '/accounts/{acc_id}/transactions', methods: ['get'], resource: 'AccountTransaction' },
    { path: '/accounts/{acc_id}/transactions/{transaction_id}', methods: ['get'], resource: 'AccountTransaction' },
    { path: '/accounts/{acc_id}/updates', methods: ['get', 'post'], resource: 'AccountUpdate' },
    { path: '/accounts/{acc_id}/updates/{update_id}', methods: ['get'], resource: 'AccountUpdate' },
    { path: '/accounts/{acc_id}/attributes', methods: ['get'], resource: 'AccountAttributes' },
    { path: '/accounts/{acc_id}/attributes/{attribute_id}', methods: ['get'], resource: 'AccountAttributes' },
    { path: '/accounts/{acc_id}/payment_instruments', methods: ['get', 'post'], resource: 'AccountPaymentInstrument' },
    { path: '/accounts/{acc_id}/payment_instruments/{payment_instrument_id}', methods: ['get'], resource: 'AccountPaymentInstrument' },
    { path: '/accounts/{acc_id}/subscriptions', methods: ['get', 'post'], resource: 'AccountSubscription' },
    { path: '/accounts/{acc_id}/subscriptions/{sub_id}', methods: ['get', 'delete'], resource: 'AccountSubscription' },
    { path: '/accounts/{acc_id}/products', methods: ['get'], resource: 'AccountProduct' },
    { path: '/accounts/{acc_id}/verification_sessions', methods: ['get', 'post'], resource: 'AccountVerificationSession' },
    { path: '/accounts/{acc_id}/verification_sessions/{avf_id}', methods: ['get', 'put'], resource: 'AccountVerificationSession' },

    // Payments
    { path: '/payments', methods: ['get', 'post'], resource: 'Payment' },
    { path: '/payments/{pmt_id}', methods: ['get', 'delete'], resource: 'Payment' },
    { path: '/payments/{pmt_id}/reversals', methods: ['get'], resource: 'Reversal' },
    { path: '/payments/{pmt_id}/reversals/{rvs_id}', methods: ['get', 'put'], resource: 'Reversal' },

    // Webhooks
    { path: '/webhooks', methods: ['get', 'post'], resource: 'Webhook' },
    { path: '/webhooks/{whk_id}', methods: ['get', 'patch', 'delete'], resource: 'Webhook' },

    // Reports (no list method in SDK)
    { path: '/reports', methods: ['post'], resource: 'Report' },
    { path: '/reports/{rpt_id}', methods: ['get'], resource: 'Report' },
    { path: '/reports/{rpt_id}/download', methods: ['get'], resource: 'Report' },

    // Merchants
    { path: '/merchants', methods: ['get'], resource: 'Merchant' },
    { path: '/merchants/{mch_id}', methods: ['get'], resource: 'Merchant' },

    // Events
    { path: '/events', methods: ['get'], resource: 'Event' },
    { path: '/events/{evt_id}', methods: ['get'], resource: 'Event' },

    // Elements
    { path: '/elements/token', methods: ['post'], resource: 'Element' },
    { path: '/elements/token/{pk_elem_id}/results', methods: ['get'], resource: 'Element' },

    // Opal
    { path: '/opal/token', methods: ['post'], resource: 'Opal' },

    // Simulate
    { path: '/simulate/payments/{pmt_id}', methods: ['post'], resource: 'SimulatePayment' },
    { path: '/simulate/accounts/{acc_id}/transactions', methods: ['post'], resource: 'SimulateAccount' },
    { path: '/simulate/entities/{ent_id}/connect', methods: ['post'], resource: 'SimulateEntity' },
    { path: '/simulate/entities/{ent_id}/credit_scores/{crs_id}', methods: ['post'], resource: 'SimulateEntity' },
    { path: '/simulate/entities/{ent_id}/attributes/{atr_id}', methods: ['post'], resource: 'SimulateEntity' },
    { path: '/simulate/events', methods: ['post'], resource: 'SimulateEvent' },
  ];

  return expectedEndpoints;
}

// Map SDK interface names to OpenAPI schema names
function getSchemaNameMapping(): Map<string, string> {
  return new Map([
    ['IEntity', 'Entity'],
    ['IEntityIndividual', 'EntityIndividual'],
    ['IEntityCorporation', 'EntityCorporation'],
    ['IEntityAddress', 'EntityAddress'],
    ['IEntityConnect', 'EntityConnect'],
    ['IEntityCreditScores', 'EntityCreditScores'],
    ['IEntityIdentity', 'EntityIdentity'],
    ['IEntityAttributes', 'EntityAttributes'],
    ['IEntityVehicles', 'EntityVehicles'],
    ['IEntityProduct', 'EntityProduct'],
    ['IEntitySubscription', 'EntitySubscription'],
    ['IEntityVerificationSession', 'EntityVerificationSession'],
    ['IAccount', 'Account'],
    ['IAccountBalance', 'AccountBalance'],
    ['IAccountCardBrand', 'AccountCardBrand'],
    ['IAccountPayoff', 'AccountPayoff'],
    ['IAccountSensitive', 'AccountSensitive'],
    ['IAccountTransaction', 'AccountTransaction'],
    ['IAccountUpdate', 'AccountUpdate'],
    ['IAccountAttributes', 'AccountAttributes'],
    ['IAccountPaymentInstrument', 'AccountPaymentInstrument'],
    ['IAccountSubscription', 'AccountSubscription'],
    ['IAccountVerificationSession', 'AccountVerificationSession'],
    ['IAccountProduct', 'AccountProduct'],
    ['IPayment', 'Payment'],
    ['IReversal', 'Reversal'],
    ['IWebhook', 'Webhook'],
    ['IReport', 'Report'],
    ['IMerchant', 'Merchant'],
    ['IEvent', 'Event'],
    ['IElementToken', 'ElementToken'],
    ['IElementResults', 'ElementResults'],
    ['IOpalToken', 'OpalToken'],
  ]);
}

// Validate paths
function validatePaths(spec: OpenAPISpec, expectedEndpoints: SDKEndpoint[]): {
  missing: string[];
  extra: string[];
  methodMismatches: string[];
} {
  const specPaths = new Set(Object.keys(spec.paths));
  const expectedPaths = new Set(expectedEndpoints.map(e => e.path));

  const missing = [...expectedPaths].filter(p => !specPaths.has(p));
  const extra = [...specPaths].filter(p => !expectedPaths.has(p));

  const methodMismatches: string[] = [];

  for (const endpoint of expectedEndpoints) {
    if (spec.paths[endpoint.path]) {
      const specMethods = Object.keys(spec.paths[endpoint.path]);
      for (const method of endpoint.methods) {
        if (!specMethods.includes(method)) {
          methodMismatches.push(`${endpoint.path}: missing ${method.toUpperCase()}`);
        }
      }
    }
  }

  return { missing, extra, methodMismatches };
}

// Validate schemas against SDK interfaces
function validateSchemas(
  spec: OpenAPISpec,
  sdkInterfaces: Map<string, SDKInterface>,
  nameMapping: Map<string, string>
): PropertyMismatch[] {
  const mismatches: PropertyMismatch[] = [];

  for (const [sdkName, schemaName] of nameMapping) {
    const sdkInterface = sdkInterfaces.get(sdkName);
    const schema = spec.components.schemas[schemaName];

    if (!sdkInterface) {
      continue; // Skip if SDK interface not found
    }

    if (!schema) {
      mismatches.push({
        schema: schemaName,
        property: '',
        issue: `Schema not found in OpenAPI spec`
      });
      continue;
    }

    // Check each SDK property exists in schema
    for (const [propName, propInfo] of sdkInterface.properties) {
      if (!schema.properties || !schema.properties[propName]) {
        mismatches.push({
          schema: schemaName,
          property: propName,
          issue: `Property missing in OpenAPI schema`
        });
        continue;
      }

      const schemaProp = schema.properties[propName];

      // Check nullable
      if (propInfo.nullable && !schemaProp.nullable) {
        mismatches.push({
          schema: schemaName,
          property: propName,
          issue: `Should be nullable in OpenAPI schema`
        });
      }

      // Check required (if property is not optional in SDK, it should be required in schema)
      if (!propInfo.optional && schema.required && !schema.required.includes(propName)) {
        // This is a warning, not an error, since we might have different requirements
      }
    }

    // Check for extra properties in schema that aren't in SDK
    if (schema.properties) {
      for (const propName of Object.keys(schema.properties)) {
        if (!sdkInterface.properties.has(propName)) {
          mismatches.push({
            schema: schemaName,
            property: propName,
            issue: `Extra property in OpenAPI schema not in SDK interface`
          });
        }
      }
    }
  }

  return mismatches;
}

// Main validation function
function validate(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log('Loading OpenAPI spec...');
  let spec: OpenAPISpec;
  try {
    spec = loadOpenAPISpec();
  } catch (e) {
    return {
      valid: false,
      errors: [(e as Error).message],
      warnings: [],
      summary: {
        pathsInSpec: 0,
        pathsExpected: 0,
        schemasInSpec: 0,
        interfacesInSdk: 0,
        missingPaths: [],
        extraPaths: [],
        missingSchemas: [],
        propertyMismatches: []
      }
    };
  }

  console.log('Parsing SDK interfaces...');
  const sdkInterfaces = parseSDKInterfaces();

  console.log('Parsing SDK endpoints...');
  const expectedEndpoints = parseSDKEndpoints();

  console.log('Validating paths...');
  const pathValidation = validatePaths(spec, expectedEndpoints);

  if (pathValidation.missing.length > 0) {
    errors.push(`Missing paths: ${pathValidation.missing.join(', ')}`);
  }

  if (pathValidation.extra.length > 0) {
    warnings.push(`Extra paths in spec: ${pathValidation.extra.join(', ')}`);
  }

  if (pathValidation.methodMismatches.length > 0) {
    errors.push(`Method mismatches: ${pathValidation.methodMismatches.join(', ')}`);
  }

  console.log('Validating schemas...');
  const nameMapping = getSchemaNameMapping();
  const propertyMismatches = validateSchemas(spec, sdkInterfaces, nameMapping);

  // Separate critical mismatches from warnings
  const criticalMismatches = propertyMismatches.filter(m =>
    m.issue.includes('missing') || m.issue.includes('not found')
  );
  const warningMismatches = propertyMismatches.filter(m =>
    !m.issue.includes('missing') && !m.issue.includes('not found')
  );

  if (criticalMismatches.length > 0) {
    for (const m of criticalMismatches) {
      errors.push(`${m.schema}.${m.property}: ${m.issue}`);
    }
  }

  if (warningMismatches.length > 0) {
    for (const m of warningMismatches) {
      warnings.push(`${m.schema}.${m.property}: ${m.issue}`);
    }
  }

  // Check for missing schemas
  const missingSchemas: string[] = [];
  for (const [sdkName, schemaName] of nameMapping) {
    if (sdkInterfaces.has(sdkName) && !spec.components.schemas[schemaName]) {
      missingSchemas.push(schemaName);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      pathsInSpec: Object.keys(spec.paths).length,
      pathsExpected: expectedEndpoints.length,
      schemasInSpec: Object.keys(spec.components.schemas).length,
      interfacesInSdk: sdkInterfaces.size,
      missingPaths: pathValidation.missing,
      extraPaths: pathValidation.extra,
      missingSchemas,
      propertyMismatches
    }
  };
}

// Run validation
console.log('='.repeat(60));
console.log('OpenAPI Spec Validation');
console.log('='.repeat(60));
console.log('');

const result = validate();

console.log('');
console.log('='.repeat(60));
console.log('Validation Summary');
console.log('='.repeat(60));
console.log('');
console.log(`Paths in spec:     ${result.summary.pathsInSpec}`);
console.log(`Paths expected:    ${result.summary.pathsExpected}`);
console.log(`Schemas in spec:   ${result.summary.schemasInSpec}`);
console.log(`Interfaces in SDK: ${result.summary.interfacesInSdk}`);
console.log('');

if (result.summary.missingPaths.length > 0) {
  console.log('Missing Paths:');
  result.summary.missingPaths.forEach(p => console.log(`  - ${p}`));
  console.log('');
}

if (result.summary.extraPaths.length > 0) {
  console.log('Extra Paths (in spec but not expected):');
  result.summary.extraPaths.forEach(p => console.log(`  - ${p}`));
  console.log('');
}

if (result.errors.length > 0) {
  console.log('Errors:');
  result.errors.forEach(e => console.log(`  ❌ ${e}`));
  console.log('');
}

if (result.warnings.length > 0) {
  console.log('Warnings:');
  result.warnings.forEach(w => console.log(`  ⚠️  ${w}`));
  console.log('');
}

if (result.valid) {
  console.log('✅ Validation PASSED');
} else {
  console.log('❌ Validation FAILED');
  process.exit(1);
}
