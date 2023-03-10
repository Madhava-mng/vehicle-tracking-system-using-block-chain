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
import back from '../png/back.png'



function Company() {

  const [hover, setHovering] = useState(4);
  const [iconsActive, setIconsActive] = useState('tab1');
  const [account, setAccount] = useState("");
  const web3 = new Web3(Web3.givenProvider || 'http://172.17.0.1:8545');
  const contract = new web3.eth.Contract(ABI,ProgramID);
  const [tmp, setTmp] = useState(true);

  const [details, setDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  const [cName, setCName] = useState("Name");
  const [cMail, setCMail] = useState("");

  const [balance, setBalance] = useState(0);

  const [isAddBtn, setIsAddBtn] = useState(true);

  const [mintedProduct, setMintedProduct] = useState([]);

  function handleIconsClick(value) {
    if (value === iconsActive) {
      return;
    }
    setIconsActive(value);
  }

  async function connectWallet(){
    const accounts = await web3.eth.requestAccounts();
    const network_type = await web3.eth.net.getNetworkType();
    const bal = await web3.eth.getBalance(accounts[0]);
    setBalance((bal/1000000000000000000).toFixed(4));
    setAccount(accounts[0]);
    getDetails();
  }
  // useEffect(() => {
  //   setTimeout(async () => {
  //     connectWallet();
  //     setTmp(!tmp);
  //   },4000);
  // }, [tmp])
  async function getDetails(){
    let _details = await contract.methods.getAllMyproducts().call({from:account});
    const cus = await contract.methods.getCustomerDetail().call({from:account});
    const minted = await contract.methods.getAllMintedProducts().call({from:account});
    console.log(_details);
    console.log(cus);
    setDetails(cus);
    setProductDetails(_details);
    setMintedProduct(minted);
    //console.log(minted);
  }

  async function newCustomer(){
    let _newProduct = await contract.methods.createCustomer(
      cName
    ).send({from: account});
    console.log()
    getDetails();
  }

  useEffect(() => {
    connectWallet();
  }, [account])

  useEffect(() => {
    setIsAddBtn((cName.length > 1)? false: true);
  }, [cName, cMail])

  async function taggleMintable(_addr){
    let data = await contract.methods.taggleMintable(_addr).send({from: account});
    getDetails();
    console.log(data);
  }

  async function transferOwner(_addr){
    let data = await contract.methods.transferOwner(_addr).send({from: account});
    getDetails();
    console.log(data);
  }
  async function clearRequest(_addr){
    let data = await contract.methods.clearRequest(_addr).send({from: account});
    getDetails();
    console.log(data);
  }

  async function requestForTransfer(_addr){
    let data = await contract.methods.requestForTransfer(_addr).send({from: account});
    getDetails();
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
                  <Link className='btn btn-outline-info ms-2' to="/"><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
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
          <Card.Title >Hello, {details[0]} {(details[1])? <span className="badge bg-success">✓</span>:<span className="badge bg-danger">✗</span>}</Card.Title>
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
                   Explore
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink onClick={() => handleIconsClick('tab3')} active={iconsActive === 'tab3'}>
                   Settings
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent >
              <MDBTabsPane show={iconsActive === 'tab1'} style={{textAlign:'left'}} className='m-0 p-2 rounded' >
                <Card className='mb-2' >
                  <Card.Header style={{background:"#48d1cc"}}>
                    <h5>Owner: {account} {(details[1])? <span className="badge bg-success">Active</span>:<span className="badge bg-danger">Not Active</span>}</h5>
                  </Card.Header>
                  <Card.Body style={{background:"#c9ffe5"}}>
                    <ListGroup variant="flush">
                      <ListGroup.Item style={{background:"#c9ffe5"}}>Name: {details[0]}</ListGroup.Item>
                      <ListGroup.Item style={{background:"#c9ffe5"}}>No Of Products: {(details[2] == 0)? <span className="badge bg-warning">Nil</span>:details[2]}</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>


                <Row xs={1} md={3} className="g-2">
                {productDetails.map((pro) => {
                  return (
                    <Col>
                      <Card className='mb-3'>
                        <Card.Header style={{background:"#48d1cc"}}>
                          # {pro.id} {(pro.owner == account)? (pro.mintable)? <span className="badge bg-success">Minted</span>:<span className="badge bg-danger">Not Minted</span>:<span className="badge bg-success">Sold</span>}
                        </Card.Header>
                        <Card.Body style={{background:"#c9ffe5"}}>
                        <ListGroup variant="flush"  >
                          <ListGroupItem style={{background:"#c9ffe5"}}>Name: {pro.name}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>UniqId: {pro.uniqNumber}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Owned: {pro.owner} </ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Type: {pro.type_}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Number of time Sold: {(pro.noOFTimeSold  == 0)? <span className="badge bg-success">New</span>:pro.noOFTimeSold}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Price: <span className='badge bg-info'>₹ {pro.price}</span></ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Origin: {pro.creator}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Requested: {pro.requested}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Product Created Time: {new Date(pro.date * 1000).toString()}</ListGroupItem>
                        </ListGroup>
                        </Card.Body>
                        <Card.Footer style={{background:"#48d1cc"}}>
                        
                          {(pro.owner == account)? <Button onClick={() => {taggleMintable(pro.id)}} className={`btn-${(pro.mintable)? "danger":"success"}`} >{(pro.mintable)? "Not Mint":"Mint"}</Button>:<Button disabled>Sold out</Button>}
                          {(pro.requested != '0x0000000000000000000000000000000000000000' && pro.owner == account)? 
                            <>
                              <Button className="ms-1 btn-danger"  onClick={() => {transferOwner(pro.id)}} disabled={!details[1]}>Transfer</Button>
                              <Button className="ms-1 btn-warning" onClick={() => {clearRequest(pro.id)}} disabled={!details[1]}>Clear</Button>
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
                <Card className='mb-2'>
                  <Card.Header style={{background:"#48d1cc"}}>
                    Explore Products
                  </Card.Header>
                  <Card.Body style={{background:"#c9ffe5"}}>
                  </Card.Body>
                  <Card.Footer style={{background:"#48d1cc"}}>
                    <Button className='ms-2' onClick={()=> {}} disabled={isAddBtn}>Search</Button>
                  </Card.Footer>
                </Card>
                <Row xs={1} md={3} className="g-2">
                {mintedProduct.map((pro) => {
                  return (
                    <Col>
                      <Card className='mb-3'>
                        <Card.Header style={{background:"#48d1cc"}}>
                          # {pro.id} {(pro.owner == pro.creator)? (pro.mintable)? <span className="badge bg-success">Minted</span>:<span className="badge bg-danger">Not Minted</span>:<span className="badge bg-success">Sold</span>}
                        </Card.Header>
                        <Card.Body style={{background:"#c9ffe5"}}>
                        <ListGroup variant="flush"  >
                          <ListGroupItem style={{background:"#c9ffe5"}}>Name: {pro.name}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>UniqId: {pro.uniqNumber}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Owned: {pro.owner} </ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Type: {pro.type_}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Number of time Sold: {(pro.noOFTimeSold  == 0)? <span className="badge bg-success">New</span>:pro.noOFTimeSold}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Price: <span className='badge bg-info'>₹ {pro.price}</span></ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Origin: {pro.creator}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Requested: {pro.requested}</ListGroupItem>
                          <ListGroupItem style={{background:"#c9ffe5"}}>Product Created Time: {new Date(pro.date * 1000).toString()}</ListGroupItem>
                        </ListGroup>
                        </Card.Body>
                        <Card.Footer style={{background:"#48d1cc"}}>
                        
                          <Button onClick={() => {requestForTransfer(pro.id)}} disabled={(pro.requested != '0x0000000000000000000000000000000000000000')}>Request this Product</Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                    )
                  })}
                  </Row>
              </MDBTabsPane>
              <MDBTabsPane show={iconsActive === 'tab3'} style={{textAlign:'left',background:''}} className='m-0 p-2 rounded'>
              <Card>
                  <Card.Header style={{background:"#48d1cc"}}>
                    Settings
                  </Card.Header>
                  <Card.Body style={{background:"#c9ffe5"}}>
                    <FormControl className='m-2' onChange={(e) => {setCName(e.target.value)}} placeholder={cName}></FormControl>
                    <FormControl className='m-2' placeholder='Mail'></FormControl>
                  </Card.Body>
                  <Card.Footer style={{background:"#48d1cc"}}>
                    <Button className='ms-2' onClick={()=> {newCustomer()}} disabled={isAddBtn}>Create Account</Button>
                  </Card.Footer>
                </Card>
              </MDBTabsPane>
            </MDBTabsContent>
          </div>
        </Card.Body>
        <Card.Footer className='bg-dark' style={{color:"white"}}>
          <Link className='btn btn-outline-info ms-2' to="/"><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
          <br/>
         
        </Card.Footer>
      </Card>
      
    </div>
  )
}

export default Company;
