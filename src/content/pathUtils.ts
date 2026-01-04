export function filePathToRoute(path: string) {
  return path
    .replace('/src/content', '')
    .replace(/\.md$/, '')
    .replace(/ /g, '-')
    .toLowerCase()
}