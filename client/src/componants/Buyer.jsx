import React from 'react'
import Button from 'react-bootstrap/Button';
import {Card, FormControl, ListGroup, ListGroupItem, Row, Col, InputGroup, Badge} from 'react-bootstrap';
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
import verified from '../png/verified.png'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import CustomNav from './CustomNav';
import { GridRowParams } from '@mui/x-data-grid';
import {Autocomplete,Avatar,TableBody,TextField }from '@mui/material';
import { Alert } from '@mui/material'
import copy from 'clipboard-copy'
import PopOver from './PopOver';
import KeyValue from './KeyValue';

import FaceIcon from '@mui/icons-material/Face';
import AirportShuttle from '@mui/icons-material/AirportShuttle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SellIcon from '@mui/icons-material/Sell';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';



function Company() {

  const [hover, setHovering] = useState(4);
  const [iconsActive, setIconsActive] = useState('tab1');
  const [account, setAccount] = useState("");
  const web3 = new Web3( Web3.givenProvider || 'http://172.17.0.1:8545');
  const contract = new web3.eth.Contract(ABI,ProgramID);
  const [tmp, setTmp] = useState(true);
  const [loading, setLoading] = useState(true);

  const [details, setDetails] = useState(['']);
  const [productDetails, setProductDetails] = useState([]);

  const [cName, setCName] = useState("Name");
  const [cMail, setCMail] = useState("");

  const [balance, setBalance] = useState(0);

  const [isAddBtn, setIsAddBtn] = useState(true);

  const [mintedProduct, setMintedProduct] = useState([]);

  const [select , setSelect] = useState([]);
  const [altErr, setAltErr] = useState();

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
  }
  useEffect(() => {
    setTimeout(async () => {
      connectWallet();
      setTmp(!tmp);
    },4000);
  }, [tmp])
  async function serilize(data){
      setProductDetails(data);
  }
  async function getDetails(){
    setLoading(true);
    const cus = await contract.methods.getCustomerDetail().call({from:account});
    console.log(cus);
    setDetails(cus);
    try{
      let _details = await contract.methods.getAllMyproducts().call({from:account});
      console.log(_details);
      setProductDetails(_details);
    }catch(e){
      console.log(" - Error ");
    }
    try{
      const minted = await contract.methods.getAllMintedProducts().call({from:account});
      setMintedProduct(minted);
      console.log(minted)
    }catch(e){
      
    }
    setTimeout(() => {setLoading(false)}, 4300);
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
  }, [])

  useEffect(() => {
    getDetails();
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
  const columns = [
    { field: 'id', headerName: 'ID', width: 230 },
    {
      field: 'name',
      headerName: 'Vehicle Name',
      width: 140,
      editable: false,
    },
    {
      field: 'owner',
      headerName: 'Current Owner',
      width: 180,
    },
    {
      field: 'type_',
      headerName: 'Type',
      width: 120,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 130,
    },
    {
      field: 'noOFTimeSold',
      headerName: 'Number of Time Sold',
      width: 130,
    },
    {
      field: 'creator',
      headerName: 'Creator',
      width: 180,
    },
    // {
    //   field: 'mintables',
    //   headerName: 'Request Product',
    //   width: 130,
    //   sortable:false,
    //   valueGetter: (params) => 
    //   {<Button onClick={() => {requestForTransfer(`${params.row.id}`)}}>Request this Product</Button>},
    // }
    
  ];

  
  
  return (
    <div>
      <CustomNav backTo="/" loadingColor="primary" loading={loading} balance={balance} funcs={() => {connectWallet();getDetails()}}/>

      <Card className={`m-5 pd-${hover}`} onMouseLeave={()=>{setHovering( 1 )}} onMouseEnter={()=>{setHovering( 0 )}}>
        <Card.Header className='bg-dark' style={{color:"white"}}>
          <Card.Title >{(details[1])? <span className="badge bg-success">Verified User ✓</span>:<span className="badge bg-danger" onClick={() => handleIconsClick('tab3')} active={iconsActive === 'tab3'}>✗ Please Create an account</span>}</Card.Title>
        </Card.Header>
        <Card.Body className='p-1 m-5 ms-5'>
                <Card className='mb-2' style={{textAlign:"left"}}>
                  <Card.Header style={{background:"#48d1cc"}}>
                    <h5>Owner: {account} {(details[1])? <span className="badge bg-success">Active</span>:<span className="badge bg-danger">Not Active</span>}</h5>
                  </Card.Header>
                  <Card.Body style={{background:"#c9ffe5"}}>
                    <ListGroup variant="flush">
                      <TableBody>
                          <KeyValue keys="Name" value={<>{details[0]} {(details[1])? <img src={verified} style={{maxBlockSize:'25px'}}/>:<></>}</>} icon={<FaceIcon/>} bg="#c9ffe5"/>
                          <KeyValue keys="Number of Products" value={(details[2] == 0)? <span className="badge bg-warning">Nil</span>:details[2]} icon={<AirportShuttle/>} bg="#c9ffe5"/>
                      </TableBody>
                    </ListGroup>
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
                   Explore
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink onClick={() => handleIconsClick('tab3')} active={iconsActive === 'tab3'}>
                   Settings {(details[1])? <></>:<span className='badge bg-danger'>1</span>}
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent >
            {altErr}
              <MDBTabsPane show={iconsActive === 'tab1'} style={{textAlign:'left'}} className='m-0 p-2 rounded' >


                <Row xs={1} md={3} className="g-2">
                {productDetails.map((pro) => {
                  return (
                    <Col>
                      <Card className='mb-3'>
                        <Card.Header style={{background:"#48d1cc"}}>
                          # {pro.id} <ContentCopyIcon style={{cursor:'pointer'}} variant="contained" onClick={() => {copy(`${pro.id}`);setAltErr(<Alert show={true}  className='m-3' severity="success" onClose={() => {setAltErr(<></>)}}>Copied {pro.id}</Alert>)}}> </ContentCopyIcon>
                           {(pro.owner == account)? (pro.mintable)? <span className="badge bg-success">Minted</span>:<span className="badge bg-danger">Not Minted</span>:<span className="badge bg-danger">Sold</span>}
                        </Card.Header>
                        <Card.Body style={{background:"#c9ffe5"}}>
                        <ListGroup variant="flush"  >
                              <KeyValue keys="Vehicel Identify Number" value={pro.name} icon={<FingerprintIcon/>} bg="#c9ffe5"/>
                              {/* <ListGroupItem style={{background:"#F3E5F5"}}>UniqId: {pro.uniqNumber}</ListGroupItem> */}
                              <KeyValue keys="Owned" value={pro.owner} icon={<FaceIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Type of the Vehicle" value={pro.type_} icon={<CarCrashIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Number of time Sold" value={(pro.noOFTimeSold  == 0)? <span className="badge bg-success">New</span>:pro.noOFTimeSold} icon={<SellIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Price" value={<span className='badge bg-info'>₹ {pro.price}</span>} icon={<CurrencyRupeeIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Creator" value={pro.creator} icon={<EngineeringIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Requested" value={pro.requested} icon={<GroupAddIcon/>} bg="#c9ffe5"/>
                          {/* <ListGroupItem style={{background:"#c9ffe5"}}>Product Created Time: {new Date(pro.date * 1000).toString()}</ListGroupItem> */}
                          <PopOver actual={pro.date.length} message={
                              <ListGroup style={{background:"#48d1cc"}}>
                            {pro.date.map((date, i) => {
                              return (
                                <ListGroupItem style={{background:"#48d1cc"}}><span className='badge bg-success'>{i+1}</span> {new Date(date * 1000).toString()}</ListGroupItem>
                                )
                              })}
                            </ListGroup>
                          } />
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
                <Card className='mb-2  className=" bg-opacity-10"'>
                  <Card.Header style={{background:"#48d1cc"}}>
                    Explore Products
                  </Card.Header>
                  <Card.Body className=''>

                  <Box sx={{ height: 270, width: '100%' }}>
                    <DataGrid
                      rows={mintedProduct}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 5,
                          },
                        },
                      }}
                      pageSizeOptions={[3]}
                      checkboxSelection
                      disableRowSelectionOnClick
                      isRowSelectable={(params) => (params.row.requested == "0x0000000000000000000000000000000000000000" && params.row.owner != account) }
                      onRowSelectionModelChange={(newSelection) => {
                        setSelect(newSelection);
                      }}
                    />
                  </Box>

                  </Card.Body>
                  <Card.Footer style={{background:"#48d1cc"}}>

                  <div className="input-group">
                  <Autocomplete
                    className='bg-white rounded'
                    varient='secondary'
                    onChange={(e, value) => { mintedProduct.map(e => {if (e.id == value){setSelect(e)}})}} 
                    disablePortal
                    options={mintedProduct.map(e => e.id)}
                    sx={{ width: 600 }}
                    size="small"
                    renderInput={(params) => <TextField {...params} label="Id" />}
                  />
                    <Button className='' disabled><ManageSearchIcon/></Button>
                  </div>
                  </Card.Footer>
                </Card>
                <Row xs={1} md={3} className="g-2">
                {mintedProduct.map((pro) => {
                  if(pro.owner !=  account && select.find(() => {return select[select.indexOf(pro.id)] == pro.id})){
                    return (
                      <Col>
                      <Card className='mb-3'>
                        <Card.Header style={{background:"#48d1cc"}}>
                          # {pro.id} {(pro.owner != account)? (pro.mintable)? <span className="badge bg-success">Minted</span>:<span className="badge bg-danger">Not Minted</span>:<span className="badge bg-success">Owned</span>}
                        </Card.Header>
                        <Card.Body style={{background:"#c9ffe5"}}>
                        <ListGroup variant="flush"  >
                              <KeyValue keys="Vehicel Identify Number" value={pro.name} icon={<FingerprintIcon/>} bg="#c9ffe5"/>
                              {/* <ListGroupItem style={{background:"#F3E5F5"}}>UniqId: {pro.uniqNumber}</ListGroupItem> */}
                              <KeyValue keys="Owned" value={pro.owner} icon={<FaceIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Type of the Vehicle" value={pro.type_} icon={<CarCrashIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Number of time Sold" value={(pro.noOFTimeSold  == 0)? <span className="badge bg-success">New</span>:pro.noOFTimeSold} icon={<SellIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Price" value={<span className='badge bg-info'>₹ {pro.price}</span>} icon={<CurrencyRupeeIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Creator" value={pro.creator} icon={<EngineeringIcon/>} bg="#c9ffe5"/>
                              <KeyValue keys="Requested" value={pro.requested} icon={<GroupAddIcon/>} bg="#c9ffe5"/>

                         
                          {/* <ListGroupItem style={{background:"#c9ffe5"}}>Product Created Time: {new Date(pro.date * 1000).toString()}</ListGroupItem> */}
                          <PopOver actual={pro.date.length} message={
                              <ListGroup style={{background:"#48d1cc"}}>
                            {pro.date.map((date, i) => {
                              return (
                                <ListGroupItem style={{background:"#48d1cc"}}><span className='badge bg-success'>{i+1}</span> {new Date(date * 1000).toString()}</ListGroupItem>
                                )
                              })}
                            </ListGroup>
                          } />
                        </ListGroup>
                        </Card.Body>
                        <Card.Footer style={{background:"#48d1cc"}}>
                        
                          <Button onClick={() => {requestForTransfer(pro.id)}} disabled={(pro.requested != '0x0000000000000000000000000000000000000000')}>Request this Product</Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                    )
                  }
                  })}
                  </Row>
              </MDBTabsPane>
              <MDBTabsPane show={iconsActive === 'tab3'} style={{textAlign:'left',background:''}} className='m-0 p-2 rounded'>
              <Card>
                  <Card.Header style={{background:"#48d1cc"}}>
                    Settings
                  </Card.Header>
                  <Card.Body style={{background:"#c9ffe5"}}>
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1" style={{background:"#48d1cc"}}>Name</InputGroup.Text>
                    <FormControl className='' onChange={(e) => {setCName(e.target.value)}} placeholder={details[0]}></FormControl>
                    </InputGroup>
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1" style={{background:"#48d1cc"}}>Mail</InputGroup.Text>
                    <FormControl className='' placeholder='Mail'></FormControl>
                    </InputGroup>
                  </Card.Body>
                  <Card.Footer style={{background:"#48d1cc"}}>
                    <Button className='ms-2' onClick={()=> {newCustomer()}} disabled={details[0].length}>Create Account</Button>
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
