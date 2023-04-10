import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Card} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Web3 from 'web3';
import { useEffect } from 'react';
import lock from '../png/lock.png'
import unlock from '../png/unlocked.png'
import {ABI, ProgramID} from './abi';

function Home() {
  
  const [isConnected, setIsConnected] = useState('none');
  const [walletButtonText, setWalletButtonText] = useState("Open");
  const [isWallet, setIsWallet] = useState(false);
  const [hover, setHovering] = useState(4);
  const web3 = new Web3(Web3.givenProvider || 'http://172.17.0.1:8545');
  const contract = new web3.eth.Contract(ABI,ProgramID);
  const [data, setData] = useState(" ");
  const [fwd, setFwd] = useState(true);
  const [iter, setIter] = useState(0);

  async function conectWallet(){
    // alert("ok");
    const accounts = await web3.eth.requestAccounts();
    setIsConnected((isConnected == 'none')? '':'none');
    setWalletButtonText((walletButtonText != 'Close')? 'Close':'Open');
    setIsWallet(!isWallet);
  }

  // async function getAllProducts(){
  //   // const allProductDetails = await contract.methods.map_products().call();
  //   // console.log(allProductDetails)
  //   const data = await (await web3.eth.getBlock(478)).timestamp
  //   console.log(data)
  // }
  
  useEffect(() => {
    setTimeout(() => {
    let actual_datas = [
      "Welcome to our vehicle documentation management platform, powered by blockchain technology.",
      "We provide a secure, efficient and transparent way for vehicle owners, dealerships, service centers, insurers and government agencies to manage and share vehicle-related documentation.",
      "Our platform enables you to store, track and access critical information about your vehicles, all in one place.",
      "This includes ownership documents, registration, maintenance and repair history, insurance policies, and more.",
      "With blockchain technology, you can trust that your data is tamper-proof and protected from unauthorized access.",
      "Our platform is designed to be easy to use, with a simple and intuitive interface that makes managing your documentation a breeze.",
      "You can access your data from anywhere, at any time, using any device.",
      "In addition, our platform allows you to share your documentation securely with others, such as service centers and insurance companies.", 
      "This ensures that they have access to the most up-to-date information about your vehicle, which can help streamline processes and reduce the risk of errors."];
    let tmp = "";
    let actual_data = actual_datas[iter];
    
    
    let cos = () => {
      
      for(let i=0;i<actual_data.length;i++){
        setTimeout(() => {
          if(fwd){
            tmp += actual_data[i];
            if(tmp.length == actual_data.length){
              setFwd(!fwd);
            }
          }else{
            tmp = actual_data.slice(0,tmp.length-1);
            if(tmp.length == 0){
              setFwd(!fwd);
              setIter(iter + 1);
              if(iter >= actual_datas.length-1){
                setIter(0);
              }
            }
          }
          setData(tmp);
        }, (((fwd)? 15:8) * i) )
      }
    }
    cos()
  }, (fwd)? 500:3000)
  }, [fwd])

  return (
    <div>
      {[  'sm'].map((expand) => (
        <Navbar key={expand} bg="dark"  expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Brand href="/" style={{"color":"white"}}>Vehicle Tracking</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} style={{"color":"white"}}>
                  Bike Tracking
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link className='btn btn-outline-info ms-2' style={{pointerEvents: `${isConnected}` }} to="/buyer">Buyer</Link>
                  <Link className='btn btn-outline-info ms-2' style={{pointerEvents: `${isConnected}` }} to="/seller">Seller</Link>
                <Button className={`btn-${(walletButtonText != 'Close')? 'success': 'danger'} ms-2`} style={{minWidth:'120px'}} onClick={()=>{conectWallet()}}>
                  {walletButtonText} <img src={(walletButtonText != 'Close')? lock:unlock} style={{maxBlockSize:'27px'}}/>
                </Button>
                </Nav>
                <Form className="d-flex">
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}

      <Card className={`m-5 pd-${hover}`} onMouseLeave={()=>{setHovering( 1 )}} onMouseEnter={()=>{setHovering( 0 )}}>
        <Card.Header className='bg-dark' style={{color:"white"}}>
          <Card.Title >Home Page</Card.Title>
        </Card.Header>
        <Card.Body style={{textAlign:"left",height:"300px"}} className="p-5">
          
          <h3 style={{marginLeft:"20%", marginRight:"20"}}>{'$'} {data}<span>|</span></h3>

        </Card.Body>
        <Card.Footer className='bg-dark' style={{color:"white"}}>
        Join us on our journey to revolutionize the way we manage vehicle documentation.Open the lock and start experiencing the benefits of blockchain-powered documentation management.
          Are you
          <Link className='btn btn-outline-info ms-2' style={{pointerEvents: `${isConnected}` }} to="/buyer">Buyer</Link> Or
          <Link className='btn btn-outline-info ms-2' style={{pointerEvents: `${isConnected}` }} to="/seller">Seller</Link> ?
          <br/>
          {
            (!isWallet)? <h5 className='m-2 btn-outline-danger' style={{color:'tomato'}}>Please Open the lock</h5>:''
          }
        </Card.Footer>
      </Card>
      
    </div>
  )
}

export default Home
