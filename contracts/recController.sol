// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract ComsolveController {
    struct Payment {
        uint quantity;
        address from;
        address to;
    }

    address public owner;
    error UnauthorizedAccess(address issuer);

    mapping(uint => Payment) pendingApproval;
    uint[] pendingId;
    mapping(address => uint) payed;
    mapping(address => bool) allowedDevices;
    bool private isRetrievingPending = false;
    bool private isPendingLocked = false;

    constructor() {
        //Conta do "servidor"
        owner = msg.sender;
    }

    //Device methods
    function insertDevices(address[] memory newDevices) external ownerRestricted {
        for (uint i = 0; i < newDevices.length; i++) {
            allowedDevices[newDevices[i]] = true;
        }
    }

    function insertDevice(address newDevice) external ownerRestricted {
        //allowedDevices.push(newDevice);
        allowedDevices[newDevice] = true;
    }

    function removeDevice(address oldDevice) external ownerRestricted {
        allowedDevices[oldDevice] = false;
    }

    function issuePayment(address to, uint16 paymentId) external payable {
        require(allowedDevices[to] && msg.value != 0);
        require(
            !isRetrievingPending,
            "Cannot issue payment while a retrieval is in progress"
        );
        require(!isPendingLocked, "Pending is currently locked");

        isPendingLocked = true;

        pendingApproval[paymentId] = Payment({
            quantity: msg.value,
            from: msg.sender,
            to: to
        });
        pendingId.push(paymentId);

        isPendingLocked = false;
    }

    function retrievePending() external ownerRestricted returns (uint[] memory){
        require(
            !isRetrievingPending,
            "Cannot retrieve pending while another retrieval is in progress"
        );

        isRetrievingPending = true;
        isPendingLocked = true;

        uint[] memory tmp = pendingId;
        delete pendingId;

        isPendingLocked = false;
        isRetrievingPending = false;

        return tmp;
    }

    function confirmPayment( uint16[] calldata accepted, uint16[] calldata denied) external ownerRestricted {
        for (uint16 i; i < accepted.length; i++) {
            Payment memory confirm = pendingApproval[accepted[i]];
            uint quantity = confirm.quantity;
            delete pendingApproval[accepted[i]];
            payed[confirm.to] += quantity;
        }

        for (uint16 i; i < denied.length; i++) {
            Payment memory refunding = pendingApproval[denied[i]];
            uint quantity = refunding.quantity;
            delete pendingApproval[denied[i]];
            payable(refunding.from).transfer(quantity);
        }
    }

    function withdrawFunds() external deviceRestriced {
        uint quantity = payed[msg.sender];
        delete payed[msg.sender];
        payable(msg.sender).transfer(quantity);
    }

    modifier deviceRestriced{
        require(allowedDevices[msg.sender]);
        _;
    }

    modifier ownerRestricted() {
        if (msg.sender != owner) {
            revert UnauthorizedAccess({issuer: msg.sender});
        }
        _;
    }
}