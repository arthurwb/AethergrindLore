import { markdownFiles } from '../content/contentMap'
import { Link } from 'react-router-dom'
import { filePathToRoute } from '../content/pathUtils'
import './IndexPage.css' // optional for styling

type FolderNode = {
  name: string
  files: string[]
  children: Record<string, FolderNode>
}

// Step 1: build folder tree
function buildFolderTree() {
  const root: FolderNode = { name: 'Root', files: [], children: {} }

  Object.keys(markdownFiles).forEach(path => {
    const relativePath = path.replace('/src/content/', '')
    const parts = relativePath.split('/')
    const fileName = parts.pop()! // remove file

    let currentNode = root

    parts.forEach(part => {
      if (!currentNode.children[part]) {
        currentNode.children[part] = { name: part, files: [], children: {} }
      }
      currentNode = currentNode.children[part]
    })

    currentNode.files.push(fileName)
  })

  return root
}

// Step 2: recursively render the tree
function renderFolder(node: FolderNode, parentPath = '') {
  // Only include the node name if it's not the Root
  const currentPath = node.name === 'Root'
    ? parentPath
    : parentPath
      ? `${parentPath}/${node.name}`
      : node.name

  return (
    <div className="folder-box" key={currentPath || 'root'}>
      {node.name !== 'Root' && <h2 className="folder-title">{node.name}</h2>}

      {Object.values(node.children).map(child => renderFolder(child, currentPath))}

      {node.files.length > 0 && (
        <ul className="file-list">
          {node.files.map(file => {
            // Build full path relative to /src/content
            const fullPath = currentPath
              ? `/src/content/${currentPath}/${file}`
              : `/src/content/${file}`

            const route = filePathToRoute(fullPath)
            const name = file.replace('.md', '')

            return (
              <li key={fullPath}>
                <Link to={route}>{name}</Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}


export default function IndexPage() {
  const tree = buildFolderTree()
  return <div className="index-page">{renderFolder(tree)}</div>
}
