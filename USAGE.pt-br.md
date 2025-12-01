# Guia de Uso

Este guia fornece detalhes técnicos e exemplos para usar a biblioteca `boleto.ts` para analisar e renderizar boletos bancários brasileiros.

## Índice

- [Instalação](#instalação)
- [Início Rápido](#início-rápido)
- [Referência da API](#referência-da-api)
  - [Classe Boleto](#classe-boleto)
  - [Métodos](#métodos)
- [Exemplos](#exemplos)
  - [Uso Básico](#uso-básico)
  - [Integração com Navegador](#integração-com-navegador)
  - [Integração com Node.js](#integração-com-nodejs)
  - [Componente React](#componente-react)
  - [Componente Vue](#componente-vue)
- [Tratamento de Erros](#tratamento-de-erros)
- [Suporte a TypeScript](#suporte-a-typescript)
- [Bancos Suportados](#bancos-suportados)

## Instalação

```bash
# npm
npm install boleto.ts

# yarn
yarn add boleto.ts

# pnpm
pnpm add boleto.ts
```

## Início Rápido

```typescript
import { Boleto } from 'boleto.ts';

// Cria uma instância de boleto com o número impresso
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);

// Obtém informações de pagamento
console.log(boleto.bank()); // 'Bradesco'
console.log(boleto.amount()); // '123.45'
console.log(boleto.prettyAmount()); // 'R$ 123,45'
console.log(boleto.expirationDate()); // Objeto Date

// Renderiza código de barras como SVG
const svgString = boleto.toSVG();
```

## Referência da API

### Classe Boleto

A classe principal para analisar e renderizar boletos bancários brasileiros.

#### Construtor

```typescript
new Boleto(bankSlipNumber: string)
```

**Parâmetros:**

- `bankSlipNumber`: O número do boleto (linha digitável). Pode conter caracteres de formatação (pontos, espaços) que serão automaticamente removidos.

**Lança:**

- `Error` se o número do boleto for inválido (tamanho incorreto ou soma de verificação inválida).

**Exemplo:**

```typescript
// Ambos os formatos são aceitos
const boleto1 = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
const boleto2 = new Boleto('23793381288600000000900000000380184660000012345');
```

### Métodos

#### `number(): string`

Retorna o número do boleto sem formatação (apenas dígitos, 47 caracteres).

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.number();
// Retorna: '23793381288600000000900000000380184660000012345'
```

#### `prettyNumber(): string`

Retorna o número do boleto formatado com a máscara padrão.

```typescript
const boleto = new Boleto('23793381288600000000900000000380184660000012345');
boleto.prettyNumber();
// Retorna: '23793.38128 86000.000009 00000.000380 1 84660000012345'
```

#### `barcode(): string`

Converte o número do boleto para sua representação em código de barras (44 dígitos).

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.barcode();
// Retorna: '23791846600000123453381286000000000000000038'
```

#### `checksum(): string`

Retorna o dígito verificador do código de barras (5º dígito).

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.checksum();
// Retorna: '1'
```

#### `bank(): string`

Retorna o nome do banco emissor baseado no código do banco.

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.bank();
// Retorna: 'Bradesco'
```

#### `currency(): Currency | 'Unknown'`

Retorna informações da moeda do boleto.

```typescript
interface Currency {
  code: string; // Código ISO 4217 (ex: 'BRL')
  symbol: string; // Símbolo da moeda (ex: 'R$')
  decimal: string; // Separador decimal (ex: ',')
}

const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.currency();
// Retorna: { code: 'BRL', symbol: 'R$', decimal: ',' }
```

#### `amount(): string`

Retorna o valor do pagamento como string com 2 casas decimais.

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.amount();
// Retorna: '123.45'
```

#### `prettyAmount(): string`

Retorna o valor do pagamento formatado com símbolo da moeda.

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.prettyAmount();
// Retorna: 'R$ 123,45'
```

#### `expirationDate(): Date`

Retorna a data de vencimento do boleto como um objeto Date do JavaScript.

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.expirationDate();
// Retorna: Objeto Date representando a data de vencimento
```

#### `toSVG(selector?: string): string | null`

Renderiza o código de barras como um elemento SVG.

**Parâmetros:**

- `selector` (opcional): Seletor CSS para o elemento DOM onde o SVG deve ser inserido.

**Retorna:**

- Se `selector` for omitido: retorna o SVG como string.
- Se `selector` for fornecido: insere o SVG no elemento selecionado e retorna `null`.

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);

// Obtém SVG como string
const svgString = boleto.toSVG();

// Insere no elemento DOM
boleto.toSVG('#container-codigo-barras');
```

#### `valid(): boolean`

Valida se o número do boleto é válido.

```typescript
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);
boleto.valid();
// Retorna: true
```

## Exemplos

### Uso Básico

```typescript
import { Boleto } from 'boleto.ts';

const numeroBoleto = '23793.38128 86000.000009 00000.000380 1 84660000012345';

try {
  const boleto = new Boleto(numeroBoleto);

  console.log('Banco:', boleto.bank());
  console.log('Valor:', boleto.prettyAmount());
  console.log(
    'Vencimento:',
    boleto.expirationDate().toLocaleDateString('pt-BR'),
  );
  console.log('Código de Barras:', boleto.barcode());
} catch (error) {
  console.error('Número de boleto inválido:', error.message);
}
```

### Integração com Navegador

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Visualizador de Boleto</title>
    <style>
      #codigo-barras {
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
    <h1>Visualizador de Boleto</h1>

    <div id="codigo-barras"></div>

    <div class="info">
      <p>Banco: <span id="banco"></span></p>
      <p>Valor: <span id="valor"></span></p>
      <p>Vencimento: <span id="vencimento"></span></p>
      <p>Número: <span id="numero"></span></p>
    </div>

    <script type="module">
      import { Boleto } from 'boleto.ts';

      const numeroBoleto =
        '23793.38128 86000.000009 00000.000380 1 84660000012345';

      try {
        const boleto = new Boleto(numeroBoleto);

        // Renderiza código de barras
        boleto.toSVG('#codigo-barras');

        // Exibe informações
        document.getElementById('banco').textContent = boleto.bank();
        document.getElementById('valor').textContent = boleto.prettyAmount();
        document.getElementById('vencimento').textContent = boleto
          .expirationDate()
          .toLocaleDateString('pt-BR');
        document.getElementById('numero').textContent = boleto.prettyNumber();
      } catch (error) {
        console.error('Erro:', error.message);
      }
    </script>
  </body>
</html>
```

### Integração com Node.js

```typescript
import { Boleto } from 'boleto.ts';
import { JSDOM } from 'jsdom';

// Configura ambiente DOM para geração de SVG
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.XMLSerializer = dom.window.XMLSerializer;

const numeroBoleto = '23793.38128 86000.000009 00000.000380 1 84660000012345';

try {
  const boleto = new Boleto(numeroBoleto);

  // Obtém detalhes do pagamento
  const detalhes = {
    banco: boleto.bank(),
    valor: boleto.amount(),
    valorFormatado: boleto.prettyAmount(),
    dataVencimento: boleto.expirationDate(),
    codigoBarras: boleto.barcode(),
    numero: boleto.number(),
    numeroFormatado: boleto.prettyNumber(),
  };

  console.log(JSON.stringify(detalhes, null, 2));

  // Gera string SVG
  const svg = boleto.toSVG();
  console.log('SVG:', svg);
} catch (error) {
  console.error('Boleto inválido:', error.message);
}
```

### Componente React

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { Boleto } from 'boleto.ts';

interface BoletoViewerProps {
  numero: string;
}

interface InfoBoleto {
  banco: string;
  valor: string;
  valorFormatado: string;
  dataVencimento: Date;
  numeroFormatado: string;
}

export function VisualizadorBoleto({ numero }: BoletoViewerProps) {
  const refCodigoBarras = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<InfoBoleto | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    try {
      const boleto = new Boleto(numero);

      setInfo({
        banco: boleto.bank(),
        valor: boleto.amount(),
        valorFormatado: boleto.prettyAmount(),
        dataVencimento: boleto.expirationDate(),
        numeroFormatado: boleto.prettyNumber(),
      });

      if (refCodigoBarras.current) {
        refCodigoBarras.current.innerHTML = '';
        boleto.toSVG(`#${refCodigoBarras.current.id}`);
      }

      setErro(null);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Número de boleto inválido');
      setInfo(null);
    }
  }, [numero]);

  if (erro) {
    return <div className="erro">{erro}</div>;
  }

  return (
    <div className="visualizador-boleto">
      <div
        id="boleto-codigo-barras"
        ref={refCodigoBarras}
        style={{ width: '100%', height: '80px' }}
      />
      {info && (
        <div className="info-boleto">
          <p>
            <strong>Banco:</strong> {info.banco}
          </p>
          <p>
            <strong>Valor:</strong> {info.valorFormatado}
          </p>
          <p>
            <strong>Vencimento:</strong>{' '}
            {info.dataVencimento.toLocaleDateString('pt-BR')}
          </p>
          <p>
            <strong>Número:</strong> {info.numeroFormatado}
          </p>
        </div>
      )}
    </div>
  );
}

// Uso
// <VisualizadorBoleto numero="23793.38128 86000.000009 00000.000380 1 84660000012345" />
```

### Componente Vue

```vue
<template>
  <div class="visualizador-boleto">
    <div v-if="erro" class="erro">{{ erro }}</div>
    <template v-else>
      <div ref="containerCodigoBarras" class="codigo-barras"></div>
      <div v-if="info" class="info-boleto">
        <p><strong>Banco:</strong> {{ info.banco }}</p>
        <p><strong>Valor:</strong> {{ info.valorFormatado }}</p>
        <p><strong>Vencimento:</strong> {{ dataFormatada }}</p>
        <p><strong>Número:</strong> {{ info.numeroFormatado }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Boleto } from 'boleto.ts';

interface InfoBoleto {
  banco: string;
  valor: string;
  valorFormatado: string;
  dataVencimento: Date;
  numeroFormatado: string;
}

const props = defineProps<{
  numero: string;
}>();

const containerCodigoBarras = ref<HTMLDivElement | null>(null);
const info = ref<InfoBoleto | null>(null);
const erro = ref<string | null>(null);

const dataFormatada = computed(() => {
  return info.value?.dataVencimento.toLocaleDateString('pt-BR') ?? '';
});

function renderizarBoleto() {
  try {
    const boleto = new Boleto(props.numero);

    info.value = {
      banco: boleto.bank(),
      valor: boleto.amount(),
      valorFormatado: boleto.prettyAmount(),
      dataVencimento: boleto.expirationDate(),
      numeroFormatado: boleto.prettyNumber(),
    };

    if (containerCodigoBarras.value) {
      containerCodigoBarras.value.innerHTML = '';
      const svg = boleto.toSVG();
      if (svg) {
        containerCodigoBarras.value.innerHTML = svg;
      }
    }

    erro.value = null;
  } catch (err) {
    erro.value =
      err instanceof Error ? err.message : 'Número de boleto inválido';
    info.value = null;
  }
}

onMounted(renderizarBoleto);
watch(() => props.numero, renderizarBoleto);
</script>

<style scoped>
.codigo-barras {
  width: 100%;
  max-width: 400px;
  height: 80px;
}

.erro {
  color: red;
}
</style>
```

## Tratamento de Erros

A biblioteca lança um erro quando um número de boleto inválido é fornecido:

```typescript
import { Boleto } from 'boleto.ts';

// Número inválido - tamanho incorreto
try {
  new Boleto('1234567890');
} catch (error) {
  console.error(error.message); // 'Invalid bank slip number'
}

// Número inválido - soma de verificação incorreta
try {
  new Boleto('12345678901234567890123456789012345678901234567');
} catch (error) {
  console.error(error.message); // 'Invalid bank slip number'
}

// Função de validação para entrada do usuário
function validarNumeroBoleto(entrada: string): boolean {
  try {
    new Boleto(entrada);
    return true;
  } catch {
    return false;
  }
}
```

## Suporte a TypeScript

A biblioteca fornece suporte completo a TypeScript com tipos exportados:

```typescript
import { Boleto } from 'boleto.ts';
import type { Currency } from 'boleto.ts';

// Todos os métodos são totalmente tipados
const boleto = new Boleto(
  '23793.38128 86000.000009 00000.000380 1 84660000012345',
);

const numero: string = boleto.number();
const codigoBarras: string = boleto.barcode();
const banco: string = boleto.bank();
const valor: string = boleto.amount();
const data: Date = boleto.expirationDate();
const moeda: Currency | 'Unknown' = boleto.currency();

// Type guard para moeda
if (moeda !== 'Unknown') {
  console.log(moeda.code); // 'BRL'
  console.log(moeda.symbol); // 'R$'
  console.log(moeda.decimal); // ','
}
```

## Bancos Suportados

A biblioteca reconhece os seguintes bancos brasileiros:

| Código | Nome do Banco             |
| ------ | ------------------------- |
| 001    | Banco do Brasil           |
| 007    | BNDES                     |
| 033    | Santander                 |
| 069    | Crefisa                   |
| 077    | Banco Inter               |
| 102    | XP Investimentos          |
| 104    | Caixa Econômica Federal   |
| 140    | Easynvest                 |
| 197    | Stone                     |
| 208    | BTG Pactual               |
| 212    | Banco Original            |
| 237    | Bradesco                  |
| 260    | Nu Pagamentos             |
| 341    | Itaú                      |
| 389    | Banco Mercantil do Brasil |
| 422    | Banco Safra               |
| 505    | Credit Suisse             |
| 633    | Banco Rendimento          |
| 652    | Itaú Unibanco             |
| 735    | Banco Neon                |
| 739    | Banco Cetelem             |
| 745    | Citibank                  |

Bancos que não estão nesta lista retornarão `'Unknown'` do método `bank()`.
