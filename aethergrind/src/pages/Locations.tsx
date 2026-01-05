import { markdownFiles } from '../content/contentMap'
import { Link } from 'react-router-dom'
import { filePathToRoute } from '../content/pathUtils'
import './IndexPage.css'

type FolderNode = {
  name: string
  files: string[]
  children: Record<string, FolderNode>
}

const TARGET_FOLDER = 'Locations'

// Step 1: build folder tree (ONLY Locations)
function buildFolderTree() {
  const root: FolderNode = { name: 'Root', files: [], children: {} }

  Object.keys(markdownFiles).forEach(path => {
    const relativePath = path.replace('/src/content/', '')
    const parts = relativePath.split('/')

    if (parts[0] !== TARGET_FOLDER) return

    parts.shift() // remove "Locations"
    const fileName = parts.pop()!

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
  const currentPath =
    node.name === 'Root'
      ? parentPath
      : parentPath
        ? `${parentPath}/${node.name}`
        : node.name

  return (
    <div className="folder-box" key={currentPath || 'root'}>
      {node.name !== 'Root' && (
        <h2 className="folder-title">{node.name}</h2>
      )}

      {Object.values(node.children).map(child =>
        renderFolder(child, currentPath)
      )}

      {node.files.length > 0 && (
        <ul className="file-list">
          {node.files.map(file => {
            const fullPath = currentPath
              ? `/src/content/${TARGET_FOLDER}/${currentPath}/${file}`
              : `/src/content/${TARGET_FOLDER}/${file}`

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

export default function LocationsIndexPage() {
  const tree = buildFolderTree()

  return (
    <div className="index-page">
      <div className='text-center'>Click Map to View</div>
      <a href='/aein2_biome.png' target='_blank' rel='noopener noreferrer'>
        <div className="map-container">
          <img
            src="/aein2_biome.png"
            alt="World biome map"
            className="location-map"
          />
        </div>
      </a>

      {/* Recursive folder index */}
      {renderFolder(tree)}
    </div>
  )
}
