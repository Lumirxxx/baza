
import './App.css';
import LoginPage from './LoginPage/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './Main/Main';
import MainNews from './MainNews/MainNews';
import KnowledgeBase from './KnowledgeBase/KnowledgeBase';
import MainProjects from './MainProjects/MainProjects';
import FullNews from './FullNews/FullNews';
function App() {

  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage></LoginPage>} />
          <Route path='/main' element={<Main></Main>} />
          <Route path='/MainNews' element={<MainNews></MainNews>} />
          <Route path='/KnowledgeBase' element={<KnowledgeBase></KnowledgeBase>} />
          <Route path='/MainProjects' element={<MainProjects></MainProjects>} />
          <Route path="/news/:id" element={<FullNews />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
