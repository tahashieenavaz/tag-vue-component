# Tag Input

A file-based Vue 3 tag input component, built with Vite.

## Local development

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. The GitHub Pages workflow builds
and deploys the `dist` directory whenever a tag matching `v*` is pushed.

## Component

The reusable component lives at `src/components/TagInput.vue` and supports
`v-model` for its tags:

```vue
<TagInput v-model="tags" />
```
