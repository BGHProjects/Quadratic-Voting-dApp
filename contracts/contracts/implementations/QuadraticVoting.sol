// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IQuadraticVoting.sol";

contract QuadraticVoting is IQuadraticVoting {

    uint constant public voteCost = 10_000_000_000; // wei
    mapping(uint => Item) public items; // itemId to Item
    uint public itemCount = 0;

    function currentWeight(uint itemId, address addr, bool isPositive) public view returns(uint){
        if(isPositive){
            return items[itemId].positiveVotes[addr];
        } else {
            return items[itemId].negativeVotes[addr];
        }
    }

    function calcCost(uint currWeight, uint weight) public pure returns(uint){
        if(currWeight > weight){
            return weight * weight * voteCost; // cost is always quadratic
        } else if (currWeight < weight) {
            // This allows users to save on costs if they are increasing their vote
            // For example, if the current weight is 3, and they want to change it to 5,
            // this would cost 16x (5 * 5 - 3 * 3) instead of 25x the vote cost
            return (weight * weight - currWeight * currWeight) * voteCost;
        } else {
            return 0;
        }
    }

    function createItem(bytes32 title, string memory imageHash, string memory description) public {
        uint itemId = itemCount++;
        Item storage item = items[itemId];
        item.owner = payable(msg.sender);
        item.title = title;
        item.imageHash = imageHash;
        item.description = description;
        emit ItemCreated(itemId);
    }

    function positiveVote(uint itemId, uint weight) public payable {
        Item storage item = items[itemId];
        if(msg.sender == item.owner) revert CannotVoteOnYourOwnItem();

        uint currWeight = item.positiveVotes[msg.sender];
        if(currWeight == weight) return; // No need to process further if vote has not changed

        uint cost = calcCost(currWeight, weight);
        if(msg.value < cost) revert InsufficientValue();

        item.positiveVotes[msg.sender] = weight;
        item.totalPositiveWeight += weight - currWeight;

        // Weight cannot be both positive and negative simultaneously
        item.totalNegativeWeight -= item.negativeVotes[msg.sender];
        item.negativeVotes[msg.sender] = 0;

        item.amount += msg.value; // Reward creator of item for their contribution

        emit Voted(itemId, weight, true);
    }

    function negativeVote(uint itemId, uint weight) public payable {
        Item storage item = items[itemId];
        if(msg.sender == item.owner) revert CannotVoteOnYourOwnItem();

        uint currWeight = item.negativeVotes[msg.sender];
        if(currWeight == weight) return; // No need to process futher if the vote has not changed
        
        uint cost = calcCost(currWeight, weight);
        if(msg.value < cost) revert InsufficientValue();

        item.negativeVotes[msg.sender] = weight;
        item.totalNegativeWeight += weight - currWeight;

        // Weight cannot be both positive and negative simultaneously
        item.totalPositiveWeight -= item.positiveVotes[msg.sender];
        item.positiveVotes[msg.sender] = 0;

        // Distribute voting cost to every item except for this one
        uint reward = msg.value / itemCount;
        for(uint i = 0; i < itemCount;)
        {
            if (i != itemId) items[i].amount += reward;
            unchecked{
                ++i;
            }
        }

        emit Voted(itemId, weight, false);
    }

    function claim(uint itemId) public {
        Item storage item = items[itemId];
        if(msg.sender != item.owner) revert ItemNotOwned();
        item.owner.transfer(item.amount);
        item.amount = 0;
        emit ItemClaimed(itemId);
    }
}

