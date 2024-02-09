
import './App.css';
import LoginPage from './LoginPage/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './Main/Main';
function App() {

  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage></LoginPage>} />
          <Route path='/main' element={<Main></Main>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
