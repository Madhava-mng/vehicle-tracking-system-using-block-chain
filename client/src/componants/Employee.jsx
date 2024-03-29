import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Card, FormControl, ListGroup, ListGroupItem, Row, Col} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import Web3 from 'web3';
import {MDBTabs,MDBTabsItem,MDBTabsLink,MDBTabsContent,MDBTabsPane} from 'mdb-react-ui-kit';
import { ABI, ProgramID } from './abi';
import back from '../png/back.png';
import { Alert } from '@mui/material'
import  ProgressBar  from './ProgressBar';
import update from '../png/update.png'



function Company() {

  const [hover, setHovering] = useState(4);
  const [iconsActive, setIconsActive] = useState('tab1');
  const [account, setAccount] = useState("");
  const web3 = new Web3( Web3.givenProvider || 'http://172.17.0.1:8545');
  const contract = new web3.eth.Contract(ABI,ProgramID);
  const [tmp, setTmp] = useState(true);
  const [loading, setLoading] = useState(true);

  const [details, setDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  const [vName, setVName] = useState("");
  const [vUid, setVUid] = useState("");
  const [vType, setVType] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [altErr, setAltErr] = useState(<Alert show={true}  className='m-3' severity="info" onClose={() => {setAltErr(<></>)}}>Welcome {details[0]}</Alert>);

  const [balance, setBalance] = useState(0);

  const [isAddBtn, setIsAddBtn] = useState(true);

  function handleIconsClick(value) {
    if (value === iconsActive) {
      return;
    }
    setIconsActive(value);
  }

  async function getDetails(){
    setLoading(true);
    let _details = await contract.methods.getProductDetails().call({from:account});
    const _emp = await contract.methods.getEmployeeDetail().call({from:account});
    console.log(_details);
    console.log(_emp);
    setDetails(_emp);
    setProductDetails(_details);
    setTimeout(() => {setLoading(false)}, 3300);
  }

  
  
  async function newProduct(){
    let _newProduct = await contract.methods.newProduct(
      vName,
      vUid,
      vType,
      vPrice
    ).send({from: account});
    setAltErr(<Alert show={true}  className='m-3' severity="success" onClose={() => {setAltErr(<></>)}}>New Product added</Alert>)
    console.log(_newProduct);
    getDetails();
  }
  
  useEffect(() => {
    setIsAddBtn((vName.length > 1 && vPrice > 0 && vType.length > 1 && vUid.length > 2 && details[3] && details[4])? false: true);
  }, [vName,vPrice, vType, vUid])
  
  async function taggleMintable(_addr){
    try{
      let data = await contract.methods.taggleMintable(_addr).send({from: account});
      setAltErr(<Alert show={true}  className='m-3' severity="success" onClose={() => {setAltErr(<></>)}}>Updated</Alert>)
      console.log(data);
    }catch(e){
      setAltErr(<Alert show={true}  className='m-3' severity="error" onClose={() => {setAltErr(<></>)}}>{e.message}</Alert>)
    }
    getDetails();
  }

  async function transferOwner(_addr){
    try{
      let data = await contract.methods.transferOwner(_addr).send({from: account});
      setAltErr(<Alert show={true}  className='m-3' severity="warning" onClose={() => {setAltErr(<></>)}}>Transfered</Alert>)
      console.log(data);
    }catch(e){
      setAltErr(<Alert show={true}  className='m-3' severity="error" onClose={() => {setAltErr(<></>)}}>{e.message}</Alert>)
    }
    getDetails();
  }
  async function clearRequest(_addr){
    try{
      let data = await contract.methods.clearRequest(_addr).send({from: account});
      setAltErr(<Alert show={true}  className='m-3' severity="success" onClose={() => {setAltErr(<></>)}}>Cleared</Alert>)
      console.log(data);
    }catch(e){
      setAltErr(<Alert show={true}  className='m-3' severity="error" onClose={() => {setAltErr(<></>)}}>{e.message}</Alert>)
    }
    getDetails();
  }

  
  useEffect(() => {
    connectWallet();
  }, [])
  useEffect(() => {
    getDetails();
  }, [account])
  async function connectWallet(){
    const accounts = await web3.eth.requestAccounts();
    const network_type = await web3.eth.net.getNetworkType();
    const bal = await web3.eth.getBalance(accounts[0]);
    setBalance((bal/1000000000000000000).toFixed(4));
    setAccount(accounts[0]);
    
  }
  useEffect(() => {
    let I =  setTimeout(async () => {
      connectWallet();
        setTmp(!tmp);
      },5000);
    return() => {
      clearInterval(I)
    }
  }, [tmp])
  return (
    <div>
      {(loading)? <ProgressBar color='secondary'/>:<></>}
      {[  'sm'].map((expand) => (
        <Navbar key={expand} bg="dark"  expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Brand href="/" style={{"color":"white"}}>Vehicle Tracking</Navbar.Brand>
            <img src={update} style={{maxBlockSize:'20px'}} onClick={()=> {connectWallet();getDetails() }}></img>
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
                  <Link className='btn btn-outline-info ms-2' to="/seller"><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
                  {/* <Link className='btn btn-outline-info ms-2' to="/company">Company</Link> */}
                 
                </Nav>
                <Form className="d-flex">
                  <Button className='btn-dark btn-outline'><img src={'https://i.redd.it/bfo1798dlo7z.png'} style={{maxBlockSize:'19px'}}/> {balance}</Button>
                </Form>
                {/* <Button className='btn-success ms-2' onClick={()=>{conectWallet()}}>{walletButtonText}</Button> */}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}

      <Card className={`m-5 pd-${hover}`} onMouseLeave={()=>{setHovering( 1 )}} onMouseEnter={()=>{setHovering( 0 )}}>
        <Card.Header className='bg-dark' style={{color:"white"}}>
          <Card.Title >{(details[3])? <span className="badge bg-success">Verified Employee ✓</span>:<span className="badge bg-danger">✗ You are not belongs to any Company</span>}</Card.Title>
        </Card.Header>
        <Card.Body className='p-1 m-5 ms-5'>
          <div className=''>
            <MDBTabs className='mb-4' >
              <MDBTabsItem >
                <MDBTabsLink onClick={() => handleIconsClick('tab1')} active={iconsActive === 'tab1'} >
                   Dashboard
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink onClick={() => handleIconsClick('tab2')} active={iconsActive === 'tab2'}>
                   Add Products
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent >
          {altErr}
              <MDBTabsPane show={iconsActive === 'tab1'} style={{textAlign:'left'}} className='m-0 p-2 rounded' >
                <Card className='mb-2' >
                  <Card.Header style={{background:"#CE93D8"}}>
                    <h5>Owner: {account} {(details[4])? <span className="badge bg-success">Active</span>:<span className="badge bg-danger">Not Active</span>}</h5>
                  </Card.Header>
                  <Card.Body style={{background:"#F3E5F5"}}>
                    {(details[0])?
                    <ListGroup variant="flush">
                      <ListGroup.Item style={{background:"#F3E5F5"}}>Name: {details[0]}</ListGroup.Item>
                      <ListGroup.Item style={{background:"#F3E5F5"}}>Company: {details[2]}</ListGroup.Item>
                      <ListGroup.Item style={{background:"#F3E5F5"}}>No Of Products: {(details[5] == 0)? <span className="badge bg-warning">Nil</span>:details[5]}</ListGroup.Item>
                    </ListGroup>:<></>
                    }
                  </Card.Body>
                </Card>


                <Row xs={1} md={3} className="g-2">
                {productDetails.map((pro) => {
                  return (
                    <Col>
                      <Card className='mb-3'>
                        <Card.Header style={{background:"#CE93D8"}}>
                          # {pro.id} {(pro.owner == pro.creator)? (pro.mintable)? <span className="badge bg-success">Minted</span>:<span className="badge bg-danger">Not Minted</span>:<span className="badge bg-success">Sold</span>}
                        </Card.Header>
                        <Card.Body style={{background:"#F3E5F5"}}>
                        <ListGroup variant="flush"  >
                          <ListGroupItem style={{background:"#F3E5F5"}}>Name: {pro.name}</ListGroupItem>
                          <ListGroupItem style={{background:"#F3E5F5"}}>UniqId: {pro.uniqNumber}</ListGroupItem>
                          <ListGroupItem style={{background:"#F3E5F5"}}>Owned: {pro.owner} </ListGroupItem>
                          <ListGroupItem style={{background:"#F3E5F5"}}>Type: {pro.type_}</ListGroupItem>
                          <ListGroupItem style={{background:"#F3E5F5"}}>Number of time Sold: {(pro.noOFTimeSold  == 0)? <span className="badge bg-success">New</span>:pro.noOFTimeSold}</ListGroupItem>
                          <ListGroupItem style={{background:"#F3E5F5"}}>Price: <span className='badge bg-info'>₹ {pro.price}</span></ListGroupItem>
                          <ListGroupItem style={{background:"#F3E5F5"}}>Origin: {pro.creator}</ListGroupItem>
                          <ListGroupItem style={{background:"#F3E5F5"}}>Requested: {pro.requested}</ListGroupItem>
                          <ListGroupItem style={{background:"#F3E5F5"}}>Product Created Time: {new Date(pro.date * 1000).toString()}</ListGroupItem>
                        </ListGroup>
                        </Card.Body>
                        <Card.Footer style={{background:"#CE93D8"}}>
                        
                          {(pro.owner == pro.creator)? <Button onClick={() => {taggleMintable(pro.id)}} className={`btn-${(pro.mintable)? "danger":"success"}`} disabled={!details[4]}>{(pro.mintable)? "Not Mint":"Mint"}</Button>:<Button disabled>Sold out</Button>}
                          {(pro.requested != '0x0000000000000000000000000000000000000000' && pro.owner == pro.creator)? 
                            <>
                              <Button className="ms-1 btn-danger"  onClick={() => {transferOwner(pro.id)}} disabled={!details[4]}>Transfer</Button>
                              <Button className="ms-1 btn-warning" onClick={() => {clearRequest(pro.id)}} disabled={!details[4]}>Clear</Button>
                            </>
                            :<></>
                          }
                        </Card.Footer>
                      </Card>
                    </Col>
                    )
                  })}
                  </Row>
              </MDBTabsPane>


              <MDBTabsPane show={iconsActive === 'tab2'} style={{textAlign:'left',background:''}} className='m-0 p-2 rounded'>
                <Card>
                  <Card.Header style={{background:"#CE93D8"}}>
                    Add Product
                  </Card.Header>
                  <Card.Body style={{background:"#F3E5F5"}}>
                    <FormControl onChange={(e)=> {setVName(e.target.value)}} className='m-2 p-2' placeholder='Vehicle Name' required></FormControl>
                    <FormControl onChange={(e)=> {setVUid(e.target.value)}} className='m-2 p-2' placeholder='Uniq Id' required></FormControl>
                    <FormControl onChange={(e)=> {setVType(e.target.value)}} className='m-2 p-2' placeholder='Type' required></FormControl>
                    <FormControl onChange={(e)=> {setVPrice(e.target.value)}} className='m-2 p-2' placeholder='$ price' type="number" required></FormControl>
                  </Card.Body>
                  <Card.Footer style={{background:"#CE93D8"}}>
                    <Button className='ms-2' onClick={()=> {newProduct()}} disabled={isAddBtn}>Add Vehicle</Button>
                  </Card.Footer>
                </Card>
              </MDBTabsPane>              
            </MDBTabsContent>
          </div>
        </Card.Body>
        <Card.Footer className='bg-dark' style={{color:"white"}}>
          <Link className='btn btn-outline-info ms-2' to="/seller"><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
          <br/>
         
        </Card.Footer>
      </Card>
      
    </div>
  )
}

export default Company;
