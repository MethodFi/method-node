# OpenAPI Specification Scripts

This directory contains scripts for generating and validating the OpenAPI 3.0 specification from the Method Node.js SDK.

## Scripts

### generate-openapi.ts

Generates an OpenAPI 3.0.3 specification by parsing the TypeScript SDK source files.

**Usage:**
```bash
npm run generate:openapi
```

**Output:**
- `openapi.yaml` - YAML format specification
- `openapi.json` - JSON format specification

**What it does:**
1. Parses all `types.ts` files in `src/resources/` to extract TypeScript interfaces
2. Converts TypeScript types to OpenAPI schemas (handling nullables, arrays, enums, etc.)
3. Generates path definitions for all API endpoints based on SDK resource structure
4. Automatically adds `Idempotency-Key` header parameter to all POST, PUT, and PATCH operations
5. Outputs both YAML and JSON versions of the specification

**Idempotency Support:**
The generator automatically includes the `Idempotency-Key` header parameter for all write operations (POST, PUT, PATCH). This ensures that generated clients expose idempotency as a first-class feature, preventing duplicate requests. The header is optional and follows the implementation in `src/resource.ts` where it's injected via request interceptors.

### validate-openapi.ts

Validates the generated OpenAPI spec against the SDK source to ensure they match.

**Usage:**
```bash
npm run validate:openapi
```

**What it validates:**
- All expected API paths are present in the spec
- HTTP methods match the SDK implementation
- Schema properties match SDK interface definitions
- Required vs optional field alignment

## Linting

The OpenAPI spec can be linted using Spectral for style and correctness:

```bash
npm run lint:openapi
```

This uses the `.spectral.yaml` configuration in the project root.

## Workflow

1. **Generate** the spec after SDK changes:
   ```bash
   npm run generate:openapi
   ```

2. **Validate** the spec matches the SDK:
   ```bash
   npm run validate:openapi
   ```

3. **Lint** for style issues:
   ```bash
   npm run lint:openapi
   ```

## Using the Generated Spec

The generated OpenAPI specification can be used with code generators to create clients in other languages:

```bash
# Generate a Kotlin client
npx @openapitools/openapi-generator-cli generate \
  -i openapi.yaml \
  -g kotlin \
  -o ./generated/kotlin-client

# Generate a Java client
npx @openapitools/openapi-generator-cli generate \
  -i openapi.yaml \
  -g java \
  -o ./generated/java-client
```

See [OpenAPI Generator](https://openapi-generator.tech/docs/generators) for all available generators.

## Type Mapping

| TypeScript | OpenAPI |
|------------|---------|
| `string` | `type: string` |
| `number` | `type: number` |
| `boolean` | `type: boolean` |
| `string \| null` | `type: string, nullable: true` |
| `T[]` | `type: array, items: {$ref: T}` |
| `interface I{...}` | `$ref: '#/components/schemas/...'` |
| `keyof typeof X` | `enum: [...]` |
| Optional `prop?:` | Not in `required` array |

## Configuration

The scripts use their own TypeScript configuration in `tsconfig.scripts.json` to avoid conflicts with the main SDK build configuration.
