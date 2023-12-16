import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom"
import './index.css';
import MainPage from "./components/MainPage";
import { AuthRoute } from './components/Routes/Routes';


const Layout = () => {
  return (
    <>
      <Outlet/>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <AuthRoute component={MainPage}/>
      }
    ]
  }
])


const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App