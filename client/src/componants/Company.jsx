import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Card, FormControl, ListGroup, ListGroupItem, Col, Row} from 'react-bootstrap';
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
import verified from '../png/verified.png'
import { Alert } from '@mui/material'
import CustomNav from './CustomNav';
import KeyValue from './KeyValue';
import ProgressBar from './ProgressBar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


import EngineeringIcon from '@mui/icons-material/Engineering';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import BusinessIcon from '@mui/icons-material/Business';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';



function Company() {

  const [isWallet, setIsWallet] = useState(false);
  const [hover, setHovering] = useState(4);
  const [iconsActive, setIconsActive] = useState('tab1');
  const [account, setAccount] = useState("");
  const [companyName, setCompanyName] = useState();
  const web3 = new Web3(Web3.givenProvider || 'http://172.17.0.1:8545');
  const contract = new web3.eth.Contract(ABI,ProgramID);
  const [tmp, setTmp] = useState(true);

  const [loading, setLoading] = useState(true);

  // emp
  const [empName, setEmpName] = useState("");  
  const [empAddr, setEmpAddr] = useState("");
  // Company Details
  const [details, setDetails] = useState([])
  const [employeeDetails, setEmployeeDetails] = useState([]);

  const [balance, setBalance] = useState(0);
  const [altErr, setAltErr] = useState(<></>);

  const [showOnly, setShowOnly] = useState("All");
  const [sortBy, setSortBy] = useState("Id");
  const [defaultEmployeeDetail, setDefaultEmployeeDetail] = useState([]);
  const [backd, setBackd] = useState(<></>);


  async function getDetails(){
    setLoading(true);
    let data_ =  await contract.methods.getCompanyDetails().call({from: account})
    setDetails(data_);
    data_ =  await contract.methods.getEmployeeDetails().call({from: account})
    setEmployeeDetails(data_);
    setDefaultEmployeeDetail(data_);
    console.log(data_)
    setTimeout(() => {setLoading(false)}, 4300);
    setBackd(<></>)
    // setLoading(false);
  }
  useEffect(() => {
      getDetails();
  },[account])

  useEffect(() => {
    let tmp = [];
    let tmp2 = [];
    tmp = employeeDetails.slice(); 
    if(sortBy == 'Default'){
      setEmployeeDetails(defaultEmployeeDetail);
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
      setEmployeeDetails(tmp2);
    }else if(sortBy == 'Name'){
      tmp.sort((a, b) => a.name.normalize().localeCompare(b.name.normalize()));
      setEmployeeDetails(tmp);
    }
  }, [sortBy])

  useEffect(() => {
    setTimeout(async () => {
      await connectWallet();
      setTmp(!tmp);
    },1000);
  }, [tmp])

  // useEffect(() => {
  //   setTimeout(() => {setAltErr(<></>)}, 4000)
  // }, [altErr])

  async function createCompany(){
    let data_ = await contract.methods.newCompany(companyName).send({from: account});
    setAltErr(<Alert show={true}  className='m-3' severity="success" onClose={() => {handleIconsClick('tab2');setAltErr(<></>)}}>Company created. Add some Employee</Alert>)
    await getDetails();
    console.log(data_);
  }

  // add Employee
  
  async function addEmployee(){
    try{
      let addr = await contract.methods.map_employee(empAddr).call();
      if(addr.inside == false){
        let data = await contract.methods.addEmployee(empName, empAddr).send({from: account})
        setAltErr(<Alert show={true}  className='m-3' severity="info" onClose={() => {setAltErr(<></>)}}>Operation done</Alert>)
        console.log(data);
      }else{
        setAltErr(<Alert show={true}  className='m-3' severity="error" onClose={() => {setAltErr(<></>)}}>This Employee already Exiest in a Company</Alert>)
      }
    }catch(e){
      setAltErr(<Alert show={true}  className='m-3' severity="error" onClose={() => {setAltErr(<></>)}}>{e.message}</Alert>)
    }
    await getDetails()
  }

  async function taggleEmpStatus(addr){
    try{
      let data = await contract.methods.taggleInside(addr).send({from: account});
      setAltErr(<Alert show={true}  className='m-3' severity="success" onClose={() => {setAltErr(<></>)}}>Operation Successfully</Alert>)
      console.log(data);
    }catch(e){
      setAltErr(<Alert show={true}  className='m-3' severity="error" onClose={() => {setAltErr(<></>)}}>{e.message}</Alert>)
    }
    await getDetails()
  }

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
      setIsWallet(!isWallet);
    }

  
    
    
    useEffect(() => {
      connectWallet();
      setBackd(<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} ><CircularProgress color="inherit" /></Backdrop>);
    }, [])
    
    return (
      <div>
        {backd}
        <CustomNav backTo="/seller" loadingColor="primary" loading={loading} balance={balance} funcs={() => {connectWallet();getDetails()}}/>
      

      <Card className={`m-5 pd-${hover}`} onMouseLeave={()=>{setHovering( 1 )}} onMouseEnter={()=>{setHovering( 0 )}}>
        <Card.Header className='bg-dark' style={{color:"white"}}>
        
          <Card.Title >My Company</Card.Title>
        </Card.Header>
        <Card.Body className='p-1 m-5 ms-5'>
          <Card className='mb-2 bg-opacity-10' style={{"textAlign":"left"}} >
            <Card.Header style={{background:"#deb887"}}>
              <h5>{account}</h5>
            </Card.Header>
            <Card.Body style={{background:"#FFF8E1"}}>

              {details[0] != ''?
            <ListGroup variant="flush" >
 
              <KeyValue keys="Name" value={<>{details[0]} {(details[2] > 0)? <img src={verified} style={{maxBlockSize:'25px'}}/>:<></>}</>} icon={<BusinessIcon />} bg="#FFF8E1"/>
              <KeyValue keys="Number of Employee" value={(details[2] == 0)? <span className="badge bg-warning">Nil</span>:details[2]} icon={<EngineeringIcon />} bg="#FFF8E1"/>
              <KeyValue keys="Number of Vehicle" value={(details[3] == 0)? <span className="badge bg-warning">Nil</span>:details[3]} icon={<EmojiTransportationIcon />} bg="#FFF8E1"/>
              <KeyValue keys="Company Status" value={(details[4])?  <span className="badge bg-success">Open</span>:<span className="badge bg-danger">Close</span>} icon={<AssuredWorkloadIcon/>} bg="#FFF8E1"/>
               
            </ListGroup>
            :<></>}
            </Card.Body>
          </Card>
          <div className=''>
            <MDBTabs className='mb-3' >
              <MDBTabsItem >
                <MDBTabsLink onClick={() => handleIconsClick('tab1')} active={iconsActive === 'tab1'} >
                   Dashboard
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink onClick={() => handleIconsClick('tab2')} active={iconsActive === 'tab2'}>
                   Add Employee
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink onClick={() => handleIconsClick('tab3')} active={iconsActive === 'tab3'}>
                  Settings {details[0] == '' ? <span className='badge bg-danger'>1</span>:<></>}
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>
            {altErr}
            {(details[0] =='')? <Alert show={true}  className='m-3' severity="error" onClose={() => {handleIconsClick('tab3')}}>You don't have company yet.</Alert>:<></>}  

            <MDBTabsContent style={{background:""}} className='rounded' >
              <MDBTabsPane show={iconsActive === 'tab1'} style={{textAlign:'left',background:''}} className='m-0 p-2 rounded' >

                {['sm'].map((expand) => (
                  <Navbar key={expand} bg="" style={{background:"#FFF8E1"}}  expand={expand} className="mb-3 rounded">
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
                    <select onClick={(e)=> {setShowOnly( e.target.value)}} className="form-control form-select" style={{maxWidth: '120px', marginLeft:'-5px'}}>
                      <option className="form-control rounded" selected>All</option>
                      <option className="form-control rounded">Kicked</option>
                      <option className="form-control rounded">Access</option>
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
                    </select>
                  </div>
                  <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text ms-2" id="">View</span>
                      </div>
                      <Button className='btn-secondary' onClick={() => {let tmp = employeeDetails.slice().reverse(); setEmployeeDetails(tmp)}}>Inverte</Button>
                    </div>
                          <Form className="d-flex">
                          </Form>
                        </Offcanvas.Body>
                      </Navbar.Offcanvas>
                    </Container>
                  </Navbar>
                ))}
                
                
                <Row xs={1} md={3} className="g-2">

                {employeeDetails.map((emp) => {
                  if(showOnly == "All" || (showOnly == "Access" && emp.inside) || (showOnly == "Kicked" && !emp.inside)){
                    return (
                      <Col>
                    <Card  key={`${emp.owner}`} className='mb-2' id='card-bodys'>
                        <Card.Header style={{background:"#f6eabe"}}>
                        {emp.owner} {(emp.inside)? <span className="badge bg-success">Access</span>:<span className="badge bg-danger">Kicked</span>} 
                        </Card.Header>
                        {(loading)? <ProgressBar color="inherit"/>:<></>}
                        <Card.Body style={{background:"#FFF8E1"}}>
                        <ListGroup variant="flush" >
                          <KeyValue keys="Name" value={emp.name} icon={<EngineeringIcon />} bg="#FFF8E1"/>
                          <KeyValue keys="Number of Vehicle" value={emp.product_count} icon={<EmojiTransportationIcon />} bg="#FFF8E1"/>
                        </ListGroup>
                        </Card.Body>
                        <Card.Footer style={{background:"#f6eabe"}}>
                          <Button className={`ms-2 btn btn-${(emp.inside)? "danger":"success"}`} onClick={()=> {taggleEmpStatus(emp.owner)}}>
                          {(emp.inside)? "kick":"Admit"}
                          </Button>
                        
                        </Card.Footer>
                      </Card>
                    </Col>
                    )
                  }
                  })}
                  </Row>
              </MDBTabsPane>


              <MDBTabsPane show={iconsActive === 'tab2'} style={{textAlign:'left',background:''}} className='m-0 p-2 rounded'>
              <Card>
                  <Card.Header style={{background:"#deb887"}}>
                    Add Employee
                  </Card.Header>
                  <Card.Body style={{background: "#FFF8E1"}}>
                    <FormControl className='m-2' onChange={(e)=>{setEmpName(e.target.value)}} required placeholder='Employee Name'></FormControl>
                    <FormControl className='m-2' onChange={(e)=>{setEmpAddr(e.target.value)}} required placeholder='Employee Address'></FormControl>
                  </Card.Body>
                  <Card.Footer style={{background:"#deb887"}}>
                    <Button onClick={()=> {addEmployee()}} disabled={(empName.length == 0 || empAddr.length != 42)} className='m-2'>Add Employee</Button>
                  </Card.Footer>
                </Card>
              </MDBTabsPane>


              <MDBTabsPane show={iconsActive === 'tab3'} style={{textAlign:'left',background:'#FFF8E1'}} className='m-1 p-3 rounded'>
                Create Company:
                <FormControl placeholder={details[0]} onChange={(e)=>{ setCompanyName(e.target.value) }}/><br/>
                <Button onClick={()=>{  createCompany()}} disabled={(details[0] != '')? true:false}>Create Company</Button>
              </MDBTabsPane>
            </MDBTabsContent>
          </div>
        </Card.Body>
        <Card.Footer className='bg-dark' style={{color:"white"}}>
          <Link className='btn btn-outline-info ms-2' to="/seller"><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
          {/* <Link className='btn btn-outline-info ms-2' to="/employee">Employee &gt;</Link>        */}
          <br/>
        </Card.Footer>
      </Card>
      
    </div>
  )
}

export default Company;
