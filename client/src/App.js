
import './App.css';
// import Web3 from 'web3';
import {useEffect, useState} from 'react'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import UsedAppp from './componants/UsedAppp';
import Wallet from './componants/Wallet';
import Home from './componants/Home';
import Buyer from './componants/Buyer';
import Seller from './componants/Seller';
import Company from './componants/Company';
import Employee from './componants/Employee';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import background from '../src/jpg/backgroung.jpg'

function App() {
  // const [account, setAccount] = useState([]);
  // const [network,setNetwork] = useState();
  // const [balance,setBalance] = useState();
  // const web3 = new Web3(Web3.givenProvider || 'http://172.17.0.1:8545');
  // useEffect(() => {
  //   async function loadAccount(){
  //     const accounts = await web3.eth.requestAccounts();
  //     const network_type = await web3.eth.net.getNetworkType();
  //     const bal = await web3.eth.getBalance(accounts[0]);
  //     setAccount(accounts[0]);
  //     setBalance(bal);
  //     setNetwork(network_type);
  //   }
  //   loadAccount();
  // }, [account,balance,network])
  return (
    <div  className='' style={{ backgroundImage: `url(${background})` , height:'200vh',backgroundSize: 'cover', backgroundRepeat: 'no-repeat',}}>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/wallet' element={<Wallet/>}/>
          <Route path='*' element={<Home/>} />
          <Route path='/buyer' element={<Buyer/>} />
          <Route path='/seller' element={<Seller/>} />
          <Route path='/company' element={<Company/>} />
          <Route path='/employee' element={<Employee/>} />
        </Routes>
      </BrowserRouter>
    </div>
    </div>
  );
}

export default App;
