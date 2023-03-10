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
import './Animation.css'
import back from '../png/back.png';


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

  const [showOnly, setShowOnly] = useState("All");
  const [sortBy, setSortBy] = useState("Id");
  const [defaultEmployeeDetail, setDefaultEmployeeDetail] = useState([]);

  async function abc(){
    setLoading(true);
    let data_ =  await contract.methods.getCompanyDetails().call({from: account})
    setDetails(data_);
    data_ =  await contract.methods.getEmployeeDetails().call({from: account})
    setEmployeeDetails(data_);
    setDefaultEmployeeDetail(data_);
    console.log(data_)
    setTimeout(() => {setLoading(false)}, 4000);
    // setLoading(false);
  }
  useEffect(() => {
      abc();
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
    },10000);
  }, [tmp])

  async function createCompany(){
    let data_ = await contract.methods.newCompany(companyName).send({from: account});
    await abc();
    console.log(data_);
  }

  // add Employee
  
  async function addEmployee(){
    let data = await contract.methods.addEmployee(empName, empAddr).send({from: account})
    await abc()
    console.log(data);
  }

  async function taggleEmpStatus(addr){
    let data = await contract.methods.taggleInside(addr).send({from: account});
    await abc()
    console.log(data);
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

 

  useEffect(() => {connectWallet()}, [])

  return (
    <div>
      {/* <Chart /> */}
     
      {['sm'].map((expand) => (
        <Navbar key={expand} bg="dark"  expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Brand href="/" style={{"color":"white"}}>Vehicle Tracking</Navbar.Brand>
            {(loading)? <div class="spinner-border text-info spinner-border-md" role="status"><span class="sr-only"></span></div>:<></>}
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
                  <Link className='btn btn-outline-info ms-2' to="/seller"><img src={back} style={{maxBlockSize:'19px'}}/> Back</Link>
                  {/* <Link className='btn btn-outline-info ms-2' to="/employee">Employee &gt;</Link> */}
                 
                </Nav>
                <Form className="d-flex">
                </Form>
                <Button className='btn-dark btn-outline'><img src={'https://i.redd.it/bfo1798dlo7z.png'} style={{maxBlockSize:'19px'}}/> {balance}</Button>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}

      <Card className={`m-5 pd-${hover}`} onMouseLeave={()=>{setHovering( 1 )}} onMouseEnter={()=>{setHovering( 0 )}}>
        <Card.Header className='bg-dark' style={{color:"white"}}>
        
          <Card.Title >My Company</Card.Title>
        </Card.Header>
        <Card.Body className='p-1 m-5 ms-5'>
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
                  Settings
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent style={{background:""}} className='rounded' >
              <MDBTabsPane show={iconsActive === 'tab1'} style={{textAlign:'left',background:''}} className='m-0 p-2 rounded' >
                <Card className='mb-2' >
                  <Card.Header style={{background:"#deb887"}}>
                    <h5>Owner: {account}</h5>
                  </Card.Header>
                  <Card.Body style={{background:"#FFF8E1"}}>
                  <ListGroup variant="flush" >
                      <ListGroup.Item style={{background:"#FFF8E1"}}>Name: {details[0]}</ListGroup.Item>
                      <ListGroup.Item style={{background:"#FFF8E1"}}>No Of Employee: {(details[2] == 0)? <span className="badge bg-warning">Nil</span>:details[2]}</ListGroup.Item>
                      <ListGroup.Item style={{background:"#FFF8E1"}}>No Of Products: {(details[3] == 0)? <span className="badge bg-warning">Nil</span>:details[3]}</ListGroup.Item>
                      <ListGroup.Item style={{background:"#FFF8E1"}}>Company Status: {(details[4])?  <span className="badge bg-success">Open</span>:<span className="badge bg-danger">Close</span>}</ListGroup.Item>
                      <ListGroup.Item style={{background:"#FFF8E1"}}></ListGroup.Item>
                  </ListGroup>
                  </Card.Body>
                  <Card.Footer style={{background:"#deb887"}}>
                  </Card.Footer>
                </Card>

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
                          <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text ms-2" id="">Show</span>
                    </div>
                    <select onClick={(e)=> {setShowOnly( e.target.value)}} className="form-control form-select" style={{maxWidth: '120px', marginLeft:'-5px'}}>
                      <option className="form-control rounded" selected>All</option>
                      <option className="form-control rounded">Kicked</option>
                      <option className="form-control rounded">Access</option>
                    </select>
                  </div>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text ms-2" id="">Sort By</span>
                    </div>
                    <select onClick={(e)=> {setSortBy( e.target.value)}} className="form-control form-select" style={{maxWidth: '120px', marginLeft:'-5px'}}>
                      <option className="form-control rounded" selected>Default</option>
                      <option className="form-control rounded">Name</option>
                      <option className="form-control rounded">Count</option>
                    </select>
                  </div>
                  <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text ms-2" id="">View</span>
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
                        {emp.owner} {(emp.inside)? <span className="badge bg-success">Access</span>:<span className="badge bg-danger">Kicked</span>}  {(loading)? <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>:<></>}
                        </Card.Header>
                        <Card.Body style={{background:"#FFF8E1"}}>
                        <ListGroup variant="flush" >
                          <ListGroupItem style={{background:"#FFF8E1"}}>Name: {emp.name}</ListGroupItem>
                          <ListGroupItem style={{background:"#FFF8E1"}}>Product Count: {emp.product_count}</ListGroupItem>
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
