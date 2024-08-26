// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;
    uint256 public minBet;
    uint256 public maxBet;

    event CoinFlipped(address player, bool won, uint256 amount);

    constructor(uint256 _minBet, uint256 _maxBet) {
        owner = msg.sender;
        minBet = _minBet;
        maxBet = _maxBet;
    }

    function flip() public payable returns (bool) {
        require(msg.value >= minBet && msg.value <= maxBet, "Bet amount out of range");
        
        bool won = (random() % 2) == 0;
        
        if (won) {
            payable(msg.sender).transfer(msg.value * 2);
        }
        
        emit CoinFlipped(msg.sender, won, msg.value);
        
        return won;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)));
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    function setMinMaxBet(uint256 _minBet, uint256 _maxBet) public {
        require(msg.sender == owner, "Only owner can set bet limits");
        minBet = _minBet;
        maxBet = _maxBet;
    }
}