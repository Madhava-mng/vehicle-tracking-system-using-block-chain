import React from 'react'
import Button from 'react-bootstrap/Button';
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
import CustomNav from './CustomNav';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import PopOver from './PopOver';
import verified from '../png/verified.png'
import KeyValue from './KeyValue';
import {Autocomplete,TextField }from '@mui/material';
import copy from 'clipboard-copy'
import './Animation.css'



import EngineeringIcon from '@mui/icons-material/Engineering';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import BusinessIcon from '@mui/icons-material/Business';
import FaceIcon from '@mui/icons-material/Face';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SellIcon from '@mui/icons-material/Sell';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


function Company() {
  
  const [hover, setHovering] = useState(4);
  const [iconsActive, setIconsActive] = useState('tab1');
  const [account, setAccount] = useState("");
  const web3 = new Web3( Web3.givenProvider || 'http://172.17.0.1:8545');
  const contract = new web3.eth.Contract(ABI,ProgramID);
  const [tmp, setTmp] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const [select , setSelect] = useState([]);
  const [details, setDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  const [vName, setVName] = useState("");
  const [vType, setVType] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [altErr, setAltErr] = useState(<Alert show={true}  className='m-3' severity="info" onClose={() => {setAltErr(<></>)}}>Welcome {details[0]}</Alert>);

  const [balance, setBalance] = useState(0);

  const [isAddBtn, setIsAddBtn] = useState(true);

  const [showOnly, setShowOnly] = useState("All");
  const [sortBy, setSortBy] = useState("Id");
  const [defaultProductDetail, setDefaultProductDetail] = useState([]);
  const [cmpName, setCmpName] = useState("");

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
    setDefaultProductDetail(_details);
    setTimeout(() => {setLoading(false)}, 3300);
    console.log(_details);
    setCmpName(await contract.methods.map_getCompanyName(_emp.company).call({from:account}));
  }

  
  
  async function newProduct(){
    let _newProduct = await contract.methods.newProduct(
      vName,
      vType,
      vPrice
    ).send({from: account});
    setAltErr(<Alert show={true}  className='m-3' severity="success" onClose={() => {setAltErr(<></>)}}>New Product added</Alert>)
    console.log(_newProduct);
    getDetails();
  }
  
  useEffect(() => {
    setIsAddBtn((vName.length > 1 && vPrice > 0 && vType.length > 1  && details[3] && details[4])? false: true);
  }, [vName,vPrice, vType])
  
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

  useEffect(() => {
    let tmp = [];
    let tmp2 = [];
    tmp = productDetails.slice(); 
    if(sortBy == 'Default'){
      setProductDetails(defaultProductDetail);
    }else if(sortBy == 'Count'){

      if(tmp.length > 0){
        while(tmp.length){
          let t = tmp.pop();
          if(tmp2.length == 0){
            tmp2.push(t);
          }else{
            while(tmp2.length > 0 && tmp2[tmp2.length-1].product_count > t.product_count){
              tmp.push(tmp2.pop());
            }
            tmp2.push(t);
          }
        }
      }
      setProductDetails(tmp2);
    }else if(sortBy == 'Price'){

      if(tmp.length > 0){
        while(tmp.length){
          let t = tmp.pop();
          if(tmp2.length == 0){
            tmp2.push(t);
          }else{
            while(tmp2.length > 0 && Number(tmp2[tmp2.length-1].price) > Number(t.price)){
              tmp.push(tmp2.pop());
            }
            tmp2.push(t);
          }
        }
      }
      setProductDetails(tmp2);
    }else if(sortBy == 'Name'){
      tmp.sort((a, b) => a.name.normalize().localeCompare(b.name.normalize()));
      setProductDetails(tmp);
    }
  }, [sortBy])

  return (
    <div>
      <CustomNav backTo="/seller" loadingColor="secondary" loading={loading} balance={balance} funcs={() => {connectWallet();getDetails()}}/>
     
      <Card className={`m-5 pd-${hover}`} onMouseLeave={()=>{setHovering( 1 )}} onMouseEnter={()=>{setHovering( 0 )}}>
        <Card.Header className='bg-dark' style={{color:"white"}}>
          <Card.Title >{(details[3])? <span className="badge bg-success">Verified Employee ✓</span>:<span className="badge bg-danger">✗ You are not belongs to any Company</span>}</Card.Title>
        </Card.Header>
        <Card.Body className='p-1 m-5 ms-5'>
          <Card className='mb-2' style={{textAlign:"left"}}>
            <Card.Header style={{background:"#CE93D8"}}>
              <h5>{account} {(details[4])? <span className="badge bg-success">Active</span>:<span className="badge bg-danger">Not Active</span>}</h5>
            </Card.Header>
            <Card.Body style={{background:"#F3E5F5"}}>
              {(details[0])?
              <ListGroup variant="flush">
                <KeyValue keys="Name" value={<>{details[0]} {details[5] != 0? <img src={verified} style={{maxBlockSize:'25px'}}/>:<></>}</>} icon={<EngineeringIcon/>} bg="#F3E5F5"/>
                <KeyValue keys="Number of Vehicle" value={(details[5] == 0)? <span className="badge bg-warning">Nil</span>:details[5]} icon={<EmojiTransportationIcon />} bg="#F3E5F5 "/>
                <KeyValue keys="Name of the company" value={<>{cmpName} ({details[2]})</>} icon={<BusinessIcon />} bg="#F3E5F5 "/>
              </ListGroup>:<></>
              }
            </Card.Body>
          </Card>
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

                {['sm'].map((expand) => (
                  <Navbar key={expand} bg="" style={{background:"#F3E5F5"}}  expand={expand} className="mb-3 rounded">
                    <Container fluid>
                      <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                      <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-${expand}`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                        placement="end"
                      >
                        <Offcanvas.Header closeButton>
                          <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} style={{"color":"white"}}>
                            Vehicle Tracking
                          </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                          <Nav className="justify-content-end flex-grow-1 pe-3">
                            
                          </Nav>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text ms-2" id="">Show</span>
                    </div>
                    <select onClick={(e)=> {setShowOnly( e.target.value)}} className="form-control form-select" style={{maxWidth: '150px', marginLeft:'-5px'}}>
                      <option className="form-control rounded" selected>All</option>
                      <option className="form-control rounded">Minted</option>
                      <option className="form-control rounded">Only</option>
                      <option className="form-control rounded">Not Minted</option>
                      <option className="form-control rounded">Sold</option>
                      <option className="form-control rounded">Requested</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text ms-2" id="">Sort By</span>
                    </div>
                    <select onClick={(e)=> {setSortBy( e.target.value)}} className="form-control form-select" style={{maxWidth: '120px', marginLeft:'-5px'}}>
                      <option className="form-control rounded" selected>Default</option>
                      <option className="form-control rounded">Name</option>
                      <option className="form-control rounded">Count</option>
                      <option className="form-control rounded">Price</option>
                    </select>
                  </div>
                  <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text ms-2" id="">View</span>
                      </div>
                      <Button className='btn-secondary' onClick={() => {let tmp = productDetails.slice().reverse(); setProductDetails(tmp)}}>Inverte</Button>
                    </div>
                          <Form className="d-flex">
                            {(showOnly == 'Only')?
                              <Autocomplete
                                className='bg-white rounded'
                                varient='secondary'
                                onChange={(e, value) => { productDetails.map(e => {setSelect(value)})}} 
                                disablePortal
                                options={productDetails.map(e => e.id)}
                                sx={{ width: 510 }}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Vehicle Id" />}
                              />:<></>
                          }
                          </Form>
                        </Offcanvas.Body>
                      </Navbar.Offcanvas>
                    </Container>
                  </Navbar>
                ))}

                <Row xs={1} md={3} className="g-2 p-2 rounded"  style={{background:""}} >
                {productDetails.map((pro) => {
                  console.log(`*${showOnly}* ====${select}====`);
                  if( (showOnly == 'All' || showOnly == 'Only' ||
                  (showOnly == 'Minted' && pro.mintable && pro.owner == pro.creator) || 
                  (showOnly == "Not Minted" && !pro.mintable) || (showOnly == "Sold" && pro.owner != pro.creator) || 
                  (showOnly == "Requested" && pro.requested != '0x0000000000000000000000000000000000000000' && pro.owner == account))){
                    
                    if(select != pro.id && showOnly == "Only"){
                      return
                    }
                      return (
                        <Col>
                          <Card className='mb-3 cardh '>
                            <Card.Header style={{background:"#CE93D8"}}>
                              # {pro.id} <ContentCopyIcon  style={{cursor:'pointer'}} variant="contained" onClick={() => {copy(`${pro.id}`);setAltErr(<Alert show={true}  className='m-3' severity="success" onClose={() => {setAltErr(<></>)}}>Copied {pro.id}</Alert>)}}> </ContentCopyIcon>
                               {(pro.owner == pro.creator)? (pro.mintable)? <span className="badge bg-success">Minted</span>:<span className="badge bg-danger">Not Minted</span>:<span className="badge bg-info">Sold</span>}
                            </Card.Header>
                            <Card.Body style={{background:"#F3E5F5"}} className="rounded">
                            <ListGroup variant="flush">
                              <KeyValue keys="Vehicel Identify Number" value={pro.name} icon={<FingerprintIcon/>} bg="#F3E5F5"/>
                              {/* <ListGroupItem style={{background:"#F3E5F5"}}>UniqId: {pro.uniqNumber}</ListGroupItem> */}
                              <KeyValue keys="Owned" value={pro.owner} icon={<FaceIcon/>} bg="#F3E5F5"/>
                              <KeyValue keys="Type of the Vehicle" value={pro.type_} icon={<CarCrashIcon/>} bg="#F3E5F5"/>
                              <KeyValue keys="Number of time Sold" value={(pro.noOFTimeSold  == 0)? <span className="badge bg-success">New</span>:pro.noOFTimeSold} icon={<SellIcon/>} bg="#F3E5F5"/>
                              <KeyValue keys="Price" value={<span className='badge bg-info'>₹ {pro.price}</span>} icon={<CurrencyRupeeIcon/>} bg="#F3E5F5"/>
                              <KeyValue keys="Creator" value={pro.creator} icon={<EngineeringIcon/>} bg="#F3E5F5"/>
                              <KeyValue keys="Requested" value={pro.requested} icon={<GroupAddIcon/>} bg="#F3E5F5"/>

                              <ListGroupItem style={{background:"#F3E5F5"}}>
                                <PopOver actual={pro.date.length} message={
                                  <ListGroup style={{background:"#CE93D8"}}>
                                {pro.date.map((date, i) => {
                                  return (
                                    <ListGroupItem style={{background:"#CE93D8"}}><span className='badge bg-success'>{i+1}</span> {new Date(date * 1000).toString()}</ListGroupItem>
                                    )
                                  })}
                                </ListGroup>
                              } />
                              </ListGroupItem>
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
                      // sleep(1000);
                  }
                }
              )}
                  </Row>
              </MDBTabsPane>


              <MDBTabsPane show={iconsActive === 'tab2'} style={{textAlign:'left',background:''}} className='m-0 p-2 rounded'>
                <Card>
                  <Card.Header style={{background:"#CE93D8"}}>
                    Add Product
                  </Card.Header>
                  <Card.Body style={{background:"#F3E5F5"}}>
                    <FormControl onChange={(e)=> {setVName(e.target.value)}} className='m-2 p-2' placeholder='Vehicle Itentity Number' required></FormControl>
                    {/* <FormControl onChange={(e)=> {setVUid(e.target.value)}} className='m-2 p-2' placeholder='Uniq Id' required></FormControl> */}
                    <FormControl onChange={(e)=> {setVType(e.target.value)}} className='m-2 p-2' placeholder='Type of the Vehicle' required></FormControl>
                    <FormControl onChange={(e)=> {setVPrice(e.target.value)}} className='m-2 p-2' placeholder='₹ Price' type="number" required></FormControl>
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
