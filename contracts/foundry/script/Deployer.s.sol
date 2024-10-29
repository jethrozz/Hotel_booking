// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {HotelBooking} from "../src/Booking.sol";
import {HotelToken} from "../src/Token.sol";


contract DeployerScript is Script {
    function setUp() public {}

     function run() public returns(HotelBooking)  {
        vm.startBroadcast();
        HotelToken token = new HotelToken();
        HotelBooking hotelBooking = new HotelBooking(address(token));

        vm.stopBroadcast();
        return hotelBooking;
    }
}