// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract DeviceConfirmTransaction {
    struct Payment {
        uint quantity;
        address from;
    }

    address public owner;
    mapping(address => bool) private allowedDevices;
    mapping(address => mapping(uint => Payment) payments)
        private pendingApproval;
    mapping(address => uint[]) private pendingIds;

    modifier ownerRestricted() {
        require(owner == msg.sender);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    //Device methods
    function insertDevices(
        address[] memory newDevices
    ) external ownerRestricted {
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

    function issuePayment(address to, uint paymentId) external payable {
        require(allowedDevices[msg.sender], "Device is not allowed");
        require(
                msg.value > 0,
                "Payment quantity must be greater than 0"
            );
        require(
            pendingApproval[to][paymentId].quantity == 0 &&
                pendingApproval[to][paymentId].from == address(0),
            "Payment already set"
        );
        pendingApproval[to][paymentId] = Payment({
            quantity: msg.value,
            from: msg.sender
        });

        pendingIds[to].push(paymentId);
    }

    function retrievePendingIds() external returns (uint[] memory) {
        uint[] memory tmp = pendingIds[msg.sender];
        delete pendingIds[msg.sender];
        return tmp;
    }

    function retrievePayments(
        uint index
    ) external view returns (Payment memory) {
        return pendingApproval[msg.sender][index];
    }

    function confirmPayment(
        uint[] calldata accepted,
        uint[] calldata denied
    ) external {

        require(allowedDevices[msg.sender], "Device is not allowed");
        mapping(uint => Payment) storage walletPending = pendingApproval[msg.sender];
        uint income = 0;
        for (uint16 i = 0; i < accepted.length; i++) {
            uint paymentId = accepted[i];
            Payment storage acceptedPayment = walletPending[paymentId];

            // Perform internal state changes
            income += acceptedPayment.quantity;
            acceptedPayment.quantity = 0;
            delete walletPending[paymentId];

        }
        // Interact with external contracts last
        address payable caller = payable(msg.sender);
        (bool paid, ) = caller.call{value: income}("");
        require(paid, "Payment Transfer failed");
        income = 0;    

        for (uint16 i = 0; i < denied.length; i++) {
            uint paymentId = denied[i];
            Payment storage deniedPayment = walletPending[paymentId];
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
            delete walletPending[paymentId];
        }
    }

    // fallback() external payable{

    // }
}
