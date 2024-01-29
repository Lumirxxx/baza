
import './App.css';
import LoginPage from './LoginPage/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReleasePage from './ReleasePage/ReleasePage';
import Main from './Main/Main';
import AdminPage from './AdminPage/AdminPage';
// import { StrictMode } from "react";


function App() {
  
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage></LoginPage>} />
          <Route path='/main' element={<Main></Main>} />
   
          {/* <Route path='/release' element={<ReleasePage></ReleasePage>} /> */}
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
