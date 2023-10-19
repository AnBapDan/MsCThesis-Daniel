// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract test {
    //============================================ 
    // GETTING HBAR TO THE CONTRACT
    //============================================ 
    receive() external payable {}

    fallback() external payable {}

    function transferHbar(address payable _receiverAddress, uint _amount) public {
        _receiverAddress.transfer(_amount);
    }

    function transferHbar( uint _amount) public {
        payable(msg.sender).transfer(_amount);
    }

    function sendHbar(address payable _receiverAddress, uint _amount) public {
        require(_receiverAddress.send(_amount), "Failed to send Hbar");
    }

        function sendHbar(uint _amount) public {
        require(payable(msg.sender).send(_amount), "Failed to send Hbar");
    }

    function callHbar(address payable _receiverAddress, uint _amount) public {
        (bool sent, ) = _receiverAddress.call{value:_amount}("");
        require(sent, "Failed to send Hbar");
    }

    function callHbar(uint _amount) public {
        (bool sent, ) = payable(msg.sender).call{value:_amount}("");
        require(sent, "Failed to send Hbar");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}