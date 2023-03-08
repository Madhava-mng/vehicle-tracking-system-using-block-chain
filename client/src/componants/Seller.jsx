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
import back from '../png/back.png'
import avatar from '../png/avatar.png';
import company from '../png/company.png';

function Seller() {

  const [hover, setHovering] = useState(4);


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
                  <Link className='btn btn-outline-info ms-2' to="/"><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
                  <Link className='btn btn-outline-info ms-2' to="/company"><img src={company} style={{maxBlockSize:'19px'}}/> Company</Link>
                  <Link className='btn btn-outline-info ms-2' to="/employee"><img src={avatar} style={{maxBlockSize:'19px'}}/> Employee</Link>
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
          <Card.Title >Seller Home Page</Card.Title>
        </Card.Header>
        <Card.Body>
          we are offer the whole history of vehicle tracking system between the seller and buyer.
          <br/><br/><br/>
          We provide the security by data integrity and tranperency via block chain techonology. 
          <br /><br/><br/>

        </Card.Body>
        <Card.Footer className='bg-dark' style={{color:"white"}}>
          <Link className='btn btn-outline-info ms-2' to="/"><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
          <Link className='btn btn-outline-info ms-2'  to="/company"><img src={company} style={{maxBlockSize:'19px'}}/> Company</Link>
          <Link className='btn btn-outline-info ms-2'  to="/employee"><img src={avatar} style={{maxBlockSize:'19px'}}/> Employee</Link>       
          <br/>
          
        </Card.Footer>
      </Card>
      
    </div>
  )
}

export default Seller;
