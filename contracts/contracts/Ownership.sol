// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract OwnerShip {

    uint256 nonce = 0;

    /* Interior functions */
    // Random Address generator
    function genRandAddr() private returns (address) {
        address _test = address(uint160(uint(keccak256(abi.encodePacked(nonce, blockhash(block.number))))));
        nonce++;
        return _test;
    }
    /* EOF */

    /* Company Stuff */

    struct Company {
        string name;
        address owner;
        uint256 emp_count;
        uint256 product_count;
        bool opened;
        address[] employee;
    }
    mapping(string => Company) public map_company;
    mapping(address => string) public map_getCompanyName;
    uint256 public noc = 0;

    // Create New Company  +company
    function newCompany(string calldata _name)  public returns (bool) {

        if(!map_company[_name].opened && !map_company[ map_getCompanyName[msg.sender]].opened){
            
            map_getCompanyName[msg.sender] = _name;
            address[] memory tmp;
            map_company[_name] = Company({name:_name, owner:msg.sender, emp_count: 0, product_count: 0, opened: true, employee:tmp });
            noc++;
            return true;
        }
        // revert(map_company[_name] == 0, "The Name already exiest");
        return false;
    }

    function getCompanyDetails() public view returns (Company memory){
        Company memory a = map_company[map_getCompanyName[msg.sender]];
        return a;
    }


    // add employee      +employee
    struct Employee {
        string name;
        address owner;
        address company;
        bool opened;
        bool inside;
        uint product_count;
        address[] products;
    }
    mapping(address => Employee) public map_employee;
    uint256 public noe = 0;
    // ERROR -> Adding duplicate employee
    function addEmployee(string memory _name , address _addr) public returns (bool){

        if(!map_employee[_addr].opened && map_company[map_getCompanyName[msg.sender]].opened && _addr != msg.sender){
            
            address[] memory tmp;
            map_employee[_addr] = Employee(_name, _addr,msg.sender,true,true, 0, tmp);
            map_company[map_getCompanyName[msg.sender]].employee.push(_addr);
            map_company[map_getCompanyName[msg.sender]].emp_count += 1;
            noe++;
            return true;
        }
        return false;
    }

    function getEmployeeDetails() public view returns (Employee[] memory){
        Employee[] memory tmp = new Employee[](map_company[map_getCompanyName[msg.sender]].emp_count);
        for(uint i = 0; i< map_company[map_getCompanyName[msg.sender]].emp_count;i++){
            tmp[i] = (map_employee[ map_company[map_getCompanyName[msg.sender]].employee[i] ]);
        }
        return tmp;
    }

    function getEmployeeDetail() public view returns (Employee memory){
        Employee memory e = map_employee[msg.sender];
        return e;
    }

    function taggleInside(address _addr) public {
        if(map_employee[_addr].opened && map_company[map_getCompanyName[msg.sender]].opened){
            if(map_employee[_addr].inside){
                map_employee[_addr].inside = false;
            }else{
                map_employee[_addr].inside = true;
            }
        }
    }
   
    
    // add new product        +product
    struct Product {
        address id;
        string uniqNumber;
        string name;
        string type_;
        uint256 noOFTimeSold;
        uint256 price;
        address owner;
        address creator;
        address requested;
        bool mintable;
        uint date;
    }
    mapping(address => Product) public map_products;
    mapping(address => address) public map_mintable;
    uint256 public nom = 0;
    uint256 public nop = 0;
    
    function newProduct(string memory _name,string memory _uniq,string memory _type, uint256 _price) public returns (bool){
        Employee memory emp = map_employee[msg.sender];
        if(emp.opened && emp.inside){
            address pid = genRandAddr();
            Product memory pdt = Product(pid, _uniq, _name, _type,0, _price, emp.owner,emp.owner, 0x0000000000000000000000000000000000000000,false, block.timestamp);
            map_products[pid] = pdt;
            emp.product_count += 1;
            map_employee[msg.sender].products.push(pid);
            map_employee[msg.sender].product_count += 1;
            map_company[map_getCompanyName[map_employee[msg.sender].company]].product_count += 1;
            nop++;
            return true;
        }
        return false;
    }

    function getProductDetails() public view returns (Product[] memory){
        Product[] memory tmp = new Product[](map_employee[msg.sender].product_count);
        for(uint256 i=0;i<map_employee[msg.sender].product_count;i++){
            tmp[i] = map_products[map_employee[msg.sender].products[i]];
        }
        return tmp;
    }
    function taggleMintable(address _addr) public {

        if(map_products[_addr].owner == msg.sender){
            address a = 0x0000000000000000000000000000000000000000;
            address b;
            if(map_products[_addr].mintable){
                do{
                    b = map_mintable[a];
                    if(b == _addr){
                        map_mintable[a] = map_mintable[b];
                        delete map_mintable[_addr];
                        break;
                    }
                    a = b;
                }while(a != 0x0000000000000000000000000000000000000000);

                map_products[_addr].mintable = false;
                nom--;
            }else{
                do{
                    if(map_mintable[a] == 0x0000000000000000000000000000000000000000){
                        break;
                    }
                    a = map_mintable[a];
                }while(a != 0x0000000000000000000000000000000000000000); 
                map_mintable[a] = _addr;
                map_products[_addr].mintable = true;
                nom++;
            }
        }
    }

    function transferOwner(address _addr) public {
        if(map_products[_addr].owner == msg.sender && map_products[_addr].mintable && map_products[_addr].requested != 0x0000000000000000000000000000000000000000){
            map_products[_addr].owner = map_products[_addr].requested;
            map_products[_addr].noOFTimeSold += 1;
            map_products[_addr].requested = 0x0000000000000000000000000000000000000000;
            address tmp = map_customer[map_products[_addr].owner].products[0x0000000000000000000000000000000000000000];
            do {
                if(tmp == 0x0000000000000000000000000000000000000000){
                    map_customer[map_products[_addr].owner].products[tmp] = _addr;
                    break;
                }
                tmp = map_customer[map_products[_addr].owner].products[tmp];
            }while(true);
            map_customer[map_products[_addr].owner].nop++;
        }
    }
    
    function clearRequest(address _addr)public{
        if(map_products[_addr].owner == msg.sender && map_products[_addr].requested != 0x0000000000000000000000000000000000000000){
            map_products[_addr].requested = 0x0000000000000000000000000000000000000000;
        }
    }
    
    /* Customer stuff */
    struct Customer {
        string name;
        bool opened;
        uint256 nop;
        mapping(address => address) products;
    }

    mapping(address => Customer) public map_customer;

    function createCustomer(string memory _name)public{
        if(!map_employee[msg.sender].opened && !map_company[map_getCompanyName[msg.sender]].opened && !map_customer[msg.sender].opened){
            map_customer[msg.sender].name = _name;
            map_customer[msg.sender].opened = true;
        }
    }

    function getAllMyproducts() public view returns(Product[] memory){
        Product[] memory tmp = new Product[](map_customer[msg.sender].nop);
        uint256 i;
        if(map_customer[msg.sender].opened){
            address a = 0x0000000000000000000000000000000000000000;
            do {
                a = map_customer[msg.sender].products[a];
                if(a != 0x0000000000000000000000000000000000000000){
                    tmp[i++] = map_products[a];
                }
            }while(a != 0x0000000000000000000000000000000000000000);
        }
        return tmp;
    }
    
    function getAllMintedProducts() public view returns(Product[] memory){
        Product[] memory tmp = new Product[](nom);
        uint256 i;
        if(map_employee[msg.sender].opened || map_company[map_getCompanyName[msg.sender]].opened || map_customer[msg.sender].opened){
            address a = 0x0000000000000000000000000000000000000000;
            do {
                a = map_mintable[a];
                if(a != 0x0000000000000000000000000000000000000000){
                    tmp[i++] = map_products[a];
                }
            }while(a != 0x0000000000000000000000000000000000000000);
        }
        return tmp;
    }

    function requestForTransfer(address _addr) public {
        if(map_customer[msg.sender].opened && map_products[_addr].mintable && map_products[_addr].requested == 0x0000000000000000000000000000000000000000 && msg.sender != map_products[_addr].owner){
            map_products[_addr].requested = msg.sender;
        }
    }

    function getCustomerDetail() public view returns(string memory, bool, uint256) {
        return (map_customer[msg.sender].name, map_customer[msg.sender].opened, map_customer[msg.sender].nop);
    }

}
