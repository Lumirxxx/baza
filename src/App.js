
import './App.css';
import LoginPage from './LoginPage/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
  return (
    <div className="App">

       <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage></LoginPage>} />
        

        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
