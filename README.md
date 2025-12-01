# boleto.ts

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
npm install @tiarebalbi/boleto.ts
```

### yarn

```bash
yarn add @tiarebalbi/boleto.ts
```

### pnpm

```bash
pnpm add @tiarebalbi/boleto.ts
```

## Usage

### Basic Usage

```typescript
import { Boleto } from '@tiarebalbi/boleto.ts';

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
  import { Boleto } from '@tiarebalbi/boleto.ts';
  
  const number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
  new Boleto(number).toSVG('#boleto');
</script>
```

The boleto number can contain only digits or be formatted with dots and spaces. The library will filter and validate the digits before rendering the barcode.

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
