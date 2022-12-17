// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IQuadraticVoting {

    //////////////
    // FUNCTIONS
    //////////////

    /// @dev Returns the current weight of the vote for the item, either for or against
    /// @param itemId The id of the item
    /// @param addr The user who is checking the weight of their vote
    /// @param isPositive Whether the function is checking for a positive or negative vote
    function currentWeight(uint itemId, address addr, bool isPositive) external returns (uint);

    /// @dev Calculates the cost of a given vote
    /// @param currWeight The current weight of the vote being checked
    /// @param weight The weight of the incoming vote
    function calcCost(uint currWeight, uint weight) external pure returns(uint);

    /// @dev Creates a new item to be voted on
    /// @param title The title of the new item
    /// @param imageHash The hash of the image associated with the new item
    /// @param description The description of the new item
    function createItem(bytes32 title, string memory imageHash, string memory description) external;

    /// @dev Submits a positive vote on an item
    /// @param itemId The id of the item being voted on
    /// @param weight The weight of the vote being made
    function positiveVote(uint itemId, uint weight) external payable;

    /// @dev Submits a negative vote on an item
    /// @param itemId The id of the item being voted on
    /// @param weight The weight of the vote begin made
    function negativeVote(uint itemId, uint weight) external payable;

    /// @dev Allows a user to claim the amount raised for their item
    /// @param itemId The id of the item begin claimed
    function claim(uint itemId) external;

    //////////////
    // STRUCTS
    //////////////

    /// @dev Hold the data for each item to be voted on
    /// @param owner The address that created the item
    /// @param amount How much the creator of the item will receive
    /// @param title The name of the item
    /// @param imageHash The hash of the image associated with item
    /// @param description A description of the created item
    /// @param positiveVotes The number of votes in favour of this item
    /// @param negativeVotes The number of votes against this item
    /// @param totalPositiveWeight The total positive weight of this item
    /// @param totalNegativeWeight The total negative weight of this item
    struct Item {
        address payable owner;
        uint amount;
        bytes32 title;
        string imageHash; // IPFS CID
        string description;
        mapping(address => uint) positiveVotes; // user to weight
        mapping(address => uint) negativeVotes;
        uint totalPositiveWeight;
        uint totalNegativeWeight;
    }

    //////////////
    // EVENTS
    //////////////

    /// @dev Emitted whenever an item is created
    /// @param itemId The id of the newly created item
    event ItemCreated(uint itemId);

    /// @dev Emitted whenever a vote has been made on an item
    /// @param itemId The id of the item voted on
    /// @param weight The weight of the given vote
    /// @param positive Whether or not the vote was for or against the item
    event Voted(uint itemId, uint weight, bool positive);

    /// @dev Emitted when the amount of an item has been claimed
    /// @param itemId The id of the item claimed
    event ItemClaimed(uint itemId);

    //////////////
    // ERRORS
    //////////////

    /// @dev The user attempted to vote on their own item
    error CannotVoteOnYourOwnItem();

    /// @dev The value submitted does not cover the cost of making the vote
    error InsufficientValue();

    /// @dev The user attempts to claim an item's amount that doesn't belong to them
    error ItemNotOwned();
}