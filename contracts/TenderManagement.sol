// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TenderManagement {
    struct Bid {
        uint256 amount;
        uint256 bidDate;
        address vendorId;
    }

    struct Tender {
        string tenderId;
        string tenderName;
        string tenderType;
        uint256 bidSubmissionDeadline;
        uint256 contractSignDeadline;
        uint256 estimatedCost;
        string tenderDetails;
        bool isOpen;
        bool approved;
        address[] bidders;
    }

    mapping(string => Tender) public tenders;
    mapping(string => mapping(address => Bid)) public bids;
    uint256 public tenderCount;
    address public admin;
    string[] public tenderIds;

    event TenderCreated(string tenderId, string tenderName, string tenderType, bool isOpen);
    event TenderApproved(string tenderId, bool approved, bool isOpen, address vendorId);
    event BidSubmitted(string tenderId, address bidder, uint256 amount, uint256 bidDate, address vendorId);

    // Hardcoded admin address (replace with a valid address)
    address constant HARDCODED_ADMIN = 0xB5B9f8c4d80e63dBa1e91A1C3565fFBdc6de10EB;

    constructor() {
        require(HARDCODED_ADMIN != address(0), "Admin address cannot be zero address");
        admin = HARDCODED_ADMIN;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    function isAdmin(address user) external view returns (bool) {
    return user == admin;
    }


    function createTender(
        string calldata _tenderName,
        string calldata _tenderType,
        uint256 _bidSubmissionDeadline,
        uint256 _contractSignDeadline,
        uint256 _estimatedCost,
        string calldata _tenderDetails
    ) external onlyAdmin {
        require(_bidSubmissionDeadline < _contractSignDeadline, "Invalid deadlines");

        tenderCount++;
        string memory tenderId = string(abi.encodePacked("T", uintToString(tenderCount)));
        bool isOpen = block.timestamp < _bidSubmissionDeadline;

        tenders[tenderId] = Tender({
            tenderId: tenderId,
            tenderName: _tenderName,
            tenderType: _tenderType,
            bidSubmissionDeadline: _bidSubmissionDeadline,
            contractSignDeadline: _contractSignDeadline,
            estimatedCost: _estimatedCost,
            tenderDetails: _tenderDetails,
            isOpen: isOpen,
            approved: false,
            bidders: new address[](0)
        });

        tenderIds.push(tenderId);
        emit TenderCreated(tenderId, _tenderName, _tenderType, isOpen);
    }

    function getAllTenderDetails() external view returns (
        Tender[] memory
    ) {
        Tender[] memory allTenders = new Tender[](tenderIds.length);

        for (uint256 i = 0; i < tenderIds.length; i++) {
            allTenders[i] = tenders[tenderIds[i]];
        }

        return allTenders;
    }

    function getAllTenderStatus() external view returns (
        bool[] memory,
        bool[] memory
    ) {
        bool[] memory isOpens = new bool[](tenderCount);
        bool[] memory approved = new bool[](tenderCount);

        for (uint256 i = 0; i < tenderCount; i++) {
            Tender storage tender = tenders[tenderIds[i]];
            isOpens[i] = tender.isOpen;
            approved[i] = tender.approved;
        }

        return (isOpens, approved);
    }

    function submitBid(string calldata _tenderId, uint256 _amount, uint256 _currentDate, address _vendorId) external {
        Tender storage tender = tenders[_tenderId];
        require(bytes(tender.tenderId).length > 0, "Tender not found");
        require(tender.isOpen, "Tender is not open for bidding");
        require(!tender.approved, "Tender is already approved");
        require(bids[_tenderId][msg.sender].amount == 0, "Vendor has already submitted a bid");
        require(_currentDate <= tender.bidSubmissionDeadline, "Bid submission deadline has passed");

        bids[_tenderId][msg.sender] = Bid({
            amount: _amount,
            bidDate: _currentDate,
            vendorId: _vendorId
        });

        tender.bidders.push(msg.sender);

        emit BidSubmitted(_tenderId, msg.sender, _amount, _currentDate, _vendorId);
    }

    function isBidder(string calldata _tenderId, address _vendorAddress) external view returns (bool) {
        Tender storage tender = tenders[_tenderId];
        for (uint256 i = 0; i < tender.bidders.length; i++) {
            if (tender.bidders[i] == _vendorAddress) {
                return true;
            }
        }
        return false;
    }

    function uintToString(uint256 _i) public pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len = 0;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            bstr[--k] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

    function approveTender(string calldata _tenderId, address _vendorId) external onlyAdmin {
    Tender storage tender = tenders[_tenderId];
    require(bytes(tender.tenderId).length > 0, "Tender not found");
    require(!tender.approved, "Tender is already approved");
    require(bids[_tenderId][_vendorId].amount > 0, "Vendor has not submitted a bid");

    tender.approved = true;
    tender.isOpen = false;

    emit TenderApproved(_tenderId, true, false, _vendorId);
}
}