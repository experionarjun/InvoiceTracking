-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 21, 2017 at 04:32 PM
-- Server version: 5.5.53-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `person`
--

-- --------------------------------------------------------

--
-- Table structure for table `Invoice`
--

CREATE TABLE IF NOT EXISTS `Invoice` (
  `InvoiceID` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(30) DEFAULT NULL,
  `date_of_issue` date NOT NULL,
  `address` varchar(100) NOT NULL,
  `currency` char(4) NOT NULL,
  `dueDate` date NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'Pending',
  `total` float NOT NULL DEFAULT '0',
  `UID` int(11) NOT NULL,
  `CreatedBy` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`InvoiceID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=77 ;

--
-- Dumping data for table `Invoice`
--

INSERT INTO `Invoice` (`InvoiceID`, `invoice_no`, `date_of_issue`, `address`, `currency`, `dueDate`, `status`, `total`, `UID`, `CreatedBy`) VALUES
(41, 'INV/05/ZUWw', '2017-01-19', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'EUR', '2017-01-24', 'Pending', 46000, 2, 1),
(42, 'INV/88/GYXK', '2017-01-19', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'EUR', '2017-01-20', 'paid', 48400, 3, 1),
(43, 'INV/66/yilw', '2017-01-20', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'USD', '2017-01-22', 'Paid', 4000, 3, 1),
(45, 'INV/52/vThF', '2017-01-20', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'EUR', '2017-01-18', 'Pending', 40000, 3, 1),
(46, 'INV/49/DOj48', '2017-01-11', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'EUR', '2017-01-18', 'Paid', 462, 2, 1),
(48, 'INV/30/bYn78', '2017-01-20', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'USD', '2017-01-22', 'Pending', 440, 2, 1),
(49, 'INV/98/4M135', '2017-01-20', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'EUR', '2017-01-20', 'Pending', 400, 2, 1),
(50, 'INV/63/uMF60', '2017-01-20', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'EUR', '2017-01-26', 'Pending', 4000, 3, 4),
(52, 'INV/67/gUm21', '2017-01-20', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'INR', '2017-01-23', 'Paid', 4000, 2, 4),
(54, 'INV/57/BLP71', '2017-01-24', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'INR', '2017-01-27', 'Paid', 2100, 3, 1),
(55, 'INV/10/mgf07', '2017-01-25', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'INR', '2017-01-27', 'Pending', 7000, 2, 1),
(56, 'INV/30/sUc70', '2017-01-24', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'EUR', '2017-01-27', 'Paid', 2100, 2, 1),
(57, 'INV/60/lTs83', '2017-01-27', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'INR', '2017-01-29', 'Paid', 4000, 2, 1),
(59, 'INV/64/e3D00', '2017-01-26', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'INR', '2017-01-27', 'Pending', 2000, 2, 1),
(60, 'INV/66/BFx75', '2017-01-27', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'INR', '2017-01-29', 'Pending', 2000, 3, 1),
(61, 'INV/72/SW576', '2017-01-20', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'USD', '2017-01-30', 'Pending', 4000, 2, 1),
(62, 'INV/75/ka949', '2017-01-23', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'EUR', '2017-01-30', 'Pending', 1533, 3, 1),
(63, 'INV/58/NU770', '2017-01-30', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'EUR', '2017-02-07', 'Paid', 970, 2, 1),
(64, 'INV/67/HtZ23', '2017-01-30', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'USD', '2017-02-15', 'Paid', 40, 2, 1),
(65, '2017/01/703542', '2017-01-30', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'EUR', '2017-02-01', 'Pending', 600, 3, 1),
(69, '2017/02/699221', '2017-02-01', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'USD', '2017-02-16', 'Paid', 7080, 3, 1),
(70, '2017/02/801908', '2017-02-01', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'USD', '2017-02-16', 'Pending', 2178, 2, 1),
(71, '2017/02/740735', '2017-02-02', 'Puthuparambil,Mundakayam,Kerala,India,Zip code: 686582', 'USD', '2017-02-17', 'Pending', 700, 2, 1),
(72, '2017/02/322188', '2017-02-06', 'Harish House,Thrissur,Kerala,India,Zip code: 680121', 'EUR', '2017-02-21', 'Paid', 6660, 5, 1),
(73, '2017/02/476681', '2017-02-05', 'Harish House,Thrissur,Kerala,India,Zip code: 680121', 'INR', '2017-02-20', 'Pending', 2850, 5, 1),
(74, '2017/02/181016', '2017-02-05', 'Harish House,Thrissur,Kerala,India,Zip code: 680121', 'INR', '2017-02-20', 'Pending', 4620, 5, 1),
(75, '2017/02/056303', '2017-02-05', 'arya house,Trivandrum,kerala,India,Zip code: 695011', 'USD', '2017-02-20', 'Paid', 3600, 6, 1),
(76, '2017/02/734611', '2017-02-05', 'Sajith Nilayam,Kovalam,Kerala,India,Zip code: 695527', 'EUR', '2017-02-22', 'Pending', 2060, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `InvoiceList`
--

CREATE TABLE IF NOT EXISTS `InvoiceList` (
  `InvoiceListID` int(11) NOT NULL AUTO_INCREMENT,
  `invoiceID` int(11) NOT NULL,
  `item` varchar(20) NOT NULL,
  `desc` varchar(30) NOT NULL,
  `qty` float NOT NULL,
  `unitp` float NOT NULL,
  PRIMARY KEY (`InvoiceListID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=70 ;

--
-- Dumping data for table `InvoiceList`
--

INSERT INTO `InvoiceList` (`InvoiceListID`, `invoiceID`, `item`, `desc`, `qty`, `unitp`) VALUES
(15, 35, 'ITEM1', 'ITEM1 desc', 20, 230),
(16, 35, 'ITEM2', 'ITEM2 DESC', 3, 3000),
(17, 36, 'ITEM1', 'ITEM1 DESC', 1, 20),
(18, 36, 'ITEM2', 'ITEM2 Desc', 2, 30),
(19, 37, 'dsadsa', 'dsadsa', 20, 56),
(20, 37, 'dsadsa', 'dsadsa', 20, 56),
(21, 39, 'curTest', 'CurTest Desc', 2, 2000),
(22, 40, '1', 'Desc', 1, 10),
(23, 41, 'TEST', 'TEST', 20, 2300),
(24, 42, 'TEST', 'TESt', 22, 2200),
(25, 43, 'sda', 'dsa', 20, 200),
(26, 44, '200', '22', 12, 5),
(27, 45, 'das', 'dsa', 200, 200),
(28, 46, '1', '32', 21, 22),
(29, 47, 'dsa', 'sdad', 20, 3),
(30, 48, 'ds', 'dsa', 20, 22),
(31, 49, 'dsa', 'dsa', 20, 20),
(32, 52, 'das', 'das', 20, 200),
(33, 53, 'qq', 'ss', 2, 4),
(34, 53, '2', 'dsd', 22, 3),
(35, 54, 'enthellum', 'enthellum desc', 2, 300),
(36, 54, 'enthellum2 ', 'enthellum desc2', 3, 500),
(37, 55, 'enthelum', 'enthellum2', 20, 300),
(38, 55, 'qd', 'adas', 2, 500),
(39, 56, 'item1', 'item1 description', 2, 300),
(40, 56, 'item2', 'item2', 3, 500),
(41, 57, 'Item', 'Test', 20, 200),
(42, 58, 'ITEM', 'ITEM', 20, 2),
(43, 59, 'Item1', 'Item1', 10, 200),
(44, 60, 'sadf', 'dsa', 10, 200),
(45, 61, 'dass', 'dsadas', 20, 200),
(46, 62, 'da', 'wqwq', 5, 201),
(47, 62, 'd', 'sa', 8, 66),
(48, 63, 'ITEM1', 'Desc', 10, 65),
(49, 63, 'Item2', 'desc', 5, 64),
(50, 64, 'item', 'des', 2, 20),
(51, 65, 'dsa', 'sda', 20, 30),
(52, 66, 'qeqwe', 'dqda', 20, 22),
(53, 67, 'dfs', 'adf', 2, 22),
(54, 68, 'dsa', 'sda', 33, 33),
(55, 69, 'item1', 'desc', 20, 354),
(56, 70, 'sda', 'dsaa', 33, 66),
(57, 71, 'Powder', 'PONDS', 5, 70),
(58, 71, 'Putty', '2kg Aliya special', 1, 350),
(59, 72, 'Item1', 'Desc', 20, 333),
(60, 73, 'Item1', 'desc', 3, 350),
(61, 73, 'item2', 'desc', 3, 600),
(62, 74, 'item1', 'desc', 3, 300),
(63, 74, 'item2', 'desc', 4, 600),
(64, 74, 'item3', 'desc', 6, 220),
(65, 75, 'item1', 'desc', 3, 220),
(66, 75, 'item2', 'desc', 4, 600),
(67, 75, 'item3', 'desc', 9, 60),
(68, 76, 'item1', 'desc', 10, 200),
(69, 76, 'item2', 'desc', 2, 30);

-- --------------------------------------------------------

--
-- Table structure for table `Role`
--

CREATE TABLE IF NOT EXISTS `Role` (
  `RoleID` int(1) NOT NULL DEFAULT '2',
  `RoleType` varchar(5) NOT NULL DEFAULT 'User',
  PRIMARY KEY (`RoleID`),
  UNIQUE KEY `RoleID` (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Role`
--

INSERT INTO `Role` (`RoleID`, `RoleType`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `UID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` varchar(20) DEFAULT NULL,
  `password` varchar(32) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` varchar(80) NOT NULL,
  `city` varchar(30) NOT NULL,
  `state` varchar(30) NOT NULL,
  `zip` int(10) NOT NULL,
  `country` varchar(30) NOT NULL,
  `RoleID` int(1) NOT NULL DEFAULT '2',
  PRIMARY KEY (`UID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UID`, `UserID`, `password`, `email`, `address`, `city`, `state`, `zip`, `country`, `RoleID`) VALUES
(1, 'arjun', '021b6fbe140c8a21395de1c3fbd27856', 'arjun.sreedhar@experionglobal.com', '', '', '', 0, '', 1),
(2, 'aliya', '827ccb0eea8a706c4c34a16891f84e7b', 'aliya.azad@experionglobal.com', 'Puthuparambil', 'Mundakayam', 'Kerala', 686582, 'India', 2),
(3, 'sajith', 'cc6896d13649ecb838250295766dfe04', 'sajith.v@experionglobal.com', 'Sajith Nilayam', 'Kovalam', 'Kerala', 695527, 'India', 2),
(4, 'athira', 'c84258e9c39059a89ab77d846ddab909', 'athira.s@experionglobal.com', '', '', '', 0, '', 1),
(5, 'harish', '698c9634246010398e8c427bdd12d374', 'harish.jose@experionglobal.com', 'Harish House', 'Thrissur', 'Kerala', 680121, 'India', 2),
(6, 'arya', '5882985c8b1e2dce2763072d56a1d6e5', 'arya.vijayan@experionglobal.com', 'arya house', 'Trivandrum', 'kerala', 695011, 'India', 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
