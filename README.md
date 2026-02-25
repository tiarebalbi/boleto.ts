# boleto.ts

[![npm version](https://img.shields.io/npm/v/@tiare.balbi/boleto.ts)](https://www.npmjs.com/package/@tiare.balbi/boleto.ts)
[![npm downloads](https://img.shields.io/npm/dm/@tiare.balbi/boleto.ts)](https://www.npmjs.com/package/@tiare.balbi/boleto.ts)
[![License: MIT](https://img.shields.io/npm/l/@tiare.balbi/boleto.ts)](https://github.com/tiarebalbi/boleto.ts/blob/main/LICENSE)

A TypeScript library for parsing and rendering Brazilian bank payment slips (boletos bancários).

This is a TypeScript fork of [boleto.js](https://github.com/guilhermearaujo/boleto.js), providing full type safety and modern ES module support.

## Features

- 🔒 Full TypeScript support with typed objects
- 📊 Render barcodes as SVG
- ✅ Validate boleto numbers
- 💰 Extract payment information (amount, bank, expiration date)
- 🎯 Works in browsers and Node.js

## Installation

### npm

```bash
npm install @tiare.balbi/boleto.ts
```

### yarn

```bash
yarn add @tiare.balbi/boleto.ts
```

### pnpm

```bash
pnpm add @tiare.balbi/boleto.ts
```

## Usage

### Basic Usage

```typescript
import { Boleto } from '@tiare.balbi/boleto.ts';

const number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
const boleto = new Boleto(number);

// Render barcode as SVG in an element
boleto.toSVG('#boleto');

// Or get the SVG as a string
const svg = boleto.toSVG();
console.log(svg);
```

### HTML Integration

```html
<div id="boleto"></div>

<script type="module">
  import { Boleto } from '@tiare.balbi/boleto.ts';

  const number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
  new Boleto(number).toSVG('#boleto');
</script>
```

### React Component

```tsx
import { useEffect, useRef, useState } from 'react';
import { Boleto } from '@tiare.balbi/boleto.ts';

interface BoletoViewerProps {
  number: string;
}

export function BoletoViewer({ number }: BoletoViewerProps) {
  const barcodeRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<{
    bank: string;
    prettyAmount: string;
    prettyNumber: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const boleto = new Boleto(number);

      setInfo({
        bank: boleto.bank(),
        prettyAmount: boleto.prettyAmount(),
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

  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div id="boleto-barcode" ref={barcodeRef} />
      {info && (
        <div>
          <p>Bank: {info.bank}</p>
          <p>Amount: {info.prettyAmount}</p>
          <p>Number: {info.prettyNumber}</p>
        </div>
      )}
    </div>
  );
}

// Usage: <BoletoViewer number="23793.38128 86000.000009 00000.000380 1 84660000012345" />
```

### Vue Component

```vue
<template>
  <div>
    <div v-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div ref="barcodeContainer" class="barcode"></div>
      <div v-if="info">
        <p><strong>Bank:</strong> {{ info.bank }}</p>
        <p><strong>Amount:</strong> {{ info.prettyAmount }}</p>
        <p><strong>Number:</strong> {{ info.prettyNumber }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Boleto } from '@tiare.balbi/boleto.ts';

const props = defineProps<{ number: string }>();

const barcodeContainer = ref<HTMLDivElement | null>(null);
const info = ref<{
  bank: string;
  prettyAmount: string;
  prettyNumber: string;
} | null>(null);
const error = ref<string | null>(null);

function renderBoleto() {
  try {
    const boleto = new Boleto(props.number);

    info.value = {
      bank: boleto.bank(),
      prettyAmount: boleto.prettyAmount(),
      prettyNumber: boleto.prettyNumber(),
    };

    if (barcodeContainer.value) {
      barcodeContainer.value.innerHTML = '';
      const svg = boleto.toSVG();
      if (svg) barcodeContainer.value.innerHTML = svg;
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
```

The boleto number can contain only digits or be formatted with dots and spaces. The library will filter and validate the digits before rendering the barcode.

> For more detailed examples including error handling, Node.js integration, and additional framework patterns, see the [Usage Guide](USAGE.md).

## API Reference

### Constructor

```typescript
new Boleto(boletoNumber: string)
```

Creates a new Boleto instance with the provided number.

### Methods

#### Number Methods

```typescript
// Get the raw number (digits only)
boleto.number();
// Returns: '34195000080123320318964221470004584410000002000'

// Get the formatted number (linha digitável)
boleto.prettyNumber();
// Returns: '34195.00008 01233.203189 64221.470004 5 84410000002000'
```

#### Barcode Methods

```typescript
// Get the barcode number
boleto.barcode();
// Returns: '34195844100000020005000001233203186422147000'

// Get the checksum digit
boleto.checksum();
// Returns: '5'
```

#### Payment Information

```typescript
// Get the payment amount
boleto.amount();
// Returns: 20.00

// Get the formatted amount
boleto.prettyAmount();
// Returns: 'R$ 20,00'

// Get the bank name
boleto.bank();
// Returns: 'Itaú'

// Get currency information
boleto.currency();
// Returns: { code: 'BRL', symbol: 'R$', decimal: ',' }

// Get the expiration date
boleto.expirationDate();
// Returns: Date object
```

#### Rendering

```typescript
// Render to an HTML element
boleto.toSVG('#element-selector');

// Get SVG as string
const svgString = boleto.toSVG();
```

## Barcode Output

The barcode is rendered as SVG, providing excellent sharpness at various sizes. Since it uses vectors instead of images, it's ideal for responsive layouts.

## License

MIT © [Tiare Balbi](https://github.com/tiarebalbi)

This project is a fork of [boleto.js](https://github.com/guilhermearaujo/boleto.js) by [Guilherme Araújo](https://github.com/guilhermearaujo).
