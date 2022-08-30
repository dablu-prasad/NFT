// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/**
 * ERC721 interface contracts
 */
import "./ERC721.sol";
import "./IERC721URIStorage.sol";
import "./reentrancyGuard.sol";
import "./ERC2981.sol";
//import "./safeMath.sol";
import "./address.sol";
import "./counters.sol";

contract mainNFT is ERC721, ERC721URIStorage, ReentrancyGuard, ERC2981 {
    using SafeMath for uint256;
    using Address for address;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address owner;
    bool private paused = false;

    struct NFTDetails {
        string name;
        string description;
        address minter;
        address owner;
        uint256 tokenId;
        uint256 mintTime;
        string uri;
        uint256 tokenPrice;
    }
    NFTDetails nftDetails;
    //map NFT struct with tokenId
    mapping(uint256 => NFTDetails) public nftInfo;

    //list all minted NFTs. We can manage this array in server database to save storage on blockchain.
    NFTDetails[] public nftList;
    event Details(address, uint256, uint256, string);

    struct NFTBidding {
        uint256 startTime;
        uint256 endTime;
    }
    NFTBidding nftBidding;
    mapping(uint256 => NFTBidding) private nftBid;

    constructor() ERC721("Timeless Art Tokens", "TAT") {
        owner = _msgSender();
    }

    //////////////////////////// NFT image storage URI ////////////////////////////////////////////
    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }

    ///////////////////////////// declare required modifiers //////////////////////////////////////
    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_msgSender() == owner, "ERC721: sender is not authorized.");
        _;
    }

    /**
     * @dev throws if called by any account other than token owner
     */
    modifier tokenOwner(uint256 _tokenId) {
        require(
            _msgSender() == ownerOf(_tokenId),
            "ERC721: unauthorized sender."
        );
        _;
    }

    /**
     * @dev throws if trade is paused
     */
    modifier pause() {
        require(paused == false, "ERC721: NFT trade paused");
        _;
    }

    /////////////////////////////////// set approvals /////////////////////////////////////////////
    /**
     * @dev set approval for user to mint NFT
     */
    function allow(address _beneficiary) external onlyOwner returns (bool) {
        setApprovalForAll(_beneficiary, true);
        return true;
    }

    /////////////////////////////////// create new NFT ///////////////////////////////////////////
    /**
     * @dev create new NFT
     */
    function mintNFT(address _recipient,string memory _name, string memory _decription,uint256 _price, string memory _nftURI)
        external
        returns (uint256)
    {
        //generate NFT id
        _tokenIds.increment();
        uint256 newID = _tokenIds.current();

        //record timestamp
        uint256 mt = block.timestamp;

        //NFT mint function call
        _mint(_recipient, newID);
        //map NFT URI with NFT id
        _setTokenURI(newID, _nftURI);
        //record NFT details in array
        nftDetails = NFTDetails(_name,_decription,_recipient, _recipient, newID, mt, _nftURI, _price);
        nftList.push(nftDetails);
        //map NFT details with tokenID
        nftInfo[newID] = nftDetails;

        return newID;
    }

    //////////////////////////////////// delete existing NFT //////////////////////////////////////
    /**
     * @dev delete NFT using tokenId
     */
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function deleteNFT(uint256 _tokenId) external onlyOwner {
        _burn(_tokenId);
    }

    /////////////////////////////////// get minted NFTs ////////////////////////////////////////////
    /**
     * @dev read all minted NFTs
     */
    function getNFTs() external view returns (NFTDetails[] memory) {
        return nftList;
    }

    /////////////////////////////////// NFT trade functions ///////////////////////////////////////

    event nftPay(address, address, uint256, bool);
    mapping(uint256 => bool) pay;
    bool public started;
    bool public ended;
    uint256 public endAt;
    mapping(uint256 => uint256) public highestBid;
    mapping(uint256 => address) public highestBidder;

    mapping(address => uint256) public bids;

    struct BidderList {
        address payable bidder;
        uint256 bidAmount;
        uint256 tokenId;
    }
    BidderList bidderList;
    mapping(uint256 => BidderList[]) public bidders;
    event bid(address indexed, uint256);
    event refund(address indexed, uint256);

    /**
     * @dev stop NFT trade
     */
    function pauseTrade() external onlyOwner {
        paused = true;
    }

    /**
     * @dev start NFT trade
     */
    function unpauseTrade() external onlyOwner {
        paused = false;
    }

    /**
     * @dev transfer NFT using account address and tokenId
     */
    function transferNFT(
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _price
    ) external tokenOwner(_tokenId) pause {
        require(pay[_tokenId] != false, "ERC721: send AXIS to seller first");
        //transfer NFT
        safeTransferFrom(_from, _to, _tokenId);
        //authorize _to address as owner of NFT
        _approve(_to, _tokenId);
        //update NFT struct
        nftInfo[_tokenId].owner = _to;
        nftInfo[_tokenId].tokenPrice = _price;
        pay[_tokenId] = false;

        emit Transfer(_from, _to, _tokenId);
    }

    /**
     * @dev transfer payment to seller
     */
    function payment(address payable _to, uint256 _tokenId)
        external
        payable
        nonReentrant
        pause
    {
        require(msg.value != 0, "ERC721: sending 0 payment to seller");
        uint256 amount = msg.value;
        _to.transfer(amount);
        pay[_tokenId] = true;

        emit nftPay(_msgSender(), _to, msg.value, pay[_tokenId]);
    }

    /**
     * @dev start bidding period for NFT when minted
     */
    function startBidding(uint256 _tokenId, uint256 _value)
        external
        tokenOwner(_tokenId)
        pause
    {
        require(!started, "ERC721: bidding already started.");
        started = true;
        // endAt = block.timestamp + (1 days * 90);
        endAt = block.timestamp + 10 minutes;
        nftBid[_tokenId].startTime = block.timestamp;
        nftBid[_tokenId].endTime = endAt;
        highestBid[_tokenId] = _value;
        highestBidder[_tokenId] = payable(_msgSender());
    }

    /**
     * @dev update bidding end time
     */
    function updateEndTime(uint256 _tokenId, uint256 _time)
        external
        onlyOwner
        returns (bool)
    {
        nftBid[_tokenId].endTime += _time;
        return true;
    }

    /**
     * @dev place bid on NFT to purchase
     */
    function placeBid(uint256 _tokenId)
        external
        payable
        pause
        nonReentrant
        returns (bool)
    {
        //check conditions before bidding
        require(started, "ERC721: Bidding not started.");
        require(
            nftBid[_tokenId].endTime > block.timestamp,
            "ERC721: NFT auction is ended."
        );
        require(
            msg.value > highestBid[_tokenId],
            "ERC721: Increase bid amount."
        );

        //record bidding
        highestBid[_tokenId] = msg.value;
        highestBidder[_tokenId] = payable(_msgSender());

        //record list of bidders with bid
        bidderList = BidderList(
            payable(highestBidder[_tokenId]),
            highestBid[_tokenId],
            _tokenId
        );
        bidders[_tokenId].push(bidderList);
        bids[highestBidder[_tokenId]] = highestBid[_tokenId];
        emit bid(highestBidder[_tokenId], highestBid[_tokenId]);

        return true;
    }

    /**
     * @dev return bidding list
     */
    function listBidders(uint256 _tokenId)
        external
        view
        returns (BidderList[] memory list)
    {
        list = bidders[_tokenId];
        return list;
    }

    /**
     * @dev conclude NFT auction
     */
    function withdraw(uint256 _tokenId) external nonReentrant {
        uint256 bal = bids[_msgSender()];
        bids[_msgSender()] = 0;

        uint256 totalBidders = bidders[_tokenId].length;
        for (uint256 i = 0; i < totalBidders; i++) {
            if (msg.sender == bidders[_tokenId][i].bidder) {
                delete bidders[_tokenId][i];
            }
        }

        (bool sent, bytes memory _data) = payable(_msgSender()).call{
            value: bal
        }("");
        require(sent, "could not withdraw.");

        emit refund(_msgSender(), bal);
    }

    /**
     * @dev end NFT auction
     */
    function endBid(uint256 _tokenId) external returns (bool bidEnded) {
        uint256 endTime = nftBid[_tokenId].endTime;
        require(
            block.timestamp >= endTime && ownerOf(_tokenId) == msg.sender,
            "FORBIDDEN!"
        );
        highestBid[_tokenId] = 0;
        highestBidder[_tokenId] = 0x0000000000000000000000000000000000000000;
        uint256 totalBidders = bidders[_tokenId].length;
        for (uint256 i = 0; i < totalBidders; i++) {
            delete bidders[_tokenId][i];
        }
        bidEnded = true;
        return bidEnded;
    }

    ////////////////////////////////////// process NFT royalty ///////////////////////////////////////
    /**
     * @dev royalty info
     */
}

