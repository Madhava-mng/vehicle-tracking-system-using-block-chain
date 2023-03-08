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

function Home() {

  const [isConnected, setIsConnected] = useState('none');
  const [walletButtonText, setWalletButtonText] = useState("Open");
  const [isWallet, setIsWallet] = useState(false);
  const [hover, setHovering] = useState(4);
  const web3 = new Web3(Web3.givenProvider || 'http://172.17.0.1:8545');

  async function conectWallet(){
    // alert("ok");
    const accounts = await web3.eth.requestAccounts();
    setIsConnected((isConnected == 'none')? '':'none');
    setWalletButtonText((walletButtonText != 'Close')? 'Close':'Open');
    setIsWallet(!isWallet);
  }
  
  // useEffect(() => {conectWallet()}, [])

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
        <Card.Body>
        
          we are offer the whole history of vehicle tracking system between the seller and buyer.
          <br/><br/><br/>
          We provide the security by data integrity and tranperency via block chain techonology. 
          <br /><br/><br/>

        </Card.Body>
        <Card.Footer className='bg-dark' style={{color:"white"}}>
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
