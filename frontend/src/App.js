import logo from './logo.svg';
import './App.css';
import IndexPage from './IndexPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DealsComponent from './DealsComponent';
import CreateDeal from './CreateDeal';
import Profile from './Profile';
import Bid from './Bid';
import InputForm from './InputForm';
function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />}> </Route>
        <Route path='/deals'  element={<DealsComponent/>}></Route>
        <Route path="/create-deal" element={<InputForm/>}/>
        <Route path='/Bid/:id'  element={<Bid />}></Route>
        <Route path='/Profile'  element={<Profile/>}></Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}
export default App;
