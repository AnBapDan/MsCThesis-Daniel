// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract Events {
    event Tests(string message);
    address public owner;

    constructor() {
        //Conta do "servidor"
        owner = msg.sender;
        emit Tests("Smart contract was created successfully");
    }

    function r(string memory junk) external {

        emit Tests(junk);
    }


}