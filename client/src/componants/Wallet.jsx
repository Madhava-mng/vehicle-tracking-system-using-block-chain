import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Web3 from 'web3';
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "a",
				"type": "uint256"
			}
		],
		"name": "retrieve",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
function Wallet() {
  const [inp, setInp] = useState("");
  const [inp2, setInp2] = useState("");
  const [wallet, setWallet] = useState();
  const [data,setData] = useState();
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const contract = new web3.eth.Contract(abi,"0xf9255f20a61D4Fb5832df3Ab0d0a298Af94Aa147");
  useEffect(() => {
    async function abc(){
      
      //let data  = await contract.methods.retrieve(0).call();
      //console.log(data);
      const acc = await web3.eth.requestAccounts();
      setWallet(acc[0]);
    }
    abc();
  }, [])
  async function addData(){
    let data_ = await contract.methods.store(inp).send({from: wallet})
    //setData(data_);
    console.log(data_)
  }
  async function getData(){
    let data_ = await contract.methods.retrieve(inp2).call()
    setData(data_);
  }
  return (
    <div>
      Wallet: {wallet}
      <br/>
      <input placeholder='Your Name' onChange={(e)=>{setInp(e.target.value)}}></input>
      <button onClick={()=>{addData()}}>Submit query</button>
      <br/>
      
      <input placeholder='Enter Id to Get Info' onChange={(e)=>{setInp2(e.target.value)}}></input>
      <button onClick={()=>{getData()}}>Submit query</button>
      <br/>
      {data}
    </div>
  )
}

export default Wallet
