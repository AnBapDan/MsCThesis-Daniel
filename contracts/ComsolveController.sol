// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract ComsolveController {
    struct Payment {
        uint quantity;
        address from;
        address to;
    }

    address public owner;
    mapping(address => bool) allowedDevices;
    mapping(uint => Payment) pendingApproval;
    uint[] pendingId;

    modifier ownerRestricted() {
        require(owner == msg.sender);
        _;
    }

    constructor() {
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
    }

    function issuePayment(address to, uint paymentId) external payable {
        require(allowedDevices[msg.sender], "Device is not allowed");
        require(msg.value > 0,"Payment quantity must be greater than 0");
        require(pendingApproval[paymentId].quantity == 0 && pendingApproval[paymentId].from == address(0),"Payment already set");
        pendingApproval[paymentId] = Payment({
            quantity: msg.value,
            from: msg.sender,
            to: to
        });

        pendingId.push(paymentId);
    }

    function retrievePendingIds() external ownerRestricted returns (uint[] memory) {
        uint[] memory tmp = pendingId;
        delete pendingId;
        return tmp;
    }

    function retrievePayments(uint index) external ownerRestricted view returns (Payment memory) {
        return pendingApproval[index];
    }

    function confirmPayment(uint[] calldata accepted,uint[] calldata denied) external ownerRestricted() {

        for (uint16 i = 0; i < accepted.length; i++) {
            uint paymentId = accepted[i];
            Payment storage acceptedPayment = pendingApproval[paymentId];

            if(acceptedPayment.quantity==0){
                continue;
            }
            // Perform internal state changes
            uint quantity = acceptedPayment.quantity;
            acceptedPayment.quantity = 0;

            // Interact with external contracts last
            address payable recipient = payable(acceptedPayment.to);
            (bool success, ) = recipient.call{value: quantity}("");
            require(success, "Payment failed");
            delete pendingApproval[paymentId];
        }


        for (uint16 i = 0; i < denied.length; i++) {
            uint paymentId = denied[i];
            Payment storage deniedPayment = pendingApproval[paymentId];
            if(deniedPayment.quantity==0){
                continue;
            }

            // Perform internal state changes
            uint quantity = deniedPayment.quantity;
            deniedPayment.quantity = 0;

            // Interact with external contracts last
            address payable recipient = payable(deniedPayment.from);
            (bool success, ) = recipient.call{value: quantity}("");
            require(success, "Refunds failed");
            delete pendingApproval[paymentId];
        }
    }
}