-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2024 at 07:36 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_trail`
--

CREATE TABLE `audit_trail` (
  `unique_number` int(11) NOT NULL,
  `user` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `timestamp` datetime NOT NULL,
  `request_data` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `audit_trail`
--

INSERT INTO `audit_trail` (`unique_number`, `user`, `action`, `timestamp`, `request_data`) VALUES
(47, 'admin warehouse', 'Login', '2024-05-08 14:41:08', 'User Data'),
(48, 'admin warehouse', 'Login', '2024-05-08 14:51:28', 'User Data'),
(49, 'admin warehouse', 'Login', '2024-05-08 14:54:42', 'User Data'),
(50, 'admin ppic', 'Login', '2024-05-08 15:00:10', 'User Data'),
(51, 'admin produksi', 'Login', '2024-05-08 15:01:32', 'User Data'),
(52, 'super admin', 'Login', '2024-05-08 15:04:57', 'User Data'),
(53, 'admin ppic', 'Login', '2024-05-08 15:09:31', 'User Data'),
(54, 'admin ppic', 'Login', '2024-05-10 11:06:33', 'User Data'),
(55, 'admin ppic', 'Login', '2024-05-10 11:06:33', 'User Data'),
(56, 'adminppic', 'Entry WO : 1314', '2024-05-10 11:08:37', 'Work Order'),
(57, 'adminppic', 'Send', '2024-05-10 11:16:14', 'Location updated from ppic department to warehouse department'),
(58, 'admin ppic', 'Login', '2024-05-10 12:40:16', 'User Data'),
(59, 'adminppic', 'Create User', '2024-05-10 13:01:37', 'User Data'),
(60, 'adminppic', 'Create User adminppic13', '2024-05-10 13:06:03', 'User Data'),
(61, 'adminppic', 'Create User', '2024-05-10 13:08:48', 'Create User adminppic13'),
(62, 'adminppic', 'Create User', '2024-05-10 13:08:54', 'Create User adminppic18'),
(63, 'dimax', 'Login', '2024-05-10 13:18:28', 'User Data'),
(64, 'dimax', 'Login', '2024-05-10 13:20:16', 'User Data'),
(65, 'dimax', 'Login', '2024-05-10 13:20:45', 'User Data'),
(66, 'super admin', 'Login', '2024-05-10 13:27:24', 'User Data'),
(67, 'super admin', 'Login', '2024-05-10 13:30:56', 'User Data'),
(68, 'superadmin', 'Logout', '2024-05-10 13:36:36', 'User Data'),
(69, 'super admin', 'Login', '2024-05-10 13:36:42', 'User Data'),
(70, 'superadmin', 'Logout', '2024-05-10 13:38:03', 'User Data'),
(71, 'super admin', 'Login', '2024-05-10 13:38:36', 'User Data'),
(72, 'superadmin', 'Logout', '2024-05-10 13:38:39', 'User Data'),
(73, 'super admin', 'Login', '2024-05-10 13:39:19', 'User Data'),
(74, 'superadmin', 'Logout', '2024-05-10 13:39:28', 'User Data'),
(75, 'super admin', 'Login', '2024-05-10 13:40:03', 'User Data'),
(76, 'superadmin', 'Logout', '2024-05-10 13:40:06', 'User Data'),
(77, 'super admin', 'Login', '2024-05-10 13:40:41', 'User Data'),
(78, 'superadmin', 'Logout', '2024-05-10 13:41:18', 'User Data'),
(79, 'DIMAZS', 'Login', '2024-05-10 13:41:22', 'User Data'),
(80, 'admin ppic', 'Login', '2024-05-13 07:17:31', 'User Data'),
(81, 'adminppic', 'Logout', '2024-05-13 07:18:28', 'User adminppic logout'),
(82, 'admin ppic', 'Login', '2024-05-13 07:30:50', 'User Data'),
(83, 'adminppic', 'Logout', '2024-05-13 07:31:17', 'User adminppic logout'),
(84, 'admin ppic', 'Login', '2024-05-13 07:47:12', 'User Data'),
(85, 'adminppic', 'Entry WO : 7198', '2024-05-13 07:47:54', 'Work Order'),
(86, 'adminppic', 'Send', '2024-05-13 07:47:59', 'Location updated from ppic department to warehouse department'),
(87, 'adminppic', 'Logout', '2024-05-13 07:48:02', 'User adminppic logout'),
(88, 'super admin', 'Login', '2024-05-13 07:48:09', 'User Data'),
(89, 'superadmin', 'Send', '2024-05-13 07:55:40', 'Location updated from warehouse department to warehouse_staging department'),
(90, 'superadmin', 'Send', '2024-05-13 07:55:43', 'Location updated from warehouse_staging department to penimbangan department'),
(91, 'superadmin', 'Send', '2024-05-13 07:55:46', 'Location updated from penimbangan department to tipping department'),
(92, 'superadmin', 'Send Button Clicked', '2024-05-13 07:55:49', 'Work order processing completed'),
(93, 'super admin', 'Login', '2024-05-13 08:51:37', 'User Data'),
(94, 'superadmin', 'Entry WO : 187', '2024-05-13 09:39:49', 'Work Order'),
(95, 'superadmin', 'Send', '2024-05-13 09:39:55', 'Location updated from ppic department to warehouse department'),
(96, 'superadmin', 'Send', '2024-05-13 09:39:57', 'Location updated from warehouse department to batching department'),
(97, 'super admin', 'Login', '2024-05-13 10:15:26', 'User Data'),
(98, 'superadmin', 'Logout', '2024-05-13 10:39:06', 'User superadmin logout');

-- --------------------------------------------------------

--
-- Table structure for table `completed_batch_data`
--

CREATE TABLE `completed_batch_data` (
  `unique_number` int(11) NOT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `wo_number` int(11) DEFAULT NULL,
  `batch_status` varchar(255) DEFAULT NULL,
  `batch_number` varchar(255) DEFAULT NULL,
  `item_code` varchar(255) DEFAULT NULL,
  `processing_department` varchar(255) DEFAULT NULL,
  `sub_department` varchar(255) DEFAULT NULL,
  `line_selection` varchar(255) DEFAULT NULL,
  `step_1` datetime DEFAULT NULL,
  `step_1_sender` varchar(255) DEFAULT NULL,
  `step_2` datetime DEFAULT NULL,
  `step_2_sender` varchar(255) DEFAULT NULL,
  `step_3` datetime DEFAULT NULL,
  `step_3_sender` varchar(255) DEFAULT NULL,
  `step_4` datetime DEFAULT NULL,
  `step_4_sender` varchar(255) DEFAULT NULL,
  `step_5` datetime DEFAULT NULL,
  `step_5_sender` varchar(255) DEFAULT NULL,
  `step_6` datetime DEFAULT NULL,
  `step_6_sender` varchar(255) NOT NULL,
  `completion_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `completed_batch_data`
--

INSERT INTO `completed_batch_data` (`unique_number`, `product_type`, `wo_number`, `batch_status`, `batch_number`, `item_code`, `processing_department`, `sub_department`, `line_selection`, `step_1`, `step_1_sender`, `step_2`, `step_2_sender`, `step_3`, `step_3_sender`, `step_4`, `step_4_sender`, `step_5`, `step_5_sender`, `step_6`, `step_6_sender`, `completion_time`) VALUES
(118, 'minor', 3424, NULL, '4', '4', 'produksi', 'tipping', NULL, '2024-05-06 15:03:01', 'superadmin', '2024-05-07 07:58:53', 'superadmin', '2024-05-07 07:58:55', 'superadmin', '2024-05-07 07:58:58', 'superadmin', '2024-05-07 07:59:00', 'superadmin', NULL, '', '2024-05-07 07:59:02'),
(122, 'minor', 434, NULL, '43', '43', 'produksi', 'tipping', NULL, '2024-05-06 15:45:55', NULL, '2024-05-07 07:59:14', 'superadmin', '2024-05-07 07:59:16', 'superadmin', '2024-05-07 07:59:18', 'superadmin', '2024-05-07 07:59:20', 'superadmin', NULL, '', '2024-05-07 07:59:23'),
(127, 'ruah', 223311, NULL, '2', '2', 'produksi', 'discharging', 'line_d', '2024-05-07 07:34:54', 'superadmin', '2024-05-07 07:34:58', 'superadmin', '2024-05-07 07:35:00', 'superadmin', '2024-05-07 07:35:02', 'superadmin', '2024-05-07 07:35:10', 'superadmin', NULL, '', '2024-05-07 07:55:46'),
(132, 'minor', 1897, NULL, '131', '4132', 'produksi', 'tipping', NULL, '2024-05-07 14:09:54', 'superadmin', '2024-05-07 14:10:02', 'superadmin', '2024-05-07 14:10:05', 'superadmin', '2024-05-07 14:10:11', 'superadmin', '2024-05-07 14:10:18', 'superadmin', NULL, '', '2024-05-07 14:10:22'),
(147, 'minor', 7198, NULL, 'amb', 'abn', 'produksi', 'tipping', NULL, '2024-05-12 07:47:54', 'adminppic', '2024-05-12 07:47:59', 'adminppic', '2024-05-12 07:55:40', 'superadmin', '2024-05-12 07:55:43', 'superadmin', '2024-05-12 07:55:46', 'superadmin', NULL, '', '2024-05-12 07:55:49');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `userType` varchar(255) NOT NULL,
  `resetToken` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `username`, `password`, `email`, `name`, `department`, `userType`, `resetToken`) VALUES
(19, 'matthew', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'christianmatthew2806@gmail.com', 'Matthew', 'warehouse', 'admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJjaHJpc3RpYW5tYXR0aGV3MjgwNkBnbWFpbC5jb20iLCJyZXNldFRva2VuIjoidHJ1ZSIsImV4cCI6MTcxMTUzMTcxOX0.OOorFmwjl3gnpfjvdN61Vm1ijt1lcsOs5GG-XP7b2bU'),
(20, 'dimas', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'dimaslaylaa@gmail.com', 'Dimas', 'warehouse', 'operator', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJkaW1hc2xheWxhYUBnbWFpbC5jb20iLCJyZXNldFRva2VuIjoidHJ1ZSIsImV4cCI6MTcxNTU3NTE2OH0.VxP3BloQuAGg4g8HBPdP-Baxf1SJ_0wqVSMCPHWP3x4'),
(21, 'mumek', 'RlTXk5csO2odSPsKtY2csN5Gw9M9YF+SIsKD36oS1CA=', 'mumek@gmail.com', 'mek', 'produksi', 'admin', NULL),
(23, 'ppic', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'ppic@ppic.com', 'ppic', 'ppic', 'admin', NULL),
(26, 'admin', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'admin@admin.com', 'admin', 'ppic', 'admin', NULL),
(27, 'operatorppic', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'operatorppic@operatorppic.com', 'operator ppic', 'ppic', 'operator', NULL),
(28, 'operatorwarehouse', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'operatorwarehouse@operatorwarehouse.com', 'operator warehouse', 'warehouse', 'operator', NULL),
(29, 'operatorproduksi', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'operatorproduksi@operatorproduksi.com', 'operator produksi', 'produksi', 'operator', NULL),
(31, 'adminproduksi', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'adminproduksi@adminproduksi.com', 'admin produksi', 'produksi', 'admin', NULL),
(32, 'adminwarehouse', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'adminwarehouse@adminwarehouse.com', 'admin warehouse', 'warehouse', 'admin', NULL),
(33, 'adminppic', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'adminppic@adminppic.com', 'admin ppic', 'ppic', 'admin', NULL),
(34, 'ferdinan', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'fer@fer.com', 'koh fer', 'ppic', 'operator', NULL),
(35, 'dino', 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=', 'd@gmail.com', 'DINO', 'DEPT1', 'Type', NULL),
(36, 'SADMIN', 'password', 'rayhanaldinovandi1327@gmail.com', 'superadmin', 'superadmin', 'super admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJyYXloYW5hbGRpbm92YW5kaTEzMjdAZ21haWwuY29tIiwicmVzZXRUb2tlbiI6InRydWUiLCJleHAiOjE3MTU1NjM5MDB9.PfXHrIZca5-y-inOeoK6UPOp6l4XUTeZFcUbEW_baTk'),
(37, 'superadmin', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'superadmin@super.com', 'super admin', 'super admin', 'super admin', NULL),
(38, 'adminppic5', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'adminppic@gmail.com', 'DIMAZS', 'ppic', 'admin', NULL),
(39, 'adminppic9', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'rayhan@gmail.com', 'AdminParkiran', 'ppic', 'admin', NULL),
(40, 'adminppic90', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'admin90@gmail.com', 'dimax', 'ppic', 'admin', NULL),
(41, 'adminppic13', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'ppic@gmail.com', 'Dino', 'ppic', 'admin', NULL),
(42, 'adminppic18', 'pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=', 'atmin@gmail.com', 'ATMINgrup', 'ppic', 'admin', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `production_data`
--

CREATE TABLE `production_data` (
  `unique_number` int(11) NOT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `wo_number` int(11) DEFAULT NULL,
  `batch_status` varchar(255) DEFAULT NULL,
  `batch_number` varchar(255) DEFAULT NULL,
  `item_code` varchar(255) DEFAULT NULL,
  `processing_department` varchar(255) DEFAULT NULL,
  `sub_department` varchar(255) DEFAULT NULL,
  `line_selection` varchar(255) DEFAULT NULL,
  `step_1` datetime DEFAULT NULL,
  `step_1_sender` varchar(255) DEFAULT NULL,
  `step_2` datetime DEFAULT NULL,
  `step_2_sender` varchar(255) DEFAULT NULL,
  `step_3` datetime DEFAULT NULL,
  `step_3_sender` varchar(255) DEFAULT NULL,
  `step_4` datetime DEFAULT NULL,
  `step_4_sender` varchar(255) DEFAULT NULL,
  `step_5` datetime DEFAULT NULL,
  `step_5_sender` varchar(255) DEFAULT NULL,
  `step_6` datetime DEFAULT NULL,
  `step_6_sender` varchar(255) DEFAULT NULL,
  `completion_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `production_data`
--

INSERT INTO `production_data` (`unique_number`, `product_type`, `wo_number`, `batch_status`, `batch_number`, `item_code`, `processing_department`, `sub_department`, `line_selection`, `step_1`, `step_1_sender`, `step_2`, `step_2_sender`, `step_3`, `step_3_sender`, `step_4`, `step_4_sender`, `step_5`, `step_5_sender`, `step_6`, `step_6_sender`, `completion_time`) VALUES
(121, 'ruah', 56565, NULL, '56', '56', 'produksi', 'discharging', NULL, '2024-05-06 15:44:01', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, '2024-05-06 15:46:19', NULL, NULL, NULL, NULL),
(123, 'ruah', 777, NULL, '7', '7', 'produksi', 'discharging', 'line_r', '2024-05-06 15:46:04', NULL, '2024-05-06 15:46:08', NULL, '2024-05-06 15:46:10', NULL, '2024-05-06 15:46:14', NULL, '2024-05-06 15:46:33', NULL, NULL, NULL, NULL),
(130, 'ruah', 79, NULL, 'ljhi', 'gh', 'produksi', 'discharging', 'line_g', '2024-05-07 13:57:59', 'adminproduksi', '2024-05-07 13:58:19', 'adminppic', '2024-05-07 13:58:31', 'adminwarehouse', '2024-05-07 13:58:46', 'adminproduksi', '2024-05-07 14:34:49', 'superadmin', NULL, NULL, NULL),
(131, 'kemas', 785, NULL, '768', '8688', 'produksi', 'staging', NULL, '2024-05-07 14:07:05', 'superadmin', '2024-05-07 14:07:19', 'superadmin', '2024-05-07 14:07:22', 'superadmin', '2024-05-07 14:07:25', 'superadmin', NULL, NULL, NULL, NULL, NULL),
(148, 'ruah', 187, NULL, 'NBANVGN', 'NBJH', 'produksi', 'batching', NULL, '2024-05-13 09:39:49', 'superadmin', '2024-05-13 09:39:55', 'superadmin', '2024-05-13 09:39:57', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `test_batch_data`
--

CREATE TABLE `test_batch_data` (
  `unique_number` int(11) NOT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `wo_number` int(11) DEFAULT NULL,
  `batch_status` varchar(255) DEFAULT NULL,
  `batch_number` varchar(255) DEFAULT NULL,
  `item_code` varchar(255) DEFAULT NULL,
  `processing_department` varchar(255) DEFAULT NULL,
  `sub_department` varchar(255) DEFAULT NULL,
  `line_selection` varchar(255) DEFAULT NULL,
  `step_1` datetime DEFAULT NULL,
  `step_1_sender` varchar(255) DEFAULT NULL,
  `step_2` datetime DEFAULT NULL,
  `step_2_sender` varchar(255) DEFAULT NULL,
  `step_3` datetime DEFAULT NULL,
  `step_3_sender` varchar(255) DEFAULT NULL,
  `step_4` datetime DEFAULT NULL,
  `step_4_sender` varchar(255) DEFAULT NULL,
  `step_5` datetime DEFAULT NULL,
  `step_5_sender` varchar(255) DEFAULT NULL,
  `step_6` datetime DEFAULT NULL,
  `step_6_sender` varchar(255) DEFAULT NULL,
  `completion_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `test_batch_data`
--

INSERT INTO `test_batch_data` (`unique_number`, `product_type`, `wo_number`, `batch_status`, `batch_number`, `item_code`, `processing_department`, `sub_department`, `line_selection`, `step_1`, `step_1_sender`, `step_2`, `step_2_sender`, `step_3`, `step_3_sender`, `step_4`, `step_4_sender`, `step_5`, `step_5_sender`, `step_6`, `step_6_sender`, `completion_time`) VALUES
(119, 'ruah', 41343, NULL, '4', '4', 'produksi', 'discharging', NULL, '2024-05-06 15:27:55', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(120, 'ruah', 342422, NULL, '5', '5', 'produksi', 'discharging', 'line_b', '2024-05-06 15:34:50', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(124, 'ruah', 43421, NULL, '1', '1', 'produksi', 'discharging', NULL, '2024-05-07 07:16:48', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(125, 'ruah', 3221, NULL, '2', '2', 'produksi', 'discharging', NULL, '2024-05-07 07:29:55', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(126, 'ruah', 2313, NULL, '23231', '3213', 'produksi', 'discharging', NULL, '2024-05-07 07:31:07', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(128, 'minor', 21323, NULL, '2', '2', 'produksi', 'tipping', NULL, '2024-05-07 09:18:39', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(129, 'ruah', 3122, NULL, '2', '2', 'produksi', 'discharging', NULL, '2024-05-07 09:19:07', 'superadmin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `warehouse_data`
--

CREATE TABLE `warehouse_data` (
  `unique_number` int(11) NOT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `wo_number` int(11) DEFAULT NULL,
  `batch_status` varchar(255) DEFAULT NULL,
  `batch_number` varchar(255) DEFAULT NULL,
  `item_code` varchar(255) DEFAULT NULL,
  `processing_department` varchar(255) DEFAULT NULL,
  `sub_department` varchar(255) DEFAULT NULL,
  `line_selection` varchar(255) DEFAULT NULL,
  `step_1` datetime DEFAULT NULL,
  `step_1_sender` varchar(255) DEFAULT NULL,
  `step_2` datetime DEFAULT NULL,
  `step_2_sender` varchar(255) DEFAULT NULL,
  `step_3` datetime DEFAULT NULL,
  `step_3_sender` varchar(255) DEFAULT NULL,
  `step_4` datetime DEFAULT NULL,
  `step_4_sender` varchar(255) DEFAULT NULL,
  `step_5` datetime DEFAULT NULL,
  `step_5_sender` varchar(255) DEFAULT NULL,
  `step_6` datetime DEFAULT NULL,
  `step_6_sender` varchar(255) DEFAULT NULL,
  `completion_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `warehouse_data`
--

INSERT INTO `warehouse_data` (`unique_number`, `product_type`, `wo_number`, `batch_status`, `batch_number`, `item_code`, `processing_department`, `sub_department`, `line_selection`, `step_1`, `step_1_sender`, `step_2`, `step_2_sender`, `step_3`, `step_3_sender`, `step_4`, `step_4_sender`, `step_5`, `step_5_sender`, `step_6`, `step_6_sender`, `completion_time`) VALUES
(116, 'minor', 2113, NULL, '2', '2', 'produksi', 'tipping', NULL, '2024-05-06 14:25:11', 'adminproduksi', '2024-05-06 14:28:05', 'superadmin', '2024-05-06 14:30:55', 'superadmin', '2024-05-07 07:16:09', 'superadmin', '2024-05-07 07:16:16', 'superadmin', NULL, '', NULL),
(117, 'ruah', 3123, NULL, '23123', '13213', 'produksi', 'discharging', 'line_a', '2024-05-06 14:31:36', 'superadmin', '2024-05-06 14:31:43', 'superadmin', '2024-05-06 15:10:13', 'superadmin', '2024-05-06 15:10:15', 'superadmin', '2024-05-06 15:24:14', 'superadmin', NULL, '', NULL),
(146, 'minor', 1314, NULL, 'NBAHB', 'AMNBD', 'warehouse', 'warehouse', NULL, '2024-05-10 11:08:37', 'adminppic', '2024-05-10 11:16:14', 'adminppic', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD PRIMARY KEY (`unique_number`);

--
-- Indexes for table `completed_batch_data`
--
ALTER TABLE `completed_batch_data`
  ADD PRIMARY KEY (`unique_number`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Username` (`username`);

--
-- Indexes for table `production_data`
--
ALTER TABLE `production_data`
  ADD PRIMARY KEY (`unique_number`);

--
-- Indexes for table `test_batch_data`
--
ALTER TABLE `test_batch_data`
  ADD PRIMARY KEY (`unique_number`);

--
-- Indexes for table `warehouse_data`
--
ALTER TABLE `warehouse_data`
  ADD PRIMARY KEY (`unique_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_trail`
--
ALTER TABLE `audit_trail`
  MODIFY `unique_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `completed_batch_data`
--
ALTER TABLE `completed_batch_data`
  MODIFY `unique_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `production_data`
--
ALTER TABLE `production_data`
  MODIFY `unique_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `test_batch_data`
--
ALTER TABLE `test_batch_data`
  MODIFY `unique_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `warehouse_data`
--
ALTER TABLE `warehouse_data`
  MODIFY `unique_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
