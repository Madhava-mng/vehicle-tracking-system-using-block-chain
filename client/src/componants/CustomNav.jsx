import React from 'react'
import update from '../png/update.png'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import  ProgressBar  from './ProgressBar';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import back from '../png/back.png';

function CustomNav({backTo, loadingColor, loading , balance, funcs}) {
  return (
    <div>
      {(loading)? <ProgressBar color={loadingColor}/>:<></>}
      {[  'sm'].map((expand) => (
        <Navbar key={expand} bg="dark"  expand={expand} className="mb-3 bg-opacity-10">
          <Container fluid>
            <Navbar.Brand href="/" style={{"color":"white"}}>Vehicle Tracking</Navbar.Brand>
            <img src={update} style={{maxBlockSize:'20px'}} onClick={()=> {funcs()}}></img>
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
                  <Link className='btn btn-outline-info ms-2' to={backTo}><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
                </Nav>
                <Form className="d-flex">
                  <Button className='btn-dark btn-outline'><img src={'https://i.redd.it/bfo1798dlo7z.png'} style={{maxBlockSize:'19px'}}/> {balance}</Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </div>
  )
}

export default CustomNav
