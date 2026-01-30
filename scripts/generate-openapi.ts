/**
 * OpenAPI Generator for Method SDK
 *
 * This script parses the TypeScript SDK source files and generates
 * an OpenAPI 3.0 specification that can be used with code generators
 * like openapi-generator to create clients in other languages.
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// ============================================================================
// Types for OpenAPI generation
// ============================================================================

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
  };
  servers: Array<{ url: string; description: string }>;
  tags?: Array<{ name: string; description: string }>;
  security: Array<{ [key: string]: string[] }>;
  paths: { [path: string]: PathItem };
  components: {
    schemas: { [name: string]: Schema };
    securitySchemes: { [name: string]: SecurityScheme };
  };
}

interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  patch?: Operation;
  delete?: Operation;
}

interface Operation {
  operationId: string;
  summary: string;
  description: string;
  tags: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: { [code: string]: Response };
}

interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header';
  required: boolean;
  schema: Schema;
  description?: string;
}

interface RequestBody {
  required: boolean;
  content: {
    'application/json': {
      schema: Schema;
    };
  };
}

interface Response {
  description: string;
  content?: {
    [contentType: string]: {
      schema: Schema;
    };
  };
}

interface Schema {
  type?: string;
  format?: string;
  $ref?: string;
  items?: Schema;
  properties?: { [name: string]: Schema };
  required?: string[];
  nullable?: boolean;
  enum?: (string | number)[];
  additionalProperties?: boolean | Schema;
  oneOf?: Schema[];
  allOf?: Schema[];
  description?: string;
}

interface SecurityScheme {
  type: string;
  scheme: string;
}

interface ParsedInterface {
  name: string;
  properties: ParsedProperty[];
  extends?: string[];
}

interface ParsedProperty {
  name: string;
  type: string;
  optional: boolean;
  nullable: boolean;
  description?: string;
}

interface ParsedEnum {
  name: string;
  values: string[];
  valueType: 'keys' | 'values';
}

interface ResourceEndpoint {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  operationId: string;
  summary: string;
  tags: string[];
  pathParams: string[];
  queryParams?: string;
  requestBody?: string;
  responseType: string;
  isList?: boolean;
}

// ============================================================================
// TypeScript Parser
// ============================================================================

class TypeScriptParser {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  private interfaces: Map<string, ParsedInterface> = new Map();
  private enums: Map<string, ParsedEnum> = new Map();
  private typeAliases: Map<string, string> = new Map();

  constructor(private srcDir: string) {
    const configPath = path.join(srcDir, '..', 'tsconfig.json');
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      path.dirname(configPath)
    );

    this.program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
    this.checker = this.program.getTypeChecker();
  }

  parse(): void {
    const sourceFiles = this.program.getSourceFiles().filter(
      sf => sf.fileName.includes(this.srcDir) && !sf.fileName.includes('node_modules')
    );

    for (const sourceFile of sourceFiles) {
      this.parseSourceFile(sourceFile);
    }
  }

  private parseSourceFile(sourceFile: ts.SourceFile): void {
    ts.forEachChild(sourceFile, node => {
      if (ts.isInterfaceDeclaration(node)) {
        this.parseInterface(node);
      } else if (ts.isVariableStatement(node)) {
        this.parseConstEnum(node);
      } else if (ts.isTypeAliasDeclaration(node)) {
        this.parseTypeAlias(node);
      }
    });
  }

  private parseInterface(node: ts.InterfaceDeclaration): void {
    const name = node.name.text;
    const properties: ParsedProperty[] = [];
    const extendsClause: string[] = [];

    if (node.heritageClauses) {
      for (const clause of node.heritageClauses) {
        for (const type of clause.types) {
          if (ts.isIdentifier(type.expression)) {
            extendsClause.push(type.expression.text);
          }
        }
      }
    }

    for (const member of node.members) {
      if (ts.isPropertySignature(member) && member.name) {
        const propName = ts.isIdentifier(member.name) ? member.name.text : '';
        const optional = !!member.questionToken;
        const typeStr = member.type ? this.typeToString(member.type) : 'any';
        const nullable = typeStr.includes('null');

        properties.push({
          name: propName,
          type: typeStr.replace(' | null', '').replace('null | ', ''),
          optional,
          nullable,
        });
      }
    }

    this.interfaces.set(name, { name, properties, extends: extendsClause.length > 0 ? extendsClause : undefined });
  }

  private parseConstEnum(node: ts.VariableStatement): void {
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      const name = decl.name.text;

      if (decl.initializer && ts.isObjectLiteralExpression(decl.initializer)) {
        // Check if this is `as const`
        const parent = decl.initializer.parent;
        if (parent && ts.isAsExpression(parent)) {
          const values: string[] = [];
          for (const prop of decl.initializer.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
              if (ts.isStringLiteral(prop.initializer)) {
                values.push(prop.initializer.text);
              } else {
                values.push(prop.name.text);
              }
            }
          }
          if (values.length > 0) {
            this.enums.set(name, { name, values, valueType: 'values' });
          }
        }
      }
    }
  }

  private parseTypeAlias(node: ts.TypeAliasDeclaration): void {
    const name = node.name.text;
    const typeStr = this.typeToString(node.type);
    this.typeAliases.set(name, typeStr);
  }

  private typeToString(typeNode: ts.TypeNode): string {
    if (ts.isTypeReferenceNode(typeNode)) {
      if (ts.isIdentifier(typeNode.typeName)) {
        return typeNode.typeName.text;
      }
      if (ts.isQualifiedName(typeNode.typeName)) {
        return typeNode.typeName.right.text;
      }
    }

    if (ts.isUnionTypeNode(typeNode)) {
      return typeNode.types.map(t => this.typeToString(t)).join(' | ');
    }

    if (ts.isArrayTypeNode(typeNode)) {
      return `${this.typeToString(typeNode.elementType)}[]`;
    }

    if (ts.isLiteralTypeNode(typeNode)) {
      if (ts.isStringLiteral(typeNode.literal)) {
        return `'${typeNode.literal.text}'`;
      }
      if (typeNode.literal.kind === ts.SyntaxKind.NullKeyword) {
        return 'null';
      }
    }

    if (ts.isTypeLiteralNode(typeNode)) {
      return 'object';
    }

    if (typeNode.kind === ts.SyntaxKind.StringKeyword) return 'string';
    if (typeNode.kind === ts.SyntaxKind.NumberKeyword) return 'number';
    if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) return 'boolean';
    if (typeNode.kind === ts.SyntaxKind.AnyKeyword) return 'any';
    if (typeNode.kind === ts.SyntaxKind.NullKeyword) return 'null';

    return 'any';
  }

  getInterfaces(): Map<string, ParsedInterface> {
    return this.interfaces;
  }

  getEnums(): Map<string, ParsedEnum> {
    return this.enums;
  }

  getTypeAliases(): Map<string, string> {
    return this.typeAliases;
  }
}

// ============================================================================
// OpenAPI Generator
// ============================================================================

class OpenAPIGenerator {
  private spec: OpenAPISpec;
  private interfaces: Map<string, ParsedInterface>;
  private enums: Map<string, ParsedEnum>;
  private typeAliases: Map<string, string>;
  private generatedSchemas: Set<string> = new Set();

  constructor(
    interfaces: Map<string, ParsedInterface>,
    enums: Map<string, ParsedEnum>,
    typeAliases: Map<string, string>
  ) {
    this.interfaces = interfaces;
    this.enums = enums;
    this.typeAliases = typeAliases;
    this.spec = this.initializeSpec();
  }

  private initializeSpec(): OpenAPISpec {
    return {
      openapi: '3.0.3',
      info: {
        title: 'Method API',
        version: '2025-07-04',
        description: 'Method Financial API - Node SDK Generated OpenAPI Specification',
        contact: {
          name: 'Method Financial',
          url: 'https://methodfi.com',
          email: 'support@methodfi.com',
        },
      },
      servers: [
        { url: 'https://production.methodfi.com', description: 'Production' },
        { url: 'https://sandbox.methodfi.com', description: 'Sandbox' },
        { url: 'https://dev.methodfi.com', description: 'Development' },
      ],
      tags: [
        { name: 'Entities', description: 'Entity management endpoints' },
        { name: 'Entities - Connect', description: 'Entity connection endpoints' },
        { name: 'Entities - Credit Scores', description: 'Entity credit score endpoints' },
        { name: 'Entities - Identities', description: 'Entity identity endpoints' },
        { name: 'Entities - Attributes', description: 'Entity attribute endpoints' },
        { name: 'Entities - Vehicles', description: 'Entity vehicle endpoints' },
        { name: 'Entities - Products', description: 'Entity product endpoints' },
        { name: 'Entities - Subscriptions', description: 'Entity subscription endpoints' },
        { name: 'Entities - Verification Sessions', description: 'Entity verification session endpoints' },
        { name: 'Accounts', description: 'Account management endpoints' },
        { name: 'Accounts - Balances', description: 'Account balance endpoints' },
        { name: 'Accounts - CardBrands', description: 'Account card brand endpoints' },
        { name: 'Accounts - Payoffs', description: 'Account payoff endpoints' },
        { name: 'Accounts - Sensitives', description: 'Account sensitive data endpoints' },
        { name: 'Accounts - Transactions', description: 'Account transaction endpoints' },
        { name: 'Accounts - Updates', description: 'Account update endpoints' },
        { name: 'Accounts - Attributess', description: 'Account attribute endpoints' },
        { name: 'Accounts - PaymentInstruments', description: 'Account payment instrument endpoints' },
        { name: 'Accounts - Subscriptions', description: 'Account subscription endpoints' },
        { name: 'Accounts - Products', description: 'Account product endpoints' },
        { name: 'Accounts - Verification Sessions', description: 'Account verification session endpoints' },
        { name: 'Payments', description: 'Payment management endpoints' },
        { name: 'Payments - Reversals', description: 'Payment reversal endpoints' },
        { name: 'Webhooks', description: 'Webhook management endpoints' },
        { name: 'Reports', description: 'Report management endpoints' },
        { name: 'Merchants', description: 'Merchant lookup endpoints' },
        { name: 'Events', description: 'Event retrieval endpoints' },
        { name: 'Elements', description: 'Element token endpoints' },
        { name: 'Opal', description: 'Opal token endpoints' },
        { name: 'Simulate', description: 'Simulation endpoints for testing' },
      ],
      security: [{ bearerAuth: [] }],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    };
  }

  // Helper to create a nullable reference using allOf (OpenAPI 3.0 compliant)
  private nullableRef(ref: string): Schema {
    return {
      allOf: [{ $ref: ref }],
      nullable: true,
    };
  }

  // Helper to create a non-nullable reference
  private ref(ref: string): Schema {
    return { $ref: ref };
  }

  generate(): OpenAPISpec {
    // Generate schemas for core types
    this.generateCoreSchemas();

    // Generate paths for all resources
    this.generatePaths();

    return this.spec;
  }

  private generateCoreSchemas(): void {
    // Generate ResourceError schema
    this.spec.components.schemas['ResourceError'] = {
      type: 'object',
      properties: {
        type: { type: 'string' },
        code: { type: 'integer' },
        sub_type: { type: 'string' },
        message: { type: 'string' },
      },
    };

    // Generate common enums
    this.spec.components.schemas['ResourceStatus'] = {
      type: 'string',
      enum: ['completed', 'in_progress', 'pending', 'failed'],
    };

    // Generate entity-related schemas
    this.generateEntitySchemas();
    this.generateAccountSchemas();
    this.generatePaymentSchemas();
    this.generateWebhookSchemas();
    this.generateReportSchemas();
    this.generateMerchantSchemas();
    this.generateEventSchemas();
    this.generateElementSchemas();
    this.generateOpalSchemas();
    this.generateSimulateSchemas();
  }

  private generateEntitySchemas(): void {
    // EntityTypes enum
    this.spec.components.schemas['EntityType'] = {
      type: 'string',
      enum: ['individual', 'corporation'],
    };

    // EntityStatuses enum
    this.spec.components.schemas['EntityStatus'] = {
      type: 'string',
      enum: ['active', 'incomplete', 'disabled'],
    };

    // EntityAddress
    this.spec.components.schemas['EntityAddress'] = {
      type: 'object',
      properties: {
        line1: { type: 'string', nullable: true },
        line2: { type: 'string', nullable: true },
        city: { type: 'string', nullable: true },
        state: { type: 'string', nullable: true },
        zip: { type: 'string', nullable: true },
      },
    };

    // EntityIndividual
    this.spec.components.schemas['EntityIndividual'] = {
      type: 'object',
      properties: {
        first_name: { type: 'string', nullable: true },
        last_name: { type: 'string', nullable: true },
        phone: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        dob: { type: 'string', nullable: true },
        ssn: { type: 'string', nullable: true },
        ssn_4: { type: 'string', nullable: true },
      },
    };

    // EntityCorporationOwner
    this.spec.components.schemas['EntityCorporationOwner'] = {
      type: 'object',
      properties: {
        first_name: { type: 'string', nullable: true },
        last_name: { type: 'string', nullable: true },
        phone: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        dob: { type: 'string', nullable: true },
        address: this.ref('#/components/schemas/EntityAddress'),
      },
    };

    // EntityCorporation
    this.spec.components.schemas['EntityCorporation'] = {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true },
        dba: { type: 'string', nullable: true },
        ein: { type: 'string', nullable: true },
        owners: {
          type: 'array',
          items: this.ref('#/components/schemas/EntityCorporationOwner'),
        },
      },
    };

    // Entity
    this.spec.components.schemas['Entity'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: this.nullableRef('#/components/schemas/EntityType'),
        individual: this.nullableRef('#/components/schemas/EntityIndividual'),
        corporation: this.nullableRef('#/components/schemas/EntityCorporation'),
        address: this.ref('#/components/schemas/EntityAddress'),
        status: this.ref('#/components/schemas/EntityStatus'),
        error: this.nullableRef('#/components/schemas/ResourceError'),
        metadata: { type: 'object', nullable: true },
        products: { type: 'array', items: { type: 'string' } },
        restricted_products: { type: 'array', items: { type: 'string' } },
        subscriptions: { type: 'array', items: { type: 'string' } },
        available_subscriptions: { type: 'array', items: { type: 'string' } },
        restricted_subscriptions: { type: 'array', items: { type: 'string' } },
        verification: { type: 'object', nullable: true },
        connect: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/EntityConnect')], nullable: true },
        credit_score: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/EntityCreditScores')], nullable: true },
        attribute: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/EntityAttributes')], nullable: true },
        vehicle: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/EntityVehicles')], nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'status', 'created_at', 'updated_at'],
    };

    // EntityCreateRequest
    this.spec.components.schemas['EntityIndividualCreateRequest'] = {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['individual'] },
        individual: this.ref('#/components/schemas/EntityIndividual'),
        address: this.ref('#/components/schemas/EntityAddress'),
        metadata: { type: 'object', nullable: true },
      },
      required: ['type', 'individual'],
    };

    this.spec.components.schemas['EntityCorporationCreateRequest'] = {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['corporation'] },
        corporation: this.ref('#/components/schemas/EntityCorporation'),
        address: this.ref('#/components/schemas/EntityAddress'),
        metadata: { type: 'object', nullable: true },
      },
      required: ['type', 'corporation'],
    };

    this.spec.components.schemas['EntityCreateRequest'] = {
      oneOf: [
        this.ref('#/components/schemas/EntityIndividualCreateRequest'),
        this.ref('#/components/schemas/EntityCorporationCreateRequest'),
      ],
    };

    this.spec.components.schemas['EntityUpdateRequest'] = {
      type: 'object',
      properties: {
        address: this.ref('#/components/schemas/EntityAddress'),
        corporation: this.ref('#/components/schemas/EntityCorporation'),
        individual: this.ref('#/components/schemas/EntityIndividual'),
      },
    };

    // EntityConnect
    this.spec.components.schemas['EntityConnect'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        entity_id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        accounts: { type: 'array', items: { type: 'string' }, nullable: true },
        requested_products: { type: 'array', items: { type: 'string' } },
        requested_subscriptions: { type: 'array', items: { type: 'string' } },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'entity_id', 'status', 'created_at', 'updated_at'],
    };

    this.spec.components.schemas['EntityConnectCreateRequest'] = {
      type: 'object',
      properties: {
        products: { type: 'array', items: { type: 'string' } },
        subscriptions: { type: 'array', items: { type: 'string' } },
      },
    };

    // EntityCreditScores
    this.spec.components.schemas['CreditScoreModel'] = {
      type: 'string',
      enum: ['vantage_4', 'vantage_3'],
    };

    this.spec.components.schemas['CreditReportBureau'] = {
      type: 'string',
      enum: ['experian', 'equifax', 'transunion'],
    };

    this.spec.components.schemas['EntityCreditScoreFactor'] = {
      type: 'object',
      properties: {
        code: { type: 'string' },
        description: { type: 'string' },
      },
    };

    this.spec.components.schemas['EntityCreditScoreItem'] = {
      type: 'object',
      properties: {
        score: { type: 'integer' },
        source: this.ref('#/components/schemas/CreditReportBureau'),
        model: this.ref('#/components/schemas/CreditScoreModel'),
        factors: { type: 'array', items: this.ref('#/components/schemas/EntityCreditScoreFactor') },
        created_at: { type: 'string', format: 'date-time' },
      },
    };

    this.spec.components.schemas['EntityCreditScores'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        entity_id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        scores: { type: 'array', items: this.ref('#/components/schemas/EntityCreditScoreItem'), nullable: true },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'entity_id', 'status', 'created_at', 'updated_at'],
    };

    // EntityIdentity
    this.spec.components.schemas['EntityIdentityType'] = {
      type: 'object',
      properties: {
        first_name: { type: 'string', nullable: true },
        last_name: { type: 'string', nullable: true },
        phone: { type: 'string', nullable: true },
        dob: { type: 'string', nullable: true },
        address: { type: 'object', nullable: true },
        ssn: { type: 'string', nullable: true },
      },
    };

    this.spec.components.schemas['EntityIdentity'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        entity_id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        identities: { type: 'array', items: this.ref('#/components/schemas/EntityIdentityType') },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'entity_id', 'status', 'identities', 'created_at', 'updated_at'],
    };

    // EntityAttributes
    this.spec.components.schemas['CreditHealthAttributeRating'] = {
      type: 'string',
      enum: ['excellent', 'good', 'fair', 'needs_work'],
    };

    this.spec.components.schemas['CreditHealthAttribute'] = {
      type: 'object',
      properties: {
        value: { type: 'number' },
        rating: this.ref('#/components/schemas/CreditHealthAttributeRating'),
        metadata: { type: 'object', nullable: true },
      },
    };

    this.spec.components.schemas['EntityAttributesType'] = {
      type: 'object',
      properties: {
        credit_health_credit_card_usage: this.ref('#/components/schemas/CreditHealthAttribute'),
        credit_health_derogatory_marks: this.ref('#/components/schemas/CreditHealthAttribute'),
        credit_health_hard_inquiries: this.ref('#/components/schemas/CreditHealthAttribute'),
        credit_health_soft_inquiries: this.ref('#/components/schemas/CreditHealthAttribute'),
        credit_health_total_accounts: this.ref('#/components/schemas/CreditHealthAttribute'),
        credit_health_credit_age: this.ref('#/components/schemas/CreditHealthAttribute'),
        credit_health_payment_history: this.ref('#/components/schemas/CreditHealthAttribute'),
        credit_health_open_accounts: this.ref('#/components/schemas/CreditHealthAttribute'),
        credit_health_entity_delinquent: this.ref('#/components/schemas/CreditHealthAttribute'),
      },
    };

    this.spec.components.schemas['EntityAttributes'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        entity_id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        attributes: this.nullableRef('#/components/schemas/EntityAttributesType'),
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'entity_id', 'status', 'created_at', 'updated_at'],
    };

    this.spec.components.schemas['EntityAttributesCreateRequest'] = {
      type: 'object',
      properties: {
        attributes: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'credit_health_credit_card_usage',
              'credit_health_derogatory_marks',
              'credit_health_hard_inquiries',
              'credit_health_soft_inquiries',
              'credit_health_total_accounts',
              'credit_health_credit_age',
              'credit_health_payment_history',
              'credit_health_open_accounts',
              'credit_health_entity_delinquent',
            ],
          },
        },
      },
      required: ['attributes'],
    };

    // EntityVehicles
    this.spec.components.schemas['EntityVehicleType'] = {
      type: 'object',
      properties: {
        vin: { type: 'string', nullable: true },
        year: { type: 'string', nullable: true },
        make: { type: 'string', nullable: true },
        model: { type: 'string', nullable: true },
        series: { type: 'string', nullable: true },
        major_color: { type: 'string', nullable: true },
        style: { type: 'string', nullable: true },
      },
    };

    this.spec.components.schemas['EntityVehicles'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        entity_id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        vehicles: { type: 'array', items: this.ref('#/components/schemas/EntityVehicleType'), nullable: true },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'entity_id', 'status', 'created_at', 'updated_at'],
    };

    // EntityProduct
    this.spec.components.schemas['EntityProductStatus'] = {
      type: 'string',
      enum: ['unavailable', 'available', 'restricted'],
    };

    this.spec.components.schemas['EntityProduct'] = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        status: this.ref('#/components/schemas/EntityProductStatus'),
        status_error: this.nullableRef('#/components/schemas/ResourceError'),
        latest_request_id: { type: 'string', nullable: true },
        latest_successful_request_id: { type: 'string', nullable: true },
        is_subscribable: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };

    this.spec.components.schemas['EntityProductListResponse'] = {
      type: 'object',
      properties: {
        connect: this.ref('#/components/schemas/EntityProduct'),
        credit_score: this.ref('#/components/schemas/EntityProduct'),
        identity: this.ref('#/components/schemas/EntityProduct'),
        attribute: this.ref('#/components/schemas/EntityProduct'),
        vehicle: this.ref('#/components/schemas/EntityProduct'),
        manual_connect: this.ref('#/components/schemas/EntityProduct'),
      },
    };

    // EntitySubscription
    this.spec.components.schemas['EntitySubscriptionStatus'] = {
      type: 'string',
      enum: ['active', 'inactive'],
    };

    this.spec.components.schemas['EntitySubscription'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        status: this.ref('#/components/schemas/EntitySubscriptionStatus'),
        payload: { type: 'object', nullable: true },
        latest_request_id: { type: 'string', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };

    this.spec.components.schemas['EntitySubscriptionCreateRequest'] = {
      type: 'object',
      properties: {
        enroll: { type: 'string', enum: ['connect', 'credit_score', 'attribute'] },
        payload: { type: 'object', nullable: true },
      },
      required: ['enroll'],
    };

    // EntityVerificationSession
    this.spec.components.schemas['EntityVerificationSessionStatus'] = {
      type: 'string',
      enum: ['pending', 'in_progress', 'verified', 'failed'],
    };

    this.spec.components.schemas['EntityVerificationSessionType'] = {
      type: 'string',
      enum: ['phone', 'identity'],
    };

    this.spec.components.schemas['EntityVerificationSessionMethod'] = {
      type: 'string',
      enum: ['sms', 'sna', 'byo_sms', 'byo_kyc', 'kba', 'element', 'method_verified'],
    };

    this.spec.components.schemas['EntityVerificationSession'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        entity_id: { type: 'string' },
        status: this.ref('#/components/schemas/EntityVerificationSessionStatus'),
        type: this.ref('#/components/schemas/EntityVerificationSessionType'),
        method: this.ref('#/components/schemas/EntityVerificationSessionMethod'),
        sms: { type: 'object', nullable: true },
        sna: { type: 'object', nullable: true },
        byo_sms: { type: 'object', nullable: true },
        byo_kyc: { type: 'object', nullable: true },
        kba: { type: 'object', nullable: true },
        element: { type: 'object', nullable: true },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'entity_id', 'status', 'type', 'method', 'created_at', 'updated_at'],
    };

    this.spec.components.schemas['EntityVerificationSessionCreateRequest'] = {
      type: 'object',
      properties: {
        type: this.ref('#/components/schemas/EntityVerificationSessionType'),
        method: this.ref('#/components/schemas/EntityVerificationSessionMethod'),
        sms: { type: 'object' },
        sna: { type: 'object' },
        byo_sms: { type: 'object' },
        byo_kyc: { type: 'object' },
        kba: { type: 'object' },
      },
      required: ['type', 'method'],
    };

    this.spec.components.schemas['EntityVerificationSessionUpdateRequest'] = {
      type: 'object',
      properties: {
        type: this.ref('#/components/schemas/EntityVerificationSessionType'),
        method: this.ref('#/components/schemas/EntityVerificationSessionMethod'),
        sms: { type: 'object' },
        sna: { type: 'object' },
        kba: { type: 'object' },
      },
      required: ['type', 'method'],
    };

    // EntityWithdrawConsent
    this.spec.components.schemas['EntityWithdrawConsentRequest'] = {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['withdraw'] },
        reason: { type: 'string', enum: ['entity_withdrew_consent'], nullable: true },
      },
      required: ['type'],
    };
  }

  private generateAccountSchemas(): void {
    // AccountTypes
    this.spec.components.schemas['AccountType'] = {
      type: 'string',
      enum: ['ach', 'liability'],
    };

    this.spec.components.schemas['AccountStatus'] = {
      type: 'string',
      enum: ['disabled', 'active', 'closed'],
    };

    this.spec.components.schemas['AccountLiabilityType'] = {
      type: 'string',
      enum: [
        'auto_loan', 'bnpl', 'credit_builder', 'credit_card', 'collection',
        'fintech', 'insurance', 'loan', 'medical', 'mortgage', 'personal_loan',
        'student_loans', 'utility'
      ],
    };

    this.spec.components.schemas['AccountOwnership'] = {
      type: 'string',
      enum: ['primary', 'authorized', 'joint', 'unknown'],
    };

    // AccountACH
    this.spec.components.schemas['AccountACH'] = {
      type: 'object',
      properties: {
        routing: { type: 'string' },
        number: { type: 'string' },
        type: { type: 'string', enum: ['savings', 'checking'] },
      },
      required: ['routing', 'number', 'type'],
    };

    // AccountLiability
    this.spec.components.schemas['AccountLiability'] = {
      type: 'object',
      properties: {
        mch_id: { type: 'string' },
        mask: { type: 'string', nullable: true },
        ownership: this.nullableRef('#/components/schemas/AccountOwnership'),
        fingerprint: { type: 'string', nullable: true },
        type: this.nullableRef('#/components/schemas/AccountLiabilityType'),
        sub_type: { type: 'string', nullable: true },
        name: { type: 'string', nullable: true },
      },
    };

    // Account
    this.spec.components.schemas['Account'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        holder_id: { type: 'string' },
        status: this.ref('#/components/schemas/AccountStatus'),
        type: this.nullableRef('#/components/schemas/AccountType'),
        ach: this.nullableRef('#/components/schemas/AccountACH'),
        liability: this.nullableRef('#/components/schemas/AccountLiability'),
        products: { type: 'array', items: { type: 'string' } },
        restricted_products: { type: 'array', items: { type: 'string' } },
        subscriptions: { type: 'array', items: { type: 'string' } },
        available_subscriptions: { type: 'array', items: { type: 'string' } },
        restricted_subscriptions: { type: 'array', items: { type: 'string' } },
        sensitive: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/AccountSensitive')], nullable: true },
        balance: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/AccountBalance')], nullable: true },
        card_brand: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/AccountCardBrand')], nullable: true },
        payoff: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/AccountPayoff')], nullable: true },
        transactions: { oneOf: [{ type: 'string' }, { type: 'array', items: this.ref('#/components/schemas/AccountTransaction') }], nullable: true },
        update: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/AccountUpdate')], nullable: true },
        attribute: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/AccountAttributes')], nullable: true },
        payment_instrument: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/AccountPaymentInstrument')], nullable: true },
        latest_verification_session: { oneOf: [{ type: 'string' }, this.ref('#/components/schemas/AccountVerificationSession')], nullable: true },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        metadata: { type: 'object', nullable: true },
      },
      required: ['id', 'holder_id', 'status', 'products', 'restricted_products', 'created_at', 'updated_at'],
    };

    // Account create requests
    this.spec.components.schemas['AccountACHCreateRequest'] = {
      type: 'object',
      properties: {
        holder_id: { type: 'string' },
        ach: this.ref('#/components/schemas/AccountACH'),
        metadata: { type: 'object' },
      },
      required: ['holder_id', 'ach'],
    };

    this.spec.components.schemas['AccountLiabilityCreateRequest'] = {
      type: 'object',
      properties: {
        holder_id: { type: 'string' },
        liability: {
          type: 'object',
          properties: {
            mch_id: { type: 'string' },
            account_number: { type: 'string' },
            number: { type: 'string' },
          },
          required: ['mch_id'],
        },
        metadata: { type: 'object' },
      },
      required: ['holder_id', 'liability'],
    };

    this.spec.components.schemas['AccountCreateRequest'] = {
      oneOf: [
        this.ref('#/components/schemas/AccountACHCreateRequest'),
        this.ref('#/components/schemas/AccountLiabilityCreateRequest'),
      ],
    };

    // AccountBalance
    this.spec.components.schemas['AccountBalance'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        amount: { type: 'integer', nullable: true },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'account_id', 'status', 'created_at', 'updated_at'],
    };

    // AccountCardBrand
    this.spec.components.schemas['AccountCardBrandInfo'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        card_product_id: { type: 'string' },
        description: { type: 'string' },
        name: { type: 'string' },
        issuer: { type: 'string' },
        network: { type: 'string' },
        type: { type: 'string', enum: ['specific', 'generic', 'in_review'] },
        url: { type: 'string' },
      },
    };

    this.spec.components.schemas['AccountCardBrand'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        brands: { type: 'array', items: this.ref('#/components/schemas/AccountCardBrandInfo') },
        source: { type: 'string', enum: ['method', 'network'], nullable: true },
        status: { type: 'string', enum: ['completed', 'in_progress', 'failed'] },
        shared: { type: 'boolean' },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'account_id', 'brands', 'status', 'shared', 'created_at', 'updated_at'],
    };

    // AccountPayoff
    this.spec.components.schemas['AccountPayoff'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        amount: { type: 'integer', nullable: true },
        term: { type: 'integer', nullable: true },
        per_diem_amount: { type: 'integer', nullable: true },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'account_id', 'status', 'created_at', 'updated_at'],
    };

    // AccountSensitive
    this.spec.components.schemas['AccountSensitiveCreditCard'] = {
      type: 'object',
      properties: {
        number: { type: 'string', nullable: true },
        billing_zip_code: { type: 'string', nullable: true },
        exp_month: { type: 'string', nullable: true },
        exp_year: { type: 'string', nullable: true },
        cvv: { type: 'string', nullable: true },
      },
    };

    this.spec.components.schemas['AccountSensitiveLoan'] = {
      type: 'object',
      properties: {
        number: { type: 'string' },
      },
    };

    this.spec.components.schemas['AccountSensitive'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        type: this.ref('#/components/schemas/AccountLiabilityType'),
        auto_loan: this.ref('#/components/schemas/AccountSensitiveLoan'),
        credit_card: this.ref('#/components/schemas/AccountSensitiveCreditCard'),
        mortgage: this.ref('#/components/schemas/AccountSensitiveLoan'),
        personal_loan: this.ref('#/components/schemas/AccountSensitiveLoan'),
        status: { type: 'string', enum: ['completed', 'failed'] },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'account_id', 'type', 'status', 'created_at', 'updated_at'],
    };

    this.spec.components.schemas['AccountSensitiveCreateRequest'] = {
      type: 'object',
      properties: {
        expand: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'auto_loan.number', 'mortgage.number', 'personal_loan.number',
              'credit_card.number', 'credit_card.billing_zip_code',
              'credit_card.exp_month', 'credit_card.exp_year', 'credit_card.cvv'
            ],
          },
        },
      },
      required: ['expand'],
    };

    // AccountTransaction
    this.spec.components.schemas['TransactionMerchant'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        logo: { type: 'string', nullable: true },
      },
    };

    this.spec.components.schemas['AccountTransaction'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        descriptor: { type: 'string' },
        amount: { type: 'integer' },
        auth_amount: { type: 'integer' },
        currency_code: { type: 'string' },
        transaction_amount: { type: 'integer' },
        transaction_auth_amount: { type: 'integer' },
        transaction_currency_code: { type: 'string' },
        merchant: this.nullableRef('#/components/schemas/TransactionMerchant'),
        merchant_category_code: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'posted', 'voided'] },
        transacted_at: { type: 'string', format: 'date-time' },
        posted_at: { type: 'string', format: 'date-time', nullable: true },
        voided_at: { type: 'string', format: 'date-time', nullable: true },
        original_txn_id: { type: 'string', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'account_id', 'descriptor', 'amount', 'status', 'transacted_at', 'created_at', 'updated_at'],
    };

    // AccountUpdate
    this.spec.components.schemas['AccountUpdate'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        account_id: { type: 'string' },
        source: { type: 'string', enum: ['direct', 'snapshot'] },
        type: this.ref('#/components/schemas/AccountLiabilityType'),
        auto_loan: { type: 'object' },
        credit_card: { type: 'object' },
        collection: { type: 'object' },
        mortgage: { type: 'object' },
        personal_loan: { type: 'object' },
        student_loans: { type: 'object' },
        credit_builder: { type: 'object' },
        loan: { type: 'object' },
        insurance: { type: 'object' },
        medical: { type: 'object' },
        utility: { type: 'object' },
        data_as_of: { type: 'string', nullable: true },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'status', 'account_id', 'source', 'type', 'created_at', 'updated_at'],
    };

    // AccountAttributes
    this.spec.components.schemas['AccountAttributes'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        attributes: { type: 'object', nullable: true },
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'account_id', 'status', 'created_at', 'updated_at'],
    };

    // AccountPaymentInstrument
    this.spec.components.schemas['AccountPaymentInstrument'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        type: { type: 'string', enum: ['card', 'network_token'] },
        network_token: { type: 'object', nullable: true },
        card: { type: 'object', nullable: true },
        chargeable: { type: 'boolean' },
        status: this.ref('#/components/schemas/ResourceStatus'),
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'account_id', 'type', 'chargeable', 'status', 'created_at', 'updated_at'],
    };

    this.spec.components.schemas['AccountPaymentInstrumentCreateRequest'] = {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['card', 'network_token'] },
      },
      required: ['type'],
    };

    // AccountVerificationSession
    this.spec.components.schemas['AccountVerificationSessionType'] = {
      type: 'string',
      enum: ['micro_deposits', 'plaid', 'mx', 'teller', 'standard', 'instant', 'pre_auth', 'network'],
    };

    this.spec.components.schemas['AccountVerificationSession'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'in_progress', 'verified', 'failed'] },
        type: this.ref('#/components/schemas/AccountVerificationSessionType'),
        error: this.nullableRef('#/components/schemas/ResourceError'),
        plaid: { type: 'object', nullable: true },
        mx: { type: 'object', nullable: true },
        teller: { type: 'object', nullable: true },
        micro_deposits: { type: 'object', nullable: true },
        trusted_provisioner: { type: 'object', nullable: true },
        auto_verify: { type: 'object', nullable: true },
        standard: { type: 'object', nullable: true },
        instant: { type: 'object', nullable: true },
        pre_auth: { type: 'object', nullable: true },
        network: { type: 'object', nullable: true },
        three_ds: { type: 'object', nullable: true },
        issuer: { type: 'object', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'account_id', 'status', 'type', 'created_at', 'updated_at'],
    };

    this.spec.components.schemas['AccountVerificationSessionCreateRequest'] = {
      type: 'object',
      properties: {
        type: this.ref('#/components/schemas/AccountVerificationSessionType'),
      },
      required: ['type'],
    };

    this.spec.components.schemas['AccountVerificationSessionUpdateRequest'] = {
      type: 'object',
      properties: {
        micro_deposits: { type: 'object' },
        plaid: { type: 'object' },
        mx: { type: 'object' },
        teller: { type: 'object' },
        standard: { type: 'object' },
        instant: { type: 'object' },
        pre_auth: { type: 'object' },
        network: { type: 'object' },
      },
    };

    // Account Product and Subscription
    this.spec.components.schemas['AccountProduct'] = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        status: { type: 'string', enum: ['unavailable', 'available', 'restricted'] },
        status_error: this.nullableRef('#/components/schemas/ResourceError'),
        latest_request_id: { type: 'string', nullable: true },
        latest_successful_request_id: { type: 'string', nullable: true },
        is_subscribable: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };

    this.spec.components.schemas['AccountSubscription'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        payload: { type: 'object', nullable: true },
        latest_request_id: { type: 'string', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };

    this.spec.components.schemas['AccountSubscriptionCreateRequest'] = {
      type: 'object',
      properties: {
        enroll: { type: 'string', enum: ['card_brand', 'payment_instrument', 'transaction', 'update', 'update.snapshot'] },
      },
      required: ['enroll'],
    };

    // AccountWithdrawConsent
    this.spec.components.schemas['AccountWithdrawConsentRequest'] = {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['withdraw'] },
        reason: { type: 'string', enum: ['holder_withdrew_consent'], nullable: true },
      },
      required: ['type'],
    };
  }

  private generatePaymentSchemas(): void {
    // PaymentStatus
    this.spec.components.schemas['PaymentStatus'] = {
      type: 'string',
      enum: [
        'pending', 'canceled', 'processing', 'failed', 'sent', 'posted',
        'reversed', 'reversal_required', 'reversal_processing', 'settled', 'cashed'
      ],
    };

    this.spec.components.schemas['PaymentFundStatus'] = {
      type: 'string',
      enum: ['hold', 'pending', 'requested', 'clearing', 'failed', 'sent', 'posted', 'unknown'],
    };

    this.spec.components.schemas['PaymentType'] = {
      type: 'string',
      enum: ['standard', 'clearing'],
    };

    // PaymentFee
    this.spec.components.schemas['PaymentFee'] = {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['total', 'markup'] },
        amount: { type: 'integer' },
      },
      required: ['type', 'amount'],
    };

    // Payment
    this.spec.components.schemas['Payment'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        reversal_id: { type: 'string', nullable: true },
        source_trace_id: { type: 'string', nullable: true },
        destination_trace_id: { type: 'string', nullable: true },
        source: { type: 'string' },
        destination: { type: 'string' },
        amount: { type: 'integer' },
        description: { type: 'string' },
        status: this.ref('#/components/schemas/PaymentStatus'),
        fund_status: this.ref('#/components/schemas/PaymentFundStatus'),
        error: this.nullableRef('#/components/schemas/ResourceError'),
        metadata: { type: 'object', nullable: true },
        estimated_completion_date: { type: 'string', nullable: true },
        source_settlement_date: { type: 'string', nullable: true },
        destination_settlement_date: { type: 'string', nullable: true },
        source_status: this.ref('#/components/schemas/PaymentStatus'),
        destination_status: this.ref('#/components/schemas/PaymentStatus'),
        destination_payment_method: { type: 'string', enum: ['paper', 'electronic'], nullable: true },
        fee: this.nullableRef('#/components/schemas/PaymentFee'),
        type: this.ref('#/components/schemas/PaymentType'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'source', 'destination', 'amount', 'description', 'status', 'type', 'created_at', 'updated_at'],
    };

    // PaymentCreateRequest
    this.spec.components.schemas['PaymentCreateRequest'] = {
      type: 'object',
      properties: {
        amount: { type: 'integer' },
        source: { type: 'string' },
        destination: { type: 'string' },
        description: { type: 'string' },
        metadata: { type: 'object' },
        fee: this.ref('#/components/schemas/PaymentFee'),
        dry_run: { type: 'boolean' },
      },
      required: ['amount', 'source', 'destination', 'description'],
    };

    // Reversal
    this.spec.components.schemas['ReversalStatus'] = {
      type: 'string',
      enum: ['pending_approval', 'pending', 'processing', 'sent', 'failed'],
    };

    this.spec.components.schemas['ReversalDirection'] = {
      type: 'string',
      enum: ['debit', 'credit'],
    };

    this.spec.components.schemas['Reversal'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        pmt_id: { type: 'string' },
        target_account: { type: 'string' },
        trace_id: { type: 'string', nullable: true },
        direction: this.ref('#/components/schemas/ReversalDirection'),
        description: { type: 'string' },
        amount: { type: 'integer' },
        status: this.ref('#/components/schemas/ReversalStatus'),
        error: this.nullableRef('#/components/schemas/ResourceError'),
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'pmt_id', 'target_account', 'direction', 'description', 'amount', 'status', 'created_at', 'updated_at'],
    };

    this.spec.components.schemas['ReversalUpdateRequest'] = {
      type: 'object',
      properties: {
        status: this.ref('#/components/schemas/ReversalStatus'),
        description: { type: 'string', nullable: true },
      },
      required: ['status'],
    };
  }

  private generateWebhookSchemas(): void {
    this.spec.components.schemas['WebhookType'] = {
      type: 'string',
      enum: [
        'payment.create', 'payment.update', 'account.create', 'account.update',
        'entity.update', 'entity.create', 'account_verification.create', 'account_verification.update',
        'payment_reversal.create', 'payment_reversal.update', 'connection.create', 'connection.update',
        'transaction.create', 'transaction.update', 'report.create', 'report.update',
        'product.create', 'product.update', 'subscription.create', 'subscription.update',
        'credit_score.create', 'credit_score.update', 'payoff.create', 'payoff.update',
        'entity_verification_session.create', 'entity_verification_session.update',
        'connect.create', 'connect.update', 'connect.available',
        'balance.create', 'balance.update', 'identity.create', 'identity.update',
        'account_verification_session.create', 'account_verification_session.update',
        'card_brand.create', 'card_brand.update', 'card_brand.available',
        'sensitive.create', 'sensitive.update', 'update.create', 'update.update',
        'attribute.create', 'attribute.update', 'account.opened', 'account.closed',
        'credit_score.increased', 'credit_score.decreased',
      ],
    };

    this.spec.components.schemas['WebhookStatus'] = {
      type: 'string',
      enum: ['active', 'disabled', 'deleted', 'requires_attention'],
    };

    this.spec.components.schemas['Webhook'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: this.ref('#/components/schemas/WebhookType'),
        url: { type: 'string' },
        metadata: { type: 'object', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        expand_event: { type: 'boolean' },
        error: { type: 'object', nullable: true },
        status: { type: 'string', nullable: true },
      },
      required: ['id', 'type', 'url', 'created_at', 'updated_at', 'expand_event'],
    };

    this.spec.components.schemas['WebhookCreateRequest'] = {
      type: 'object',
      properties: {
        type: this.ref('#/components/schemas/WebhookType'),
        url: { type: 'string' },
        auth_token: { type: 'string' },
        hmac_secret: { type: 'string' },
        metadata: { type: 'object' },
        expand_event: { type: 'boolean' },
      },
      required: ['type', 'url'],
    };

    this.spec.components.schemas['WebhookUpdateRequest'] = {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'disabled'] },
      },
      required: ['status'],
    };
  }

  private generateReportSchemas(): void {
    this.spec.components.schemas['ReportType'] = {
      type: 'string',
      enum: [
        'payments.created.current', 'payments.created.previous',
        'payments.updated.current', 'payments.updated.previous',
        'payments.created.previous_day', 'payments.failed.previous_day',
        'ach.pull.upcoming', 'ach.pull.previous', 'ach.pull.nightly',
        'ach.reversals.nightly', 'entities.created.previous_day',
      ],
    };

    this.spec.components.schemas['ReportStatus'] = {
      type: 'string',
      enum: ['processing', 'completed'],
    };

    this.spec.components.schemas['Report'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: this.ref('#/components/schemas/ReportType'),
        url: { type: 'string' },
        status: this.ref('#/components/schemas/ReportStatus'),
        metadata: { type: 'object', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'type', 'url', 'status', 'created_at', 'updated_at'],
    };

    this.spec.components.schemas['ReportCreateRequest'] = {
      type: 'object',
      properties: {
        type: this.ref('#/components/schemas/ReportType'),
        metadata: { type: 'object' },
      },
      required: ['type'],
    };
  }

  private generateMerchantSchemas(): void {
    this.spec.components.schemas['MerchantProviderIds'] = {
      type: 'object',
      properties: {
        plaid: { type: 'array', items: { type: 'string' } },
        mx: { type: 'array', items: { type: 'string' } },
        finicity: { type: 'array', items: { type: 'string' } },
        dpp: { type: 'array', items: { type: 'string' } },
      },
    };

    this.spec.components.schemas['Merchant'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        parent_name: { type: 'string' },
        name: { type: 'string' },
        logo: { type: 'string' },
        type: this.ref('#/components/schemas/AccountLiabilityType'),
        provider_ids: this.ref('#/components/schemas/MerchantProviderIds'),
        is_temp: { type: 'boolean' },
        account_number_formats: { type: 'array', items: { type: 'string' } },
      },
      required: ['id', 'parent_name', 'name', 'logo', 'type', 'provider_ids', 'is_temp', 'account_number_formats'],
    };
  }

  private generateEventSchemas(): void {
    this.spec.components.schemas['EventResourceType'] = {
      type: 'string',
      enum: ['account', 'credit_score', 'attribute', 'connect'],
    };

    this.spec.components.schemas['EventDiff'] = {
      type: 'object',
      properties: {
        before: { type: 'object', nullable: true },
        after: { type: 'object', nullable: true },
      },
    };

    this.spec.components.schemas['Event'] = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: this.ref('#/components/schemas/WebhookType'),
        resource_id: { type: 'string' },
        resource_type: this.ref('#/components/schemas/EventResourceType'),
        data: { type: 'object' },
        diff: this.ref('#/components/schemas/EventDiff'),
        updated_at: { type: 'string', format: 'date-time' },
        created_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'type', 'resource_id', 'resource_type', 'data', 'diff', 'updated_at', 'created_at'],
    };
  }

  private generateElementSchemas(): void {
    this.spec.components.schemas['ElementType'] = {
      type: 'string',
      enum: ['connect', 'balance_transfer'],
    };

    this.spec.components.schemas['ElementToken'] = {
      type: 'object',
      properties: {
        element_token: { type: 'string' },
      },
      required: ['element_token'],
    };

    this.spec.components.schemas['ElementUserEvent'] = {
      type: 'object',
      properties: {
        type: { type: 'string' },
        timestamp: { type: 'string' },
        metadata: { type: 'object', nullable: true },
      },
    };

    this.spec.components.schemas['ElementResults'] = {
      type: 'object',
      properties: {
        authenticated: { type: 'boolean' },
        cxn_id: { type: 'string', nullable: true },
        accounts: { type: 'array', items: { type: 'string' } },
        entity_id: { type: 'string', nullable: true },
        events: { type: 'array', items: this.ref('#/components/schemas/ElementUserEvent') },
      },
      required: ['authenticated', 'accounts', 'events'],
    };

    this.spec.components.schemas['ElementTokenCreateRequest'] = {
      type: 'object',
      properties: {
        type: this.ref('#/components/schemas/ElementType'),
        entity_id: { type: 'string' },
        team_name: { type: 'string' },
        team_logo: { type: 'string', nullable: true },
        team_icon: { type: 'string', nullable: true },
        connect: { type: 'object' },
        balance_transfer: { type: 'object' },
      },
      required: ['type'],
    };
  }

  private generateOpalSchemas(): void {
    this.spec.components.schemas['OpalMode'] = {
      type: 'string',
      enum: ['identity_verification', 'connect', 'card_connect', 'account_verification', 'transactions'],
    };

    this.spec.components.schemas['OpalToken'] = {
      type: 'object',
      properties: {
        token: { type: 'string' },
        valid_until: { type: 'string' },
        session_id: { type: 'string' },
      },
      required: ['token', 'valid_until', 'session_id'],
    };

    this.spec.components.schemas['OpalTokenCreateRequest'] = {
      type: 'object',
      properties: {
        mode: this.ref('#/components/schemas/OpalMode'),
        entity_id: { type: 'string' },
        identity_verification: { type: 'object' },
        connect: { type: 'object' },
        card_connect: { type: 'object' },
        account_verification: { type: 'object' },
        transactions: { type: 'object' },
      },
      required: ['mode', 'entity_id'],
    };
  }

  private generateSimulateSchemas(): void {
    this.spec.components.schemas['SimulatePaymentUpdateRequest'] = {
      type: 'object',
      properties: {
        status: this.ref('#/components/schemas/PaymentStatus'),
        error_code: { type: 'integer', nullable: true },
      },
      required: ['status'],
    };

    this.spec.components.schemas['SimulateEntityConnectRequest'] = {
      type: 'object',
      properties: {
        behaviors: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['new_credit_card_account', 'new_auto_loan_account', 'new_mortgage_account', 'new_student_loan_account', 'new_personal_loan_account'],
          },
        },
      },
      required: ['behaviors'],
    };

    this.spec.components.schemas['SimulateEntityAttributesRequest'] = {
      type: 'object',
      properties: {
        behaviors: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['new_soft_inquiry'],
          },
        },
      },
      required: ['behaviors'],
    };
  }

  private generatePaths(): void {
    // Entities
    this.generateEntityPaths();

    // Accounts
    this.generateAccountPaths();

    // Payments
    this.generatePaymentPaths();

    // Webhooks
    this.generateWebhookPaths();

    // Reports
    this.generateReportPaths();

    // Merchants
    this.generateMerchantPaths();

    // Events
    this.generateEventPaths();

    // Elements
    this.generateElementPaths();

    // Opal
    this.generateOpalPaths();

    // Simulate
    this.generateSimulatePaths();
  }

  private generateEntityPaths(): void {
    // /entities
    this.spec.paths['/entities'] = {
      get: this.createOperation('listEntities', 'List all entities', ['Entities'], {
        queryParams: ['from_date', 'to_date', 'page', 'page_limit', 'page_cursor', 'status', 'type', 'expand'],
        responseType: 'Entity',
        isList: true,
      }),
      post: this.createOperation('createEntity', 'Create a new entity', ['Entities'], { httpMethod: 'post',
        requestBody: 'EntityCreateRequest',
        responseType: 'Entity',
      }),
    };

    // /entities/{ent_id}
    this.spec.paths['/entities/{ent_id}'] = {
      get: this.createOperation('retrieveEntity', 'Retrieve an entity', ['Entities'], {
        pathParams: ['ent_id'],
        queryParams: ['expand'],
        responseType: 'Entity',
      }),
      put: this.createOperation('updateEntity', 'Update an entity', ['Entities'], { httpMethod: 'put',
        pathParams: ['ent_id'],
        requestBody: 'EntityUpdateRequest',
        responseType: 'Entity',
      }),
    };

    // /entities/{ent_id}/consent
    this.spec.paths['/entities/{ent_id}/consent'] = {
      post: this.createOperation('withdrawEntityConsent', 'Withdraw entity consent', ['Entities'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        requestBody: 'EntityWithdrawConsentRequest',
        responseType: 'Entity',
      }),
    };

    // /entities/{ent_id}/connect
    this.spec.paths['/entities/{ent_id}/connect'] = {
      get: this.createOperation('listEntityConnect', 'List entity connect records', ['Entities - Connect'], {
        pathParams: ['ent_id'],
        responseType: 'EntityConnect',
        isList: true,
      }),
      post: this.createOperation('createEntityConnect', 'Create entity connect', ['Entities - Connect'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        requestBody: 'EntityConnectCreateRequest',
        responseType: 'EntityConnect',
      }),
    };

    // /entities/{ent_id}/connect/{cxn_id}
    this.spec.paths['/entities/{ent_id}/connect/{cxn_id}'] = {
      get: this.createOperation('retrieveEntityConnect', 'Retrieve entity connect', ['Entities - Connect'], {
        pathParams: ['ent_id', 'cxn_id'],
        responseType: 'EntityConnect',
      }),
    };

    // /entities/{ent_id}/credit_scores
    this.spec.paths['/entities/{ent_id}/credit_scores'] = {
      get: this.createOperation('listEntityCreditScores', 'List entity credit scores', ['Entities - Credit Scores'], {
        pathParams: ['ent_id'],
        responseType: 'EntityCreditScores',
        isList: true,
      }),
      post: this.createOperation('createEntityCreditScores', 'Create entity credit scores request', ['Entities - Credit Scores'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        responseType: 'EntityCreditScores',
      }),
    };

    // /entities/{ent_id}/credit_scores/{crs_id}
    this.spec.paths['/entities/{ent_id}/credit_scores/{crs_id}'] = {
      get: this.createOperation('retrieveEntityCreditScores', 'Retrieve entity credit scores', ['Entities - Credit Scores'], {
        pathParams: ['ent_id', 'crs_id'],
        responseType: 'EntityCreditScores',
      }),
    };

    // /entities/{ent_id}/identities
    this.spec.paths['/entities/{ent_id}/identities'] = {
      get: this.createOperation('listEntityIdentities', 'List entity identities', ['Entities - Identities'], {
        pathParams: ['ent_id'],
        responseType: 'EntityIdentity',
        isList: true,
      }),
      post: this.createOperation('createEntityIdentity', 'Create entity identity request', ['Entities - Identities'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        responseType: 'EntityIdentity',
      }),
    };

    // /entities/{ent_id}/identities/{idn_id}
    this.spec.paths['/entities/{ent_id}/identities/{idn_id}'] = {
      get: this.createOperation('retrieveEntityIdentity', 'Retrieve entity identity', ['Entities - Identities'], {
        pathParams: ['ent_id', 'idn_id'],
        responseType: 'EntityIdentity',
      }),
    };

    // /entities/{ent_id}/attributes
    this.spec.paths['/entities/{ent_id}/attributes'] = {
      get: this.createOperation('listEntityAttributes', 'List entity attributes', ['Entities - Attributes'], {
        pathParams: ['ent_id'],
        responseType: 'EntityAttributes',
        isList: true,
      }),
      post: this.createOperation('createEntityAttributes', 'Create entity attributes request', ['Entities - Attributes'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        requestBody: 'EntityAttributesCreateRequest',
        responseType: 'EntityAttributes',
      }),
    };

    // /entities/{ent_id}/attributes/{atr_id}
    this.spec.paths['/entities/{ent_id}/attributes/{atr_id}'] = {
      get: this.createOperation('retrieveEntityAttributes', 'Retrieve entity attributes', ['Entities - Attributes'], {
        pathParams: ['ent_id', 'atr_id'],
        responseType: 'EntityAttributes',
      }),
    };

    // /entities/{ent_id}/vehicles
    this.spec.paths['/entities/{ent_id}/vehicles'] = {
      get: this.createOperation('listEntityVehicles', 'List entity vehicles', ['Entities - Vehicles'], {
        pathParams: ['ent_id'],
        responseType: 'EntityVehicles',
        isList: true,
      }),
      post: this.createOperation('createEntityVehicles', 'Create entity vehicles request', ['Entities - Vehicles'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        responseType: 'EntityVehicles',
      }),
    };

    // /entities/{ent_id}/vehicles/{vhl_id}
    this.spec.paths['/entities/{ent_id}/vehicles/{vhl_id}'] = {
      get: this.createOperation('retrieveEntityVehicles', 'Retrieve entity vehicles', ['Entities - Vehicles'], {
        pathParams: ['ent_id', 'vhl_id'],
        responseType: 'EntityVehicles',
      }),
    };

    // /entities/{ent_id}/products
    this.spec.paths['/entities/{ent_id}/products'] = {
      get: this.createOperation('listEntityProducts', 'List entity products', ['Entities - Products'], {
        pathParams: ['ent_id'],
        responseType: 'EntityProductListResponse',
      }),
    };

    // /entities/{ent_id}/subscriptions
    this.spec.paths['/entities/{ent_id}/subscriptions'] = {
      get: this.createOperation('listEntitySubscriptions', 'List entity subscriptions', ['Entities - Subscriptions'], {
        pathParams: ['ent_id'],
        responseType: 'EntitySubscription',
        isList: true,
      }),
      post: this.createOperation('createEntitySubscription', 'Create entity subscription', ['Entities - Subscriptions'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        requestBody: 'EntitySubscriptionCreateRequest',
        responseType: 'EntitySubscription',
      }),
    };

    // /entities/{ent_id}/subscriptions/{sub_id}
    this.spec.paths['/entities/{ent_id}/subscriptions/{sub_id}'] = {
      get: this.createOperation('retrieveEntitySubscription', 'Retrieve entity subscription', ['Entities - Subscriptions'], {
        pathParams: ['ent_id', 'sub_id'],
        responseType: 'EntitySubscription',
      }),
      delete: this.createOperation('deleteEntitySubscription', 'Delete entity subscription', ['Entities - Subscriptions'], {
        pathParams: ['ent_id', 'sub_id'],
        responseType: 'EntitySubscription',
      }),
    };

    // /entities/{ent_id}/verification_sessions
    this.spec.paths['/entities/{ent_id}/verification_sessions'] = {
      get: this.createOperation('listEntityVerificationSessions', 'List entity verification sessions', ['Entities - Verification Sessions'], {
        pathParams: ['ent_id'],
        responseType: 'EntityVerificationSession',
        isList: true,
      }),
      post: this.createOperation('createEntityVerificationSession', 'Create entity verification session', ['Entities - Verification Sessions'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        requestBody: 'EntityVerificationSessionCreateRequest',
        responseType: 'EntityVerificationSession',
      }),
    };

    // /entities/{ent_id}/verification_sessions/{evf_id}
    this.spec.paths['/entities/{ent_id}/verification_sessions/{evf_id}'] = {
      get: this.createOperation('retrieveEntityVerificationSession', 'Retrieve entity verification session', ['Entities - Verification Sessions'], {
        pathParams: ['ent_id', 'evf_id'],
        responseType: 'EntityVerificationSession',
      }),
      put: this.createOperation('updateEntityVerificationSession', 'Update entity verification session', ['Entities - Verification Sessions'], { httpMethod: 'put',
        pathParams: ['ent_id', 'evf_id'],
        requestBody: 'EntityVerificationSessionUpdateRequest',
        responseType: 'EntityVerificationSession',
      }),
    };
  }

  private generateAccountPaths(): void {
    // /accounts
    this.spec.paths['/accounts'] = {
      get: this.createOperation('listAccounts', 'List all accounts', ['Accounts'], {
        queryParams: ['from_date', 'to_date', 'page', 'page_limit', 'page_cursor', 'status', 'type', 'holder_id', 'expand', 'liability.mch_id', 'liability.type', 'liability.ownership'],
        responseType: 'Account',
        isList: true,
      }),
      post: this.createOperation('createAccount', 'Create a new account', ['Accounts'], { httpMethod: 'post',
        requestBody: 'AccountCreateRequest',
        responseType: 'Account',
      }),
    };

    // /accounts/{acc_id}
    this.spec.paths['/accounts/{acc_id}'] = {
      get: this.createOperation('retrieveAccount', 'Retrieve an account', ['Accounts'], {
        pathParams: ['acc_id'],
        queryParams: ['expand'],
        responseType: 'Account',
      }),
    };

    // /accounts/{acc_id}/consent
    this.spec.paths['/accounts/{acc_id}/consent'] = {
      post: this.createOperation('withdrawAccountConsent', 'Withdraw account consent', ['Accounts'], { httpMethod: 'post',
        pathParams: ['acc_id'],
        requestBody: 'AccountWithdrawConsentRequest',
        responseType: 'Account',
      }),
    };

    // Account sub-resources
    const accountSubResources = [
      { path: 'balances', name: 'Balance', schema: 'AccountBalance', hasCreate: true },
      { path: 'card_brands', name: 'CardBrand', schema: 'AccountCardBrand', hasCreate: true },
      { path: 'payoffs', name: 'Payoff', schema: 'AccountPayoff', hasCreate: true },
      { path: 'sensitive', name: 'Sensitive', schema: 'AccountSensitive', hasCreate: true, createRequest: 'AccountSensitiveCreateRequest' },
      { path: 'transactions', name: 'Transaction', schema: 'AccountTransaction', hasCreate: false },
      { path: 'updates', name: 'Update', schema: 'AccountUpdate', hasCreate: true },
      { path: 'attributes', name: 'Attributes', schema: 'AccountAttributes', hasCreate: true },
      { path: 'payment_instruments', name: 'PaymentInstrument', schema: 'AccountPaymentInstrument', hasCreate: true, createRequest: 'AccountPaymentInstrumentCreateRequest' },
    ];

    for (const subResource of accountSubResources) {
      const basePath = `/accounts/{acc_id}/${subResource.path}`;
      const itemPath = `${basePath}/{${subResource.path.slice(0, -1)}_id}`;
      const tag = `Accounts - ${subResource.name}s`;

      this.spec.paths[basePath] = {
        get: this.createOperation(`listAccount${subResource.name}s`, `List account ${subResource.path}`, [tag], {
          pathParams: ['acc_id'],
          responseType: subResource.schema,
          isList: true,
        }),
      };

      if (subResource.hasCreate) {
        this.spec.paths[basePath].post = this.createOperation(`createAccount${subResource.name}`, `Create account ${subResource.path.slice(0, -1)}`, [tag], {
          httpMethod: 'post',
          pathParams: ['acc_id'],
          requestBody: subResource.createRequest,
          responseType: subResource.schema,
        });
      }

      this.spec.paths[itemPath] = {
        get: this.createOperation(`retrieveAccount${subResource.name}`, `Retrieve account ${subResource.path.slice(0, -1)}`, [tag], {
          pathParams: ['acc_id', `${subResource.path.slice(0, -1)}_id`],
          responseType: subResource.schema,
        }),
      };
    }

    // Account subscriptions
    this.spec.paths['/accounts/{acc_id}/subscriptions'] = {
      get: this.createOperation('listAccountSubscriptions', 'List account subscriptions', ['Accounts - Subscriptions'], {
        pathParams: ['acc_id'],
        responseType: 'AccountSubscription',
        isList: true,
      }),
      post: this.createOperation('createAccountSubscription', 'Create account subscription', ['Accounts - Subscriptions'], { httpMethod: 'post',
        pathParams: ['acc_id'],
        requestBody: 'AccountSubscriptionCreateRequest',
        responseType: 'AccountSubscription',
      }),
    };

    this.spec.paths['/accounts/{acc_id}/subscriptions/{sub_id}'] = {
      get: this.createOperation('retrieveAccountSubscription', 'Retrieve account subscription', ['Accounts - Subscriptions'], {
        pathParams: ['acc_id', 'sub_id'],
        responseType: 'AccountSubscription',
      }),
      delete: this.createOperation('deleteAccountSubscription', 'Delete account subscription', ['Accounts - Subscriptions'], {
        pathParams: ['acc_id', 'sub_id'],
        responseType: 'AccountSubscription',
      }),
    };

    // Account products
    this.spec.paths['/accounts/{acc_id}/products'] = {
      get: this.createOperation('listAccountProducts', 'List account products', ['Accounts - Products'], {
        pathParams: ['acc_id'],
        responseType: 'AccountProduct',
        isList: true,
      }),
    };

    // Account verification sessions
    this.spec.paths['/accounts/{acc_id}/verification_sessions'] = {
      get: this.createOperation('listAccountVerificationSessions', 'List account verification sessions', ['Accounts - Verification Sessions'], {
        pathParams: ['acc_id'],
        responseType: 'AccountVerificationSession',
        isList: true,
      }),
      post: this.createOperation('createAccountVerificationSession', 'Create account verification session', ['Accounts - Verification Sessions'], { httpMethod: 'post',
        pathParams: ['acc_id'],
        requestBody: 'AccountVerificationSessionCreateRequest',
        responseType: 'AccountVerificationSession',
      }),
    };

    this.spec.paths['/accounts/{acc_id}/verification_sessions/{avf_id}'] = {
      get: this.createOperation('retrieveAccountVerificationSession', 'Retrieve account verification session', ['Accounts - Verification Sessions'], {
        pathParams: ['acc_id', 'avf_id'],
        responseType: 'AccountVerificationSession',
      }),
      put: this.createOperation('updateAccountVerificationSession', 'Update account verification session', ['Accounts - Verification Sessions'], { httpMethod: 'put',
        pathParams: ['acc_id', 'avf_id'],
        requestBody: 'AccountVerificationSessionUpdateRequest',
        responseType: 'AccountVerificationSession',
      }),
    };
  }

  private generatePaymentPaths(): void {
    // /payments
    this.spec.paths['/payments'] = {
      get: this.createOperation('listPayments', 'List all payments', ['Payments'], {
        queryParams: ['from_date', 'to_date', 'page', 'page_limit', 'page_cursor', 'status', 'type', 'source', 'destination', 'reversal_id', 'source_holder_id', 'destination_holder_id', 'acc_id', 'holder_id'],
        responseType: 'Payment',
        isList: true,
      }),
      post: this.createOperation('createPayment', 'Create a new payment', ['Payments'], { httpMethod: 'post',
        requestBody: 'PaymentCreateRequest',
        responseType: 'Payment',
      }),
    };

    // /payments/{pmt_id}
    this.spec.paths['/payments/{pmt_id}'] = {
      get: this.createOperation('retrievePayment', 'Retrieve a payment', ['Payments'], {
        pathParams: ['pmt_id'],
        responseType: 'Payment',
      }),
      delete: this.createOperation('deletePayment', 'Cancel a payment', ['Payments'], {
        pathParams: ['pmt_id'],
        responseType: 'Payment',
      }),
    };

    // /payments/{pmt_id}/reversals
    this.spec.paths['/payments/{pmt_id}/reversals'] = {
      get: this.createOperation('listPaymentReversals', 'List payment reversals', ['Payments - Reversals'], {
        pathParams: ['pmt_id'],
        responseType: 'Reversal',
        isList: true,
      }),
    };

    // /payments/{pmt_id}/reversals/{rvs_id}
    this.spec.paths['/payments/{pmt_id}/reversals/{rvs_id}'] = {
      get: this.createOperation('retrievePaymentReversal', 'Retrieve payment reversal', ['Payments - Reversals'], {
        pathParams: ['pmt_id', 'rvs_id'],
        responseType: 'Reversal',
      }),
      put: this.createOperation('updatePaymentReversal', 'Update payment reversal', ['Payments - Reversals'], { httpMethod: 'put',
        pathParams: ['pmt_id', 'rvs_id'],
        requestBody: 'ReversalUpdateRequest',
        responseType: 'Reversal',
      }),
    };
  }

  private generateWebhookPaths(): void {
    // /webhooks
    this.spec.paths['/webhooks'] = {
      get: this.createOperation('listWebhooks', 'List all webhooks', ['Webhooks'], {
        responseType: 'Webhook',
        isList: true,
      }),
      post: this.createOperation('createWebhook', 'Create a new webhook', ['Webhooks'], { httpMethod: 'post',
        requestBody: 'WebhookCreateRequest',
        responseType: 'Webhook',
      }),
    };

    // /webhooks/{whk_id}
    this.spec.paths['/webhooks/{whk_id}'] = {
      get: this.createOperation('retrieveWebhook', 'Retrieve a webhook', ['Webhooks'], {
        pathParams: ['whk_id'],
        responseType: 'Webhook',
      }),
      patch: this.createOperation('updateWebhook', 'Update a webhook', ['Webhooks'], { httpMethod: 'patch',
        pathParams: ['whk_id'],
        requestBody: 'WebhookUpdateRequest',
        responseType: 'Webhook',
      }),
      delete: this.createOperation('deleteWebhook', 'Delete a webhook', ['Webhooks'], {
        pathParams: ['whk_id'],
        responseType: 'object',
      }),
    };
  }

  private generateReportPaths(): void {
    // /reports
    this.spec.paths['/reports'] = {
      post: this.createOperation('createReport', 'Create a new report', ['Reports'], { httpMethod: 'post',
        requestBody: 'ReportCreateRequest',
        responseType: 'Report',
      }),
    };

    // /reports/{rpt_id}
    this.spec.paths['/reports/{rpt_id}'] = {
      get: this.createOperation('retrieveReport', 'Retrieve a report', ['Reports'], {
        pathParams: ['rpt_id'],
        responseType: 'Report',
      }),
    };

    // /reports/{rpt_id}/download
    this.spec.paths['/reports/{rpt_id}/download'] = {
      get: {
        operationId: 'downloadReport',
        summary: 'Download a report',
        description: 'Download a report as CSV',
        tags: ['Reports'],
        parameters: [
          {
            name: 'rpt_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Report CSV data',
            content: {
              'text/csv': {
                schema: { type: 'string' },
              },
            },
          },
        },
      },
    };
  }

  private generateMerchantPaths(): void {
    // /merchants
    this.spec.paths['/merchants'] = {
      get: this.createOperation('listMerchants', 'List all merchants', ['Merchants'], {
        queryParams: ['page', 'page_limit', 'type', 'name', 'creditor_name', 'provider_id.plaid', 'provider_id.mx', 'provider_id.finicity', 'provider_id.dpp'],
        responseType: 'Merchant',
        isList: true,
      }),
    };

    // /merchants/{mch_id}
    this.spec.paths['/merchants/{mch_id}'] = {
      get: this.createOperation('retrieveMerchant', 'Retrieve a merchant', ['Merchants'], {
        pathParams: ['mch_id'],
        responseType: 'Merchant',
      }),
    };
  }

  private generateEventPaths(): void {
    // /events
    this.spec.paths['/events'] = {
      get: this.createOperation('listEvents', 'List all events', ['Events'], {
        queryParams: ['from_date', 'to_date', 'page', 'page_limit', 'page_cursor', 'resource_id', 'resource_type', 'type'],
        responseType: 'Event',
        isList: true,
      }),
    };

    // /events/{evt_id}
    this.spec.paths['/events/{evt_id}'] = {
      get: this.createOperation('retrieveEvent', 'Retrieve an event', ['Events'], {
        pathParams: ['evt_id'],
        responseType: 'Event',
      }),
    };
  }

  private generateElementPaths(): void {
    // /elements/token
    this.spec.paths['/elements/token'] = {
      post: this.createOperation('createElementToken', 'Create an element token', ['Elements'], { httpMethod: 'post',
        requestBody: 'ElementTokenCreateRequest',
        responseType: 'ElementToken',
      }),
    };

    // /elements/token/{pk_elem_id}/results
    this.spec.paths['/elements/token/{pk_elem_id}/results'] = {
      get: this.createOperation('retrieveElementResults', 'Retrieve element results', ['Elements'], {
        pathParams: ['pk_elem_id'],
        responseType: 'ElementResults',
      }),
    };
  }

  private generateOpalPaths(): void {
    // /opal/token
    this.spec.paths['/opal/token'] = {
      post: this.createOperation('createOpalToken', 'Create an opal token', ['Opal'], { httpMethod: 'post',
        requestBody: 'OpalTokenCreateRequest',
        responseType: 'OpalToken',
      }),
    };
  }

  private generateSimulatePaths(): void {
    // /simulate/payments/{pmt_id}
    this.spec.paths['/simulate/payments/{pmt_id}'] = {
      post: this.createOperation('simulatePaymentUpdate', 'Simulate payment status update', ['Simulate'], { httpMethod: 'post',
        pathParams: ['pmt_id'],
        requestBody: 'SimulatePaymentUpdateRequest',
        responseType: 'Payment',
      }),
    };

    // /simulate/accounts/{acc_id}/transactions
    this.spec.paths['/simulate/accounts/{acc_id}/transactions'] = {
      post: this.createOperation('simulateAccountTransaction', 'Simulate account transaction', ['Simulate'], { httpMethod: 'post',
        pathParams: ['acc_id'],
        responseType: 'AccountTransaction',
      }),
    };

    // /simulate/entities/{ent_id}/connect
    this.spec.paths['/simulate/entities/{ent_id}/connect'] = {
      post: this.createOperation('simulateEntityConnect', 'Simulate entity connect', ['Simulate'], { httpMethod: 'post',
        pathParams: ['ent_id'],
        requestBody: 'SimulateEntityConnectRequest',
        responseType: 'EntityConnect',
      }),
    };

    // /simulate/entities/{ent_id}/credit_scores/{crs_id}
    this.spec.paths['/simulate/entities/{ent_id}/credit_scores/{crs_id}'] = {
      post: this.createOperation('simulateEntityCreditScores', 'Simulate entity credit scores', ['Simulate'], { httpMethod: 'post',
        pathParams: ['ent_id', 'crs_id'],
        responseType: 'EntityCreditScores',
      }),
    };

    // /simulate/entities/{ent_id}/attributes/{atr_id}
    this.spec.paths['/simulate/entities/{ent_id}/attributes/{atr_id}'] = {
      post: this.createOperation('simulateEntityAttributes', 'Simulate entity attributes', ['Simulate'], { httpMethod: 'post',
        pathParams: ['ent_id', 'atr_id'],
        requestBody: 'SimulateEntityAttributesRequest',
        responseType: 'EntityAttributes',
      }),
    };

    // /simulate/events
    this.spec.paths['/simulate/events'] = {
      post: this.createOperation('simulateEvent', 'Simulate an event', ['Simulate'], { httpMethod: 'post',
        responseType: 'Event',
      }),
    };
  }

  private createOperation(
    operationId: string,
    summary: string,
    tags: string[],
    options: {
      pathParams?: string[];
      queryParams?: string[];
      requestBody?: string;
      responseType: string;
      isList?: boolean;
      description?: string;
      httpMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    }
  ): Operation {
    const operation: Operation = {
      operationId,
      summary,
      description: options.description || `${summary}. See https://docs.methodfi.com for more details.`,
      tags,
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: options.responseType === 'object'
                ? { type: 'object' }
                : options.isList
                  ? { type: 'array', items: { $ref: `#/components/schemas/${options.responseType}` } }
                  : { $ref: `#/components/schemas/${options.responseType}` },
            },
          },
        },
      },
    };

    const parameters: Parameter[] = [];

    if (options.pathParams) {
      for (const param of options.pathParams) {
        parameters.push({
          name: param,
          in: 'path',
          required: true,
          schema: { type: 'string' },
        });
      }
    }

    if (options.queryParams) {
      for (const param of options.queryParams) {
        parameters.push({
          name: param,
          in: 'query',
          required: false,
          schema: { type: 'string' },
        });
      }
    }

    // Add Idempotency-Key header for write operations (POST, PUT, PATCH)
    // This ensures idempotency support is exposed in generated clients
    if (options.httpMethod && ['post', 'put', 'patch'].includes(options.httpMethod)) {
      parameters.push({
        name: 'Idempotency-Key',
        in: 'header',
        required: false,
        schema: { type: 'string' },
        description: 'Optional idempotency key to prevent duplicate requests. See https://docs.methodfi.com for more details.',
      });
    }

    if (parameters.length > 0) {
      operation.parameters = parameters;
    }

    if (options.requestBody) {
      operation.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${options.requestBody}` },
          },
        },
      };
    }

    return operation;
  }

  toYAML(): string {
    return yaml.dump(this.spec, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });
  }

  toJSON(): string {
    return JSON.stringify(this.spec, null, 2);
  }
}

// ============================================================================
// Main execution
// ============================================================================

async function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const outputPath = path.join(__dirname, '..', 'openapi.yaml');

  console.log('Parsing TypeScript source files...');
  const parser = new TypeScriptParser(srcDir);
  parser.parse();

  console.log('Generating OpenAPI specification...');
  const generator = new OpenAPIGenerator(
    parser.getInterfaces(),
    parser.getEnums(),
    parser.getTypeAliases()
  );
  generator.generate();

  console.log('Writing OpenAPI specification to file...');
  const yamlOutput = generator.toYAML();
  fs.writeFileSync(outputPath, yamlOutput, 'utf-8');

  console.log(`OpenAPI specification generated successfully: ${outputPath}`);

  // Also output JSON version
  const jsonOutputPath = path.join(__dirname, '..', 'openapi.json');
  fs.writeFileSync(jsonOutputPath, generator.toJSON(), 'utf-8');
  console.log(`JSON version also generated: ${jsonOutputPath}`);
}

main().catch((error) => {
  console.error('Error generating OpenAPI specification:', error);
  process.exit(1);
});
