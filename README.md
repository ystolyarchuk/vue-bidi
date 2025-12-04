# vue-bidi

[![npm version](https://img.shields.io/npm/v/vue-bidi.svg)](https://www.npmjs.com/package/vue-bidi)
[![npm downloads](https://img.shields.io/npm/dm/vue-bidi.svg)](https://www.npmjs.com/package/vue-bidi)

**📦 [Install from npm](https://www.npmjs.com/package/vue-bidi)**

vue-bidi is a Vue 3 library for managing text direction (LTR / RTL) automatically based on selected language or manual control.

It supports:
- Automatic direction switching via directive
- Full programmatic control using `useBidi` composable
- SCSS mixins for RTL/LTR styles
- Vue 3 plugin support

---

## Installation

```bash
npm install vue-bidi
```

---

## Usage

### 1. Install as Vue plugin

Register the plugin globally in your Vue app:

```ts
import { createApp } from 'vue';
import VueBidi from 'vue-bidi';
import App from './App.vue';

const app = createApp(App);
app.use(VueBidi);
app.mount('#app');
```

This registers the `v-bidi` directive globally.

---

### 2. Use the directive

Auto-detect direction:

```vue
<template>
  <div v-bidi>Text</div>
</template>
```

Force direction:

```vue
<template>
  <div v-bidi="'rtl'">RTL block</div>
  <div v-bidi="'ltr'">LTR block</div>
  <div v-bidi="dynamicDir">Dynamic direction</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dynamicDir = ref<'ltr' | 'rtl'>('rtl');
</script>
```

---

### 3. Use the composable

If you only need direction logic without binding to HTML:

```vue
<script setup lang="ts">
import { useBidi } from 'vue-bidi';

const { dir, setLang, setDir, oppositeDir } = useBidi();

// Set language - automatically detects direction
setLang('ar');   // rtl
setLang('en');   // ltr

// Override direction explicitly
setDir('ltr');

// Access current direction (reactive)
console.log(dir.value); // 'ltr' or 'rtl'

// Get opposite direction (computed)
console.log(oppositeDir.value); // 'rtl' or 'ltr'
</script>
```

Watch direction changes:

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useBidi } from 'vue-bidi';

const { dir } = useBidi();

watch(dir, (newDir) => {
  console.log('Direction changed to:', newDir);
});
</script>
```

---

## Styles (SCSS utilities)

Import SCSS helpers:

```scss
@use 'vue-bidi/scss' as dir;
```

---

## Available Mixins

All mixins support scoped styles via optional `$use-host-context` parameter (defaults to `true` for scoped styles in Vue components).

### Direction Wrappers

- `dir-ltr($use-host-context: true)` - Apply styles only for LTR direction
- `dir-rtl($use-host-context: true)` - Apply styles only for RTL direction
- `dir($value, $use-host-context: true)` - Apply styles for specific direction (ltr/rtl)

### Padding & Margin

- `padding-start($value, $use-host-context: true)` - Padding on start side (right in LTR, left in RTL)
- `padding-end($value, $use-host-context: true)` - Padding on end side (left in LTR, right in RTL)
- `margin-start($value, $use-host-context: true)` - Margin on start side (right in LTR, left in RTL)
- `margin-end($value, $use-host-context: true)` - Margin on end side (left in LTR, right in RTL)

### Float & Clear

- `float($pos, $use-host-context: true)` - Float element to start or end (`start` or `end`)

### Position

- `left($value, $use-host-context: true)` - Left position (right in RTL)
- `right($value, $use-host-context: true)` - Right position (left in RTL)

### Text Alignment

- `text-align-start($use-host-context: true)` - Align text to start (left in LTR, right in RTL)
- `text-align-end($use-host-context: true)` - Align text to end (right in LTR, left in RTL)

### Transforms

- `transformTranslate($x, $y: 0, $use-host-context: true)` - Translate with X-axis inversion for RTL
- `transformScale($x, $y: 1, $use-host-context: true)` - Scale with X-axis mirroring for RTL
- `mirror($use-host-context: true)` - Full horizontal mirroring for RTL

### Generic Property Helpers

- `start($property, $value, $use-host-context: true)` - Apply any property to start side
- `end($property, $value, $use-host-context: true)` - Apply any property to end side

### Using in Vue components (with scoped styles)

By default, mixins work with scoped styles in Vue components (uses `:deep()`):

```vue
<style lang="scss" scoped>
@use 'vue-bidi/scss' as dir;

.button {
  @include dir.padding-start(20px); // Uses :deep() for scoped styles by default
}
</style>
```

For global styles, pass `false`:

```scss
@use 'vue-bidi/scss' as dir;

.button {
  @include dir.padding-start(20px, false); // Uses [dir] selector for global styles
}
```

---

## RTL Languages

RTL is automatically enabled for:

```ts
['ar', 'he', 'fa', 'dv', 'ku', 'ur', 'ps']
```

---

## TypeScript Support

Full TypeScript support is included:

```ts
import { useBidi, type TextDir } from 'vue-bidi';

const { dir, setDir } = useBidi();
const direction: TextDir = dir.value; // 'ltr' | 'rtl'
```

---

## Examples

### Complete Example

```vue
<template>
  <div v-bidi>
    <button @click="toggleDirection">
      Current: {{ dir }} (Opposite: {{ oppositeDir }})
    </button>
    <div class="content">
      <p>This content adapts to the current direction.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useBidi } from 'vue-bidi';

const { dir, setDir, oppositeDir } = useBidi();

const toggleDirection = () => {
  setDir(dir.value === 'ltr' ? 'rtl' : 'ltr');
};

watch(dir, (newDir) => {
  console.log('Direction changed:', newDir);
});
</script>

<style lang="scss" scoped>
@use 'vue-bidi/scss' as dir;

.content {
  @include dir.padding-start(20px, true);
  @include dir.text-align-start(true);
}
</style>
```

---

## License

MIT
