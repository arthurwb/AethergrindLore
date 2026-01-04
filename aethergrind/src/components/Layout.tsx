import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="container">
      <div className="layout">
        <h1>Aethergrind</h1>

        <Link className="nav-button" to="/">Home</Link>
        <Link className="nav-button" to="/aein">Aein</Link>
        <Link className="nav-button" to="/companies">Companies</Link>
        <Link className="nav-button" to="/technology">Technology</Link>
        <Link className="nav-button" to="/misc">Misc</Link>
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
