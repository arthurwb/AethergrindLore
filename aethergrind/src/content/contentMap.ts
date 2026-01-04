export const markdownFiles = import.meta.glob(
  '/src/content/**/*.md',
  { as: 'raw' }
)