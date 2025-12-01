# Usage Guide

This guide provides technical details and examples for using the `@tiarebalbi/boleto.ts` library to parse and render Brazilian bank payment slips (boletos bancários).

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Boleto Class](#boleto-class)
  - [Methods](#methods)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Browser Integration](#browser-integration)
  - [Node.js Integration](#nodejs-integration)
  - [React Component](#react-component)
  - [Vue Component](#vue-component)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Supported Banks](#supported-banks)

## Installation

```bash
# npm
npm install @tiarebalbi/boleto.ts

# yarn
yarn add @tiarebalbi/boleto.ts

# pnpm
pnpm add @tiarebalbi/boleto.ts
```

## Quick Start

```typescript
import { Boleto } from '@tiarebalbi/boleto.ts';

// Create a boleto instance with the printed number
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');

// Get payment information
console.log(boleto.bank());           // 'Bradesco'
console.log(boleto.amount());         // '123.45'
console.log(boleto.prettyAmount());   // 'R$ 123,45'
console.log(boleto.expirationDate()); // Date object

// Render barcode as SVG
const svgString = boleto.toSVG();
```

## API Reference

### Boleto Class

The main class for parsing and rendering Brazilian bank payment slips.

#### Constructor

```typescript
new Boleto(bankSlipNumber: string)
```

**Parameters:**
- `bankSlipNumber`: The bank slip number (linha digitável). Can contain formatting characters (dots, spaces) which will be automatically stripped.

**Throws:**
- `Error` if the bank slip number is invalid (wrong length or invalid checksum).

**Example:**
```typescript
// Both formats are accepted
const boleto1 = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
const boleto2 = new Boleto('23793381288600000000900000000380184660000012345');
```

### Methods

#### `number(): string`

Returns the raw bank slip number (digits only, 47 characters).

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.number();
// Returns: '23793381288600000000900000000380184660000012345'
```

#### `prettyNumber(): string`

Returns the formatted bank slip number with the standard mask.

```typescript
const boleto = new Boleto('23793381288600000000900000000380184660000012345');
boleto.prettyNumber();
// Returns: '23793.38128 86000.000009 00000.000380 1 84660000012345'
```

#### `barcode(): string`

Converts the bank slip number to its barcode representation (44 digits).

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.barcode();
// Returns: '23791846600000123453381286000000000000000038'
```

#### `checksum(): string`

Returns the verification digit of the barcode (5th digit).

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.checksum();
// Returns: '1'
```

#### `bank(): string`

Returns the name of the issuing bank based on the bank code.

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.bank();
// Returns: 'Bradesco'
```

#### `currency(): Currency | 'Unknown'`

Returns currency information for the bank slip.

```typescript
interface Currency {
  code: string;    // ISO 4217 code (e.g., 'BRL')
  symbol: string;  // Currency symbol (e.g., 'R$')
  decimal: string; // Decimal separator (e.g., ',')
}

const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.currency();
// Returns: { code: 'BRL', symbol: 'R$', decimal: ',' }
```

#### `amount(): string`

Returns the payment amount as a string with 2 decimal places.

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.amount();
// Returns: '123.45'
```

#### `prettyAmount(): string`

Returns the formatted payment amount with currency symbol.

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.prettyAmount();
// Returns: 'R$ 123,45'
```

#### `expirationDate(): Date`

Returns the expiration date of the bank slip as a JavaScript Date object.

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.expirationDate();
// Returns: Date object representing the expiration date
```

#### `toSVG(selector?: string): string | null`

Renders the barcode as an SVG element.

**Parameters:**
- `selector` (optional): CSS selector for the DOM element where the SVG should be appended.

**Returns:**
- If `selector` is omitted: returns the SVG as a string.
- If `selector` is provided: appends the SVG to the selected element and returns `null`.

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');

// Get SVG as string
const svgString = boleto.toSVG();

// Append to DOM element
boleto.toSVG('#barcode-container');
```

#### `valid(): boolean`

Validates whether the bank slip number is valid.

```typescript
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');
boleto.valid();
// Returns: true
```

## Examples

### Basic Usage

```typescript
import { Boleto } from '@tiarebalbi/boleto.ts';

const boletoNumber = '23793.38128 86000.000009 00000.000380 1 84660000012345';

try {
  const boleto = new Boleto(boletoNumber);
  
  console.log('Bank:', boleto.bank());
  console.log('Amount:', boleto.prettyAmount());
  console.log('Expires:', boleto.expirationDate().toLocaleDateString('pt-BR'));
  console.log('Barcode:', boleto.barcode());
} catch (error) {
  console.error('Invalid boleto number:', error.message);
}
```

### Browser Integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Boleto Viewer</title>
  <style>
    #barcode {
      width: 100%;
      max-width: 400px;
      height: 80px;
    }
    .info {
      margin: 10px 0;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>Boleto Viewer</h1>
  
  <div id="barcode"></div>
  
  <div class="info">
    <p>Bank: <span id="bank"></span></p>
    <p>Amount: <span id="amount"></span></p>
    <p>Expiration: <span id="expiration"></span></p>
    <p>Number: <span id="number"></span></p>
  </div>

  <script type="module">
    import { Boleto } from '@tiarebalbi/boleto.ts';
    
    const boletoNumber = '23793.38128 86000.000009 00000.000380 1 84660000012345';
    
    try {
      const boleto = new Boleto(boletoNumber);
      
      // Render barcode
      boleto.toSVG('#barcode');
      
      // Display information
      document.getElementById('bank').textContent = boleto.bank();
      document.getElementById('amount').textContent = boleto.prettyAmount();
      document.getElementById('expiration').textContent = boleto.expirationDate().toLocaleDateString('pt-BR');
      document.getElementById('number').textContent = boleto.prettyNumber();
    } catch (error) {
      console.error('Error:', error.message);
    }
  </script>
</body>
</html>
```

### Node.js Integration

```typescript
import { Boleto } from '@tiarebalbi/boleto.ts';
import { JSDOM } from 'jsdom';

// Set up DOM environment for SVG generation
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.XMLSerializer = dom.window.XMLSerializer;

const boletoNumber = '23793.38128 86000.000009 00000.000380 1 84660000012345';

try {
  const boleto = new Boleto(boletoNumber);
  
  // Get payment details
  const details = {
    bank: boleto.bank(),
    amount: boleto.amount(),
    prettyAmount: boleto.prettyAmount(),
    expirationDate: boleto.expirationDate(),
    barcode: boleto.barcode(),
    number: boleto.number(),
    prettyNumber: boleto.prettyNumber(),
  };
  
  console.log(JSON.stringify(details, null, 2));
  
  // Generate SVG string
  const svg = boleto.toSVG();
  console.log('SVG:', svg);
} catch (error) {
  console.error('Invalid boleto:', error.message);
}
```

### React Component

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { Boleto } from '@tiarebalbi/boleto.ts';

interface BoletoViewerProps {
  number: string;
}

interface BoletoInfo {
  bank: string;
  amount: string;
  prettyAmount: string;
  expirationDate: Date;
  prettyNumber: string;
}

export function BoletoViewer({ number }: BoletoViewerProps) {
  const barcodeRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<BoletoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const boleto = new Boleto(number);
      
      setInfo({
        bank: boleto.bank(),
        amount: boleto.amount(),
        prettyAmount: boleto.prettyAmount(),
        expirationDate: boleto.expirationDate(),
        prettyNumber: boleto.prettyNumber(),
      });
      
      if (barcodeRef.current) {
        barcodeRef.current.innerHTML = '';
        boleto.toSVG(`#${barcodeRef.current.id}`);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid boleto number');
      setInfo(null);
    }
  }, [number]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="boleto-viewer">
      <div id="boleto-barcode" ref={barcodeRef} style={{ width: '100%', height: '80px' }} />
      {info && (
        <div className="boleto-info">
          <p><strong>Bank:</strong> {info.bank}</p>
          <p><strong>Amount:</strong> {info.prettyAmount}</p>
          <p><strong>Expiration:</strong> {info.expirationDate.toLocaleDateString('pt-BR')}</p>
          <p><strong>Number:</strong> {info.prettyNumber}</p>
        </div>
      )}
    </div>
  );
}

// Usage
// <BoletoViewer number="23793.38128 86000.000009 00000.000380 1 84660000012345" />
```

### Vue Component

```vue
<template>
  <div class="boleto-viewer">
    <div v-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div ref="barcodeContainer" class="barcode"></div>
      <div v-if="info" class="boleto-info">
        <p><strong>Bank:</strong> {{ info.bank }}</p>
        <p><strong>Amount:</strong> {{ info.prettyAmount }}</p>
        <p><strong>Expiration:</strong> {{ formattedDate }}</p>
        <p><strong>Number:</strong> {{ info.prettyNumber }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Boleto } from '@tiarebalbi/boleto.ts';

interface BoletoInfo {
  bank: string;
  amount: string;
  prettyAmount: string;
  expirationDate: Date;
  prettyNumber: string;
}

const props = defineProps<{
  number: string;
}>();

const barcodeContainer = ref<HTMLDivElement | null>(null);
const info = ref<BoletoInfo | null>(null);
const error = ref<string | null>(null);

const formattedDate = computed(() => {
  return info.value?.expirationDate.toLocaleDateString('pt-BR') ?? '';
});

function renderBoleto() {
  try {
    const boleto = new Boleto(props.number);
    
    info.value = {
      bank: boleto.bank(),
      amount: boleto.amount(),
      prettyAmount: boleto.prettyAmount(),
      expirationDate: boleto.expirationDate(),
      prettyNumber: boleto.prettyNumber(),
    };
    
    if (barcodeContainer.value) {
      barcodeContainer.value.innerHTML = '';
      const svg = boleto.toSVG();
      if (svg) {
        barcodeContainer.value.innerHTML = svg;
      }
    }
    
    error.value = null;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Invalid boleto number';
    info.value = null;
  }
}

onMounted(renderBoleto);
watch(() => props.number, renderBoleto);
</script>

<style scoped>
.barcode {
  width: 100%;
  max-width: 400px;
  height: 80px;
}

.error {
  color: red;
}
</style>
```

## Error Handling

The library throws an error when an invalid boleto number is provided:

```typescript
import { Boleto } from '@tiarebalbi/boleto.ts';

// Invalid number - wrong length
try {
  new Boleto('1234567890');
} catch (error) {
  console.error(error.message); // 'Invalid bank slip number'
}

// Invalid number - wrong checksum
try {
  new Boleto('12345678901234567890123456789012345678901234567');
} catch (error) {
  console.error(error.message); // 'Invalid bank slip number'
}

// Validation function for user input
function validateBoletoNumber(input: string): boolean {
  try {
    new Boleto(input);
    return true;
  } catch {
    return false;
  }
}
```

## TypeScript Support

The library provides full TypeScript support with exported types:

```typescript
import { Boleto } from '@tiarebalbi/boleto.ts';
import type { Currency } from '@tiarebalbi/boleto.ts';

// All methods are fully typed
const boleto = new Boleto('23793.38128 86000.000009 00000.000380 1 84660000012345');

const number: string = boleto.number();
const barcode: string = boleto.barcode();
const bank: string = boleto.bank();
const amount: string = boleto.amount();
const date: Date = boleto.expirationDate();
const currency: Currency | 'Unknown' = boleto.currency();

// Type guard for currency
if (currency !== 'Unknown') {
  console.log(currency.code);   // 'BRL'
  console.log(currency.symbol); // 'R$'
  console.log(currency.decimal);// ','
}
```

## Supported Banks

The library recognizes the following Brazilian banks:

| Code | Bank Name |
|------|-----------|
| 001 | Banco do Brasil |
| 007 | BNDES |
| 033 | Santander |
| 069 | Crefisa |
| 077 | Banco Inter |
| 102 | XP Investimentos |
| 104 | Caixa Econômica Federal |
| 140 | Easynvest |
| 197 | Stone |
| 208 | BTG Pactual |
| 212 | Banco Original |
| 237 | Bradesco |
| 260 | Nu Pagamentos |
| 341 | Itaú |
| 389 | Banco Mercantil do Brasil |
| 422 | Banco Safra |
| 505 | Credit Suisse |
| 633 | Banco Rendimento |
| 652 | Itaú Unibanco |
| 735 | Banco Neon |
| 739 | Banco Cetelem |
| 745 | Citibank |

Banks not in this list will return `'Unknown'` from the `bank()` method.
