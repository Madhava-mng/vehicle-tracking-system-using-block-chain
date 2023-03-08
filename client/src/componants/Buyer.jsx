import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Alert, Card} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

function Buyer() {

  const [isConnected, setIsConnected] = useState('none');
  const [isWallet, setIsWallet] = useState(false);
  const [walletButtonText, setWalletButtonText] = useState("Connect Wallet");
  const [hover, setHovering] = useState(4);

  function conectWallet(){
    setIsConnected((isConnected == 'none')? '':'none');
    setWalletButtonText((walletButtonText == 'Connect Wallet')? 'Disconnect Wallet':'Connect Wallet');
    setIsWallet(!isWallet);
  }

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
                  <Link className='btn btn-outline-info ms-2' to="/">&lt; Back</Link>
                  <Link className='btn btn-outline-info ms-2' style={{pointerEvents: `${isConnected}` }} to="/seller">Seller</Link>
                 
                </Nav>
                <Form className="d-flex">
                  {/* <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button> */}
                </Form>
                <Button className='btn-success ms-2' onClick={()=>{conectWallet()}}>{walletButtonText}</Button>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}

      <Card className={`m-5 pd-${hover}`} onMouseLeave={()=>{setHovering( 1 )}} onMouseEnter={()=>{setHovering( 0 )}}>
        <Card.Header className='bg-dark' style={{color:"white"}}>
          <Card.Title >Buyer Home Page</Card.Title>
        </Card.Header>
        <Card.Body>
          we are offer the whole history of vehicle tracking system between the seller and buyer.
          <br/><br/><br/>
          We provide the security by data integrity and tranperency via block chain techonology. 
          <br /><br/><br/>

        </Card.Body>
        <Card.Footer className='bg-dark' style={{color:"white"}}>
          <Link className='btn btn-outline-info ms-2' to="/">&lt; Back</Link>
          <Link className='btn btn-outline-info ms-2' style={{pointerEvents: `${isConnected}` }} to="/seller">Seller</Link>
          <br/>
          {
            (!isWallet)? <h5 className='m-2 btn-outline-danger' style={{color:'tomato'}}>Please Connect your wallet</h5>:''
          }
        </Card.Footer>
      </Card>
      
    </div>
  )
}

export default Buyer
