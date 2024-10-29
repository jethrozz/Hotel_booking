// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract HotelBooking {
    //酒店管理员
    address public owner;
    //酒店代币
    IERC20 public token;
    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }
    // 房间类型
    enum RoomCategory {
        Presidential,
        Deluxe,
        Suite
    }

    // 房间
    struct Room {
        uint256 id;
        RoomCategory category;
        uint256 pricePerNight;
        bool isAvailable;
        //该房间的评论  
        Review[] reviews;
        //该房间的订单
        BookingOrder[] bookings;
        //该房间的图片
        string[] images;
    }
    // 订单
    struct BookingOrder{
        address guest;
        uint256 roomId;
        uint256 checkInDate;
        uint256 checkOutDate;
    }
    // 评论
    struct Review {
        address guest;
        uint8 rating;
        string comment;
    }

    // 房间数量 
    uint256 public roomCount;

    // 房间id到房间的映射
    mapping(uint256 => Room) public rooms;  
    // 订单id到订单的映射
    mapping(uint256 => BookingOrder) public roomBookings;
    mapping(address => BookingOrder[]) public guestOrders;
    // 事件
    event RoomAdded(uint256 roomId, string category, uint256 pricePerNight);
    event RoomBooked(uint256 roomId, address guest, uint256 checkInDate, uint256 checkOutDate);
    event ReviewAdded(uint256 roomId, address guest, uint8 rating, string comment);
    event RoomAvailabilityChanged(uint256 roomId, bool isAvailable);
    event TokensWithdrawn(address indexed owner, uint256 amount);
    //error 定义
    error OnlyOwnerAllowed();
    error RoomNotExist();
    error RoomNotAvailable(string category);
    error RoomIdNotAvailable(uint256 roomId);
    error ValidRating(uint8 rating);
    error InvalidBookingDate(uint256 checkInDate, uint256 checkOutDate);
    error BalanceNotEnough(address guest, uint256 totalPrice);
    error GuestNotHaveOrder();

    //只允许管理员操作
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwnerAllowed();
        }
        _;
    }

    modifier validRating(uint8 _rating) {
        if (_rating < 1 || _rating > 5) {
            revert ValidRating(_rating);
        }
        _;
    }

    modifier roomExists(uint256 _roomId) {
        if(_roomId < roomCount) {
            revert RoomNotExist();
        }
        _;
    }

    modifier checkGuestOrder(){
        BookingOrder[] memory userOrders = guestOrders[msg.sender];
       if(userOrders.length == 0){
            revert GuestNotHaveOrder();
       }
       _;
    }

    //添加房间
    function addRoom(RoomCategory _category, uint256 _pricePerNight, string[] memory _images) public onlyOwner {
        uint256 roomId = roomCount++;
        Room storage room = rooms[roomId];
        room.id = roomId;
        room.category = _category;
        room.pricePerNight = _pricePerNight;
        room.isAvailable = true;
        room.images = _images;
        emit RoomAdded(roomCount, getCategoryString(_category), _pricePerNight);
    }
    //预定房间 按类别
    function bookRoomByCategory(RoomCategory category, uint256 checkInDate, uint256 checkOutDate) public {
        if(checkInDate >= checkOutDate) {
            revert InvalidBookingDate(checkInDate, checkOutDate);
        }
        uint256 roomId = findRoomByCategory(category);
        if(roomId == type(uint256).max) {
            revert RoomNotAvailable(getCategoryString(category));
        }
        bookRoomById(roomId, checkInDate, checkOutDate);
    }

    function bookRoomById(uint256 roomId, uint256 checkInDate, uint256 checkOutDate) public roomExists(roomId) {
        if(!rooms[roomId].isAvailable){
            revert RoomIdNotAvailable(roomId);
        }
        uint256 totalPrice = (checkOutDate - checkInDate) * rooms[roomId].pricePerNight;
        if(token.balanceOf(msg.sender) < totalPrice) {
            revert BalanceNotEnough(msg.sender, totalPrice);
        }
        // 从客人账户中扣除相应金额
        require(token.transferFrom(msg.sender, address(this), totalPrice), "Token transfer failed");
        roomBookings[roomId] = BookingOrder({
            guest: msg.sender,
            roomId: roomId,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate
        });
        rooms[roomId].isAvailable = false;
        emit RoomBooked(roomId, msg.sender, checkInDate, checkOutDate);
    }

    // 管理可用性
    function setRoomAvailability(uint256 _roomId, bool _isAvailable) public onlyOwner roomExists(_roomId) {
        Room storage room = rooms[_roomId];
        room.isAvailable = _isAvailable;
        emit RoomAvailabilityChanged(_roomId, _isAvailable);
    }

    //客人评论
    function addReview(uint256 roomId, uint8 rating, string memory comment) public checkGuestOrder roomExists(roomId) validRating(rating){
        rooms[roomId].reviews.push(Review({
            guest: msg.sender,
            rating: rating,
            comment: comment
        }));
        emit ReviewAdded(roomId, msg.sender, rating, comment);
    }

    //管理员提取资金
    function withdrawTokens(uint256 amount) public onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance in contract");
        require(token.transfer(owner, amount), "Token transfer failed");
        emit TokensWithdrawn(owner, amount);
    }

    //查看房间详情
    function getRoomDetail(uint256 _roomId) public view roomExists(_roomId) returns(
        string memory category, uint256 pricePerNight, bool isAvailable, Review[] memory reviews
    ){
        Room memory room = rooms[_roomId];
        return (getCategoryString(room.category), room.pricePerNight, room.isAvailable, room.reviews);
    }

    //h获取订单详情
    function getBookingDetails(uint256 _roomId) public view roomExists(_roomId) returns (
        address guest, uint256 checkInDate, uint256 checkOutDate, string memory category
    ) {
        BookingOrder memory booking = roomBookings[_roomId];
        Room memory room = rooms[_roomId];
        return (booking.guest, booking.checkInDate, booking.checkOutDate, getCategoryString(room.category));
    }


    function getAllRooms() public view returns (Room[] memory) {
        Room[] memory allRooms = new Room[](roomCount);
        for (uint256 i = 0; i < roomCount; i++) {
            allRooms[i] = rooms[i];
        }
        return allRooms;
    }

    function getOwner() public view returns (address) {
        return owner;
    }


    //根据类型返回对应的string
    function getCategoryString(RoomCategory category) internal pure returns (string memory) {
        if (category == RoomCategory.Presidential) {
            return "Presidential";
        } else if (category == RoomCategory.Deluxe) {
            return "Deluxe";
        } else if (category == RoomCategory.Suite) {
            return "Suite";
        }
        return "";
    }


    //根据类型找到房间
    function findRoomByCategory(RoomCategory category) internal view returns (uint256) {
        for (uint256 i = 0; i < roomCount; i++) {
            if (rooms[i].category == category) {
                return rooms[i].id;
            }
        }
        return type(uint256).max; // Return a max value to indicate no available room
    }
}