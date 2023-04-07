import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/LoginPage';
import { ToastContainer } from 'react-toastify';

import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import Profile from './components/ProfilePage';
import SelectWarehouse from './components/SelectWarehousePage';
import Productivity from './components/ProductivityPage';
import ExpectedDemand from './components/ExpectedDemand';
import Requirement from './components/InputRequirement';
import ChangePassword from './components/ChangePassword';
import Result from './components/ResultPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <ToastContainer autoClose={3000} theme='colored' position='top-center'></ToastContainer>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<HomePage/>}></Route>
        <Route path='/signup' element={<SignupPage/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/change-password' element={<ChangePassword/>}></Route>
        <Route path='/manpower-planner/select-warehouse' element={<SelectWarehouse/>}></Route>
        <Route path='/manpower-planner/productivity' element={<Productivity/>}></Route>
        <Route path='/manpower-planner/expected-demands' element={<ExpectedDemand/>}></Route>
        <Route path='/manpower-planner/requiremnts' element={<Requirement/>}></Route>
        <Route path='/manpower-planner/result' element={<Result/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
