// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract DeviceConfirmTransaction{

    struct Payment {
        uint quantity;
        address from;
    }
    
    address public owner;
    mapping(address => bool) private allowedDevices;
    mapping(address => mapping(uint => Payment) payments) private pendingApproval;
    mapping(address => uint16[]) private pendingIds;
    mapping(address => uint) private payed;

    modifier ownerRestricted{
        require(owner == msg.sender);
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    //Device methods
    function insertDevices(address[] memory newDevices) external ownerRestricted {
        for (uint i = 0; i < newDevices.length; i++) {
            allowedDevices[newDevices[i]] = true;
        }
    }

    function insertDevice(address newDevice) external ownerRestricted {
        allowedDevices[newDevice] = true;
    }

    function removeDevice(address oldDevice) external ownerRestricted {
        delete allowedDevices[oldDevice];
        //allowedDevices[oldDevice] = false;
    }

    function issuePayment(address to, uint16 paymentId) external payable {
        //TODO check if already exists id
        require(pendingApproval[to][paymentId].quantity == 0);
        pendingApproval[to][paymentId] = Payment({
            quantity: msg.value,
            from: msg.sender
        });

        pendingIds[to].push(paymentId);

    }

    function retrievePendingIds() external view returns(uint16[] memory){
        return pendingIds[msg.sender];
    }

    function retrievePayments(uint index)external view returns(Payment memory){
        return pendingApproval[msg.sender][index];
    }

    function confirmPayment( uint16[] calldata accepted, uint16[] calldata denied) external {
        require(allowedDevices[msg.sender]);
        mapping(uint => Payment) storage walletPending = pendingApproval[msg.sender];

        for (uint16 i = 0; i < accepted.length; i++) 
        {
           Payment storage acceptedPayment = walletPending[accepted[i]] ;
           uint quantity = acceptedPayment.quantity;
           acceptedPayment.quantity = 0;
           payed[msg.sender] += quantity;
           delete walletPending[accepted[i]];
        }

        for (uint16 i = 0; i < denied.length; i++) 
        {
            Payment storage deniedPayment = walletPending[denied[i]] ;
            uint quantity = deniedPayment.quantity;
            deniedPayment.quantity = 0;
            payable(deniedPayment.from).transfer(quantity);
            delete walletPending[denied[i]];
        }

    }

    // fallback() external payable{

    // }
}