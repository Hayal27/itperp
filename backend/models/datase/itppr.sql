-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 12, 2025 at 08:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `itperp3`
--

-- --------------------------------------------------------

--
-- Table structure for table `approvalhierarchy`
--

CREATE TABLE `approvalhierarchy` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `next_role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `approvalworkflow`
--

CREATE TABLE `approvalworkflow` (
  `approvalworkflow_id` int(11) NOT NULL,
  `plan_id` int(11) DEFAULT NULL,
  `approver_id` int(11) DEFAULT NULL,
  `status` enum('Pending','Approved','Declined') DEFAULT 'Pending',
  `comment` text DEFAULT NULL,
  `approval_date` datetime DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `report_id` int(11) DEFAULT NULL,
  `report_status` enum('Pending','Approved','Declined') DEFAULT 'Pending',
  `rating` decimal(5,2) DEFAULT NULL,
  `comment_writer` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `approvalworkflow`
--

INSERT INTO `approvalworkflow` (`approvalworkflow_id`, `plan_id`, `approver_id`, `status`, `comment`, `approval_date`, `approved_at`, `report_id`, `report_status`, `rating`, `comment_writer`) VALUES
(216, 129, 106, 'Approved', '', '2025-04-11 05:56:02', NULL, NULL, 'Pending', NULL, ''),
(217, 130, 106, 'Approved', '', '2025-04-11 05:56:27', NULL, NULL, 'Pending', NULL, ''),
(218, 131, 106, 'Approved', '', '2025-04-11 05:56:35', NULL, NULL, 'Pending', NULL, ''),
(219, 132, 106, 'Pending', '', '2025-04-11 05:56:45', NULL, NULL, 'Pending', NULL, ''),
(220, 133, 106, 'Pending', '', '2025-04-11 05:56:54', NULL, NULL, 'Pending', NULL, ''),
(221, 134, 106, 'Pending', '', '2025-04-14 05:19:54', NULL, NULL, 'Pending', NULL, ''),
(222, 135, 106, 'Pending', '', '2025-04-11 05:57:09', NULL, NULL, 'Pending', NULL, ''),
(223, 136, 106, 'Pending', '', '2025-04-11 05:57:36', NULL, NULL, 'Pending', NULL, ''),
(224, 137, 106, 'Pending', '', '2025-04-11 05:57:42', NULL, NULL, 'Pending', NULL, ''),
(225, 138, 106, 'Pending', '', '2025-04-11 05:57:48', NULL, NULL, 'Pending', NULL, ''),
(226, 139, 106, 'Pending', '', '2025-04-11 05:57:15', NULL, NULL, 'Pending', NULL, ''),
(227, 140, 106, 'Pending', '', '2025-04-11 05:57:54', NULL, NULL, 'Pending', NULL, ''),
(228, 141, 106, 'Pending', '', '2025-04-11 05:57:27', NULL, NULL, 'Pending', NULL, ''),
(229, 142, 106, 'Pending', '', '2025-04-14 10:14:00', NULL, NULL, 'Pending', NULL, ''),
(230, 143, 106, 'Approved', '', '2025-04-11 05:57:23', NULL, NULL, 'Pending', NULL, ''),
(231, 144, 106, 'Pending', '', '2025-04-11 05:58:00', NULL, NULL, 'Pending', NULL, ''),
(232, 145, 106, 'Pending', '', '2025-04-11 05:56:16', NULL, NULL, 'Pending', NULL, ''),
(233, 129, 50, 'Approved', 'accepted', '2025-04-11 06:24:17', NULL, NULL, 'Pending', NULL, ''),
(234, 145, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(235, 130, 50, 'Approved', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(236, 131, 50, 'Approved', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(237, 132, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(238, 133, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(239, 134, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(240, 135, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(241, 139, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(242, 142, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(243, 143, 50, 'Approved', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(244, 141, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(245, 136, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(246, 137, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(247, 138, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(248, 140, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(249, 144, 50, 'Pending', 'accepted', '2025-04-11 06:24:18', NULL, NULL, 'Pending', NULL, ''),
(250, 129, 49, 'Approved', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(251, 131, 49, 'Approved', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(252, 132, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(253, 133, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(254, 134, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(255, 135, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(256, 136, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(257, 137, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(258, 138, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(259, 139, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(260, 140, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(261, 141, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(262, 142, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(263, 143, 49, 'Approved', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(264, 144, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(265, 130, 49, 'Approved', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(266, 145, 49, 'Pending', '', '2025-04-11 06:25:12', NULL, NULL, 'Pending', NULL, ''),
(267, 129, 73, 'Approved', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(268, 134, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(269, 135, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(270, 136, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(271, 137, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(272, 138, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(273, 139, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(274, 140, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(275, 141, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(276, 142, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(277, 143, 73, 'Approved', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(278, 144, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(279, 145, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(280, 130, 73, 'Approved', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(281, 131, 73, 'Approved', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(282, 132, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(283, 133, 73, 'Pending', '', '2025-04-11 06:29:22', NULL, NULL, 'Pending', NULL, ''),
(284, 129, 72, 'Approved', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(285, 135, 72, 'Pending', '', '2025-04-11 06:40:25', NULL, NULL, 'Pending', NULL, ''),
(286, 136, 72, 'Pending', '', '2025-04-11 06:40:25', NULL, NULL, 'Pending', NULL, ''),
(287, 137, 72, 'Pending', '', '2025-04-11 06:40:25', NULL, NULL, 'Pending', NULL, ''),
(288, 138, 72, 'Pending', '', '2025-04-11 06:40:25', NULL, NULL, 'Pending', NULL, ''),
(289, 139, 72, 'Pending', '', '2025-04-11 06:40:25', NULL, NULL, 'Pending', NULL, ''),
(290, 140, 72, 'Pending', '', '2025-04-11 06:40:25', NULL, NULL, 'Pending', NULL, ''),
(291, 130, 72, 'Approved', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(292, 141, 72, 'Pending', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(293, 142, 72, 'Pending', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(294, 132, 72, 'Pending', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(295, 131, 72, 'Approved', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(296, 143, 72, 'Approved', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(297, 144, 72, 'Pending', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(298, 145, 72, 'Pending', '', '2025-04-11 06:40:24', NULL, NULL, 'Pending', NULL, ''),
(299, 133, 72, 'Pending', '', '2025-04-11 06:40:25', NULL, NULL, 'Pending', NULL, ''),
(300, 134, 72, 'Pending', '', '2025-04-11 06:40:25', NULL, NULL, 'Pending', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `conversation_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cost`
--

CREATE TABLE `cost` (
  `cost_id` bigint(20) UNSIGNED NOT NULL,
  `cost_name` varchar(255) NOT NULL,
  `cost_type` varchar(100) NOT NULL,
  `exchange` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `name`) VALUES
(1, 'አካውንቲንግ እና ፋይናንስ'),
(2, 'ኢንፎርሜሽን ቴክኖሎጂ ልማት'),
(3, 'ኮንስትራክሽን'),
(4, 'ኦዲት'),
(5, 'ቢዝነስ ዴቨሎፕመንት'),
(6, 'ህግ');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `supervisor_id` int(11) DEFAULT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `sex` enum('M','F') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `name`, `role_id`, `department_id`, `supervisor_id`, `fname`, `lname`, `email`, `phone`, `sex`) VALUES
(47, 'admin admin', 1, 2, 1, 'admin', 'admin', 'admin@email.com', '123-456-7890', 'M'),
(49, 'senayt', 3, 2, 73, 'senayt', 'Brihan', 'senayt@itp.et', '0933499093', 'M'),
(50, 'Smegnew', 5, 2, 49, 'Smegnew', 'Asemie', 'simegn@itp.org', '099000000', 'M'),
(58, 'nebyat', 6, 2, 50, 'Nebyat', 'Tsegabirhan', 'nebyat@itp.et', '0900000000', 'F'),
(71, 'admin', 1, NULL, NULL, 'admin', 'admin', 'adminadmin@itp.et', '09373773333', 'M'),
(72, 'Henok', 2, NULL, NULL, 'henok', 'Ahammed', 'henok@itp.et', '09373773333', 'M'),
(73, 'Getachew', 9, NULL, 72, 'Getachew', 'Atinte', 'getachew@itp.et', '09373773333', 'M'),
(74, 'Habtam', 6, 1, 73, 'Habtamua', 'kebede', 'habtam@itp.et', '0933499097', 'F'),
(76, 'Ermiyas', 5, 3, 49, 'Ermias', 'Ketema', 'ermiyas@itp.et', '090000000', 'M'),
(77, 'Walelign', 6, 3, 76, 'Walelign', 'Abateneh', 'walelign@itp.et', '0988883388', 'M'),
(103, 'Getachew Atinte', 9, NULL, 72, 'Atinte', 'Getachew', 'getachew@itpark.et', '0911000000', 'M'),
(104, 'Merso Gobena', 6, 2, 50, 'Merso', 'Gobena', 'merso@itpark.et', '090000000', 'M'),
(106, 'Eskedar Teshager', 6, 2, 50, 'Eskedar ', 'Teshager', 'eskedar@itpark.et', '0911000000', 'F'),
(107, 'Samuel Medihn', 8, 2, 106, 'Samuel ', 'medhn', 'samuel@itpark.et', '091100000', 'M'),
(108, 'Yesuf Fanta', 8, 2, 104, 'Yesuf', 'Fenta', 'yesuf@itpark.et', '0900000000', 'M'),
(109, 'Ezira', 1, 2, 58, 'Ezira', 'Mantegaftot', 'ezira@itpark.et', '091100000', 'M'),
(110, 'Yosef Kinfe', 8, 1, 74, 'Yosef', 'Kinfe', 'yosef@itpark.et', '0900000000', 'M'),
(111, 'Sintayew', 8, 1, 74, 'Sintayew ', 'Mogese', 'sintayew@itpark.et', '0900000000', 'F'),
(112, 'Arega', 8, 1, 74, 'Arega', 'Asalifew', 'arega@itpark.et', '0900000000', 'M'),
(113, 'Birtukan', 8, 1, 74, 'Birtukan', 'Gemechu', 'birtukan@itpark.et', '0900000000', 'F'),
(114, 'Sisaynesh', 8, 1, 74, 'Sisaynesh ', 'Gizaw', 'sisaynesh@itpark.et', '0900000000', 'F'),
(115, 'Yetemegn', 8, 1, 74, 'Yetemegn', 'Andarge', 'yetemegn@itpark.et', '0900000000', 'F'),
(116, 'Erimias Ketema', 5, 3, 49, 'Ermias ', 'Keteme', 'ermiasketeme@itpark.et', '0916000000', 'M'),
(117, 'Hayal Tamrat', 8, 2, 58, 'Hayal', 'Tamrat', 'hayal@itpark.et', '0916048977', 'M'),
(118, 'Desta Bekele', 6, 3, 116, 'Desta', 'Bekele', 'desta@itpark.et', '0911000000', 'M'),
(119, 'Sintayehu Tesfaye', 8, 3, 118, 'Sintayehu', 'Tesfaye', 'sintayehu@itpark.et', '0910000000', 'M'),
(120, 'Kasu Adare', 8, 3, 118, 'Kasu ', 'Adare', 'kasu@itpark.et', '0910000000', 'M'),
(122, 'Wonde Suleman', 8, 3, 118, 'Wonde', 'Suleman', 'wonde@itpark.et', '0910000000', 'M'),
(123, 'Eyasu Yeshitila', 8, 3, 118, 'Eyasu', 'Yeshitila', 'eyasu@itpark.et', '0910000000', 'M'),
(125, 'Alemayehu Deresa', 8, 3, 118, 'Alemayehu', 'Deresa', 'alemayehu@itpark.et', '0910000000', 'M'),
(126, 'Amanuel Girma', 8, 3, 77, 'Amanual', 'Girma', 'amanuelgirma@itpark.et', '0911000000', 'M'),
(128, 'Mihretu Debebe', 8, 3, 116, 'Mihretu', 'Debebe', 'mihretu@itpark.et', '0910000000', 'M'),
(129, 'Birhanu Legese', 8, 3, 116, 'Birhanu', 'Legese', 'birhanu@itpark.et', '0910000000', 'M'),
(130, 'Melat Bezu', 8, 3, 77, 'Melat', 'Bezu', 'melatbezu@itpark.et', '0911000000', 'F'),
(131, 'Teshale', 8, 1, 74, 'Teshale ', 'Mola', 'teshale@itpark.et', '0900000000', 'M'),
(132, 'Getahun', 8, 1, 74, 'Getahun', 'Faji', 'getahun@itpark.et', '0900000000', 'M'),
(133, 'Gelana', 8, 1, 74, 'Gelana', 'Olana', 'gelana@itpark.et', '0900000000', 'M'),
(134, 'Tsehay', 8, 1, 74, 'Tsehay', 'Alemu', 'tsehay@itpark.et', '0900000000', 'F'),
(135, 'Lemlem', 8, 1, 74, 'Lemlem', 'Degefe', 'lemlem@itpark.et', '0900000000', 'F'),
(136, 'Walelign Abera', 8, 4, 103, 'Walelign', 'Abera', 'walelign@itpark.et', '0900000000', 'M'),
(137, 'Fetane Aage', 8, 5, 103, 'Fetane', 'Arage', 'fetane@itpark.et', '0900000000', 'M'),
(138, 'Petros', 8, 6, 103, 'Petros', 'Abraham', 'petros@itpark.et', '0900000000', 'M');

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `goal_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `quarter` varchar(2) DEFAULT NULL,
  `employee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`goal_id`, `user_id`, `name`, `description`, `created_at`, `updated_at`, `created_by`, `year`, `quarter`, `employee_id`) VALUES
(87, 26, 'ግብ 1. የIT ካምፓኒዎችን ወደ ፓርኩ በመሳብ የሥራ ዕድልና የውጭ ቀጥተኛ ኢንቨስትመንት መፍጠር', 'የIT ካምፓኒዎችን ወደ ፓርኩ በመሳብ የሥራ ዕድልና የውጭ ቀጥተኛ ኢንቨስትመንት መፍጠር', '2025-03-12 04:36:46', '2025-04-16 03:39:28', NULL, 2017, '3', 73),
(88, 26, 'ግብ 2. የፓርኩ ነዋሪዎች (የአይቲ ካምፓኒዎች) ቴክኖልጂ እንዲያሸጋግሩ እና ምርታቸውን ወይም አገሌግልታቸውን ለውጪ ገበያ በማቅረብ የውጭ ምንዛሪ እንዱያስገኙ ማዴረግ', 'የፓርኩ ነዋሪዎች (የአይቲ ካምፓኒዎች) ቴክኖልጂ እንዲያሸጋግሩ እና ምርታቸውን ወይም አገሌግልታቸውን ለውጪ ገበያ በማቅረብ የውጭ ምንዛሪ እንዱያስገኙ ማዴረግ', '2025-03-12 04:44:06', '2025-04-16 03:39:33', NULL, 2017, '3', 73),
(89, 26, 'ግብ 3. ለደንበኞች  ደረጃውን የጠበቀ አገልግልት ማቅረብ ', 'የፓርኩ ነዋሪዎች (የአይቲ ካምፓኒዎች) ቴክኖልጂ እንዲያሸጋግሩ እና ምርታቸውን ወይም አገሌግልታቸውን ለውጪ ገበያ በማቅረብ የውጭ ምንዛሪ እንዱያስገኙ ማዴረግ', '2025-03-12 04:52:17', '2025-04-16 03:39:36', NULL, 2017, '3', 73),
(90, 26, 'ግብ 4. በIT ኢንደስትሪ የተሰማሩ ካምፓኒዎችን ለመሳብ የሚያስችል ዓለም አቀፍ ደረጃ የጠበቀ መሰረተ -ልማትና ፋሲሉቲ ሟሟላት/ማደስ ', 'በIT ኢንደስትሪ የተሰማሩ ካምፓኒዎችን ለመሳብ የሚያስችል ዓለም አቀፍ ደረጃ የጠበቀ መሰረተ -ልማትና ፋሲሉቲ ሟሟላት/ማደስ ', '2025-03-13 04:35:15', '2025-04-16 03:39:40', NULL, 2017, '3', 73),
(91, 26, 'ግብ 5. የሥራ አመራር፣ የገቢ አሰባበሰብ፣ የሀብት አስተዳደር እና አጠቃቀም ተግባራትንና አቅሞችን አጠናክሮ ማስቀጠል ', 'የሥራ አመራር፣ የገቢ አሰባበሰብ፣ የሀብት አስተዳደር እና አጠቃቀም ተግባራትንና አቅሞችን አጠናክሮ ማስቀጠል', '2025-03-13 04:37:15', '2025-04-16 03:39:44', NULL, 2017, '3', 73);

-- --------------------------------------------------------

--
-- Table structure for table `income`
--

CREATE TABLE `income` (
  `income_id` bigint(20) UNSIGNED NOT NULL,
  `income_name` varchar(255) NOT NULL,
  `income_type` varchar(100) NOT NULL,
  `income_exchange_dollar` decimal(15,2) DEFAULT NULL,
  `income_exchange_etb` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `objectives`
--

CREATE TABLE `objectives` (
  `objective_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `quarter` varchar(2) DEFAULT NULL,
  `employee_id` int(11) NOT NULL,
  `goal_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `objectives`
--

INSERT INTO `objectives` (`objective_id`, `user_id`, `name`, `description`, `created_at`, `updated_at`, `created_by`, `year`, `quarter`, `employee_id`, `goal_id`) VALUES
(113, 26, 'ዓላማ 1.1 የIT ካምፓኒዎችን በመሳብ የተፈጠረ ቀጥተኛና ተጓዳኝ የሥራ ዕዴል ማሳደግ', 'የIT ካምፓኒዎችን በመሳብ የተፈጠረ ቀጥተኛና ተጓዳኝ የሥራ ዕዴል ማሳደግ', '2025-03-12 04:37:52', '2025-04-09 11:19:55', NULL, NULL, NULL, 0, 87),
(114, 26, 'ዓላማ 1.2 የIT ካምፓኒዎችን በመሳብ የተፈጠረ የሀገር ውስጥ እና የውጭ ቀጥተኛ ኢንቨስትመንት (FDI) ማሳደግ ', 'የIT ካምፓኒዎችን በመሳብ የተፈጠረ የሀገር ውስጥ እና የውጭ ቀጥተኛ ኢንቨስትመንት (FDI) ማሳደግ ', '2025-03-12 04:42:33', '2025-04-09 11:20:37', NULL, NULL, NULL, 0, 87),
(115, 26, 'ዓላማ 2.1 የተፈጠረ የቴከኖልጂ ሽግግር ', 'የተፈጠረ የቴከኖልጂ ሽግግር ', '2025-03-12 04:45:27', '2025-03-13 04:17:48', NULL, NULL, NULL, 0, 88),
(116, 26, 'ዓላማ 2.2 ከኤክስፖርት የተገኘ የውጭ ምንዛሪ ማሳደግ', 'ከኤክስፖርት የተገኘ የውጭ ምንዛሪ ማሳደግ', '2025-03-12 04:48:25', '2025-04-09 11:21:02', NULL, NULL, NULL, 0, 88),
(117, 26, 'ዓላማ 2.3 ከተተኪ ምርቶች/አገልግሎት የተገኘ ገቢ ማሳደግ ', 'ከተተኪ ምርቶች/አገልግሎት የተገኘ ገቢ ማሳደግ ', '2025-03-12 04:49:59', '2025-04-09 11:24:52', NULL, NULL, NULL, 0, 88),
(118, 26, 'ዓላማ 3.1 የለማ መሬት በንዑስ ሊዝ የወሰደ ካምፓኒዎችን ብዛት፣ ለካምፓኒዎች አገልግልት የዋለን መሬት ስፋት እና አገሌግልት የተሰጠበትን አማካይ ጊዜ ማሻሻል ', 'የለማ መሬት በንዑስ ሉዝ የወሰደ ካምፓኒዎችን ብዛት፣ የካምፓኒዎች አገሌግልት የዋለን መሬት ስፋት እና አገሌግልት የተሰጠበትን አማካይ ጊዜ ማሻሻሌ የለማ መሬት በንዑስ ሊዝ የወሰደ ካምፓኒዎችን ብዛት፣ ለካምፓኒዎች አገልግልት የዋለን መሬት ስፋት እና አገሌግልት የተሰጠበትን አማካይ ጊዜ ማሻሻል', '2025-03-12 04:54:07', '2025-04-09 11:23:48', NULL, NULL, NULL, 0, 89),
(119, 26, 'ዓላማ 3.2 የመገልገያ ህንጻ ኪራይ የወሰደ ካምፓኒዎችን ብዛት፣ የተከራዮች አገልግሎት የዋለን የቦታ ስፋትና አገሌግልት የተሰጠበትን አማካይ ጊዜ ማሻሻል ', 'የመገልገያ ህንጻ ኪራይ የወሰደ ካምፓኒዎችን ብዛት፣ የተከራዮች አገልግሎት የዋለን የቦታ ስፋትና አገሌግልት የተሰጠበትን አማካይ ጊዜ ማሻሻል ', '2025-03-12 04:59:38', '2025-04-09 11:25:27', NULL, NULL, NULL, 0, 89),
(120, 26, 'ዓላማ 3.3 በስታርትአፕ አክሰለሬሽን እና በኢንኩቤሽን ፕሮግራሞች ተጠቃሚ የሆኑ ካምፓኒዎች ብዛት ማሳደግ ', 'በስታርትአፕ አክሰለሬሽን እና በኢንኩቤሽን ፕሮግራሞች ተጠቃሚ የሆኑ ካምፓኒዎች ብዛት ማሳደግ ', '2025-03-12 05:03:50', '2025-03-12 05:03:50', NULL, NULL, NULL, 0, 89),
(121, 26, 'ዓላማ 3.4 የቢዝነስ ትስስር የማድረግ የተፈጠረ መድረክ (ኩነት)', 'የቢዝነስ ትስስር ሇማዴረግ የተፈጠረ መድረክ (ኩነት)', '2025-03-12 05:06:36', '2025-04-09 11:26:28', NULL, NULL, NULL, 0, 89),
(122, 26, 'ዓላማ 4.1 የአዱስ መሠረተ -ሌማትና ፋሲሉቲ ግንባታ ዲዛይን ማዘጋጀት ', 'የአዱስ መሠረተ -ሌማትና ፋሲሉቲ ግንባታ ዲዛይን ማዘጋጀት ', '2025-03-13 04:35:58', '2025-04-09 11:27:02', NULL, NULL, NULL, 0, 90),
(123, 26, 'ዓሊማ 3.5 ለነዋሪዎች ደረጃውን የጠበቀ አገልግሎት መስጠታቸው የተረጋገጠ የጋራ አገሌግልት መስጫ ፋሲሉቲዎች ', 'ለነዋሪዎች ደረጃውን የጠበቀ አገልግሎት መስጠታቸው የተረጋገጠ የጋራ አገሌግልት መስጫ ፋሲሉቲዎች ', '2025-03-13 04:42:29', '2025-04-09 11:27:36', NULL, NULL, NULL, 0, 89),
(124, 26, 'ዓላማ 3.6 ለነዋሪዎች ብቃት ያለው የሰው ኃይል አቅርቦት (Talent Pool) እንዲኖር ማስቻል', 'ለነዋሪዎች ብቃት ያለው የሰው ኃይል አቅርቦት (Talent Pool) እንዲኖር ማስቻል', '2025-03-13 04:48:45', '2025-04-09 11:28:15', NULL, NULL, NULL, 0, 89),
(125, 26, 'ዓላማ 4.2 ዓለም አቀፍ ደረጃን የጠበቀ አዲስ መሠረተ - ልማትና ፋሲሉቲ መገንባት/ማስፋፋት', 'ዓለም አቀፍ ደረጃን የጠበቀ አዲስ መሠረተ - ልማትና ፋሲሉቲ መገንባት/ማስፋፋት', '2025-03-13 04:58:40', '2025-04-09 11:28:45', NULL, NULL, NULL, 0, 90),
(126, 26, 'ዓላማ 4.3 ቀድሞ የለማ መሠረተ-ልማትና ፋሲልቲ የማደስ ሥራ ማካሄድ', 'ቀድሞ የለማ መሠረተ-ልማትና ፋሲሊቲ የማደስ ሥራ ማካሄድ', '2025-03-13 05:11:16', '2025-04-09 11:37:13', NULL, NULL, NULL, 0, 90),
(127, 26, 'ዓላማ 4.4 የኮርፖሬሽኑን ኢኮ-ቴክኖልጂ ዘሊቂነት ማረጋጋጥ ', 'የኮርፖሬሽኑን ኢኮ-ቴክኖልጂ ዘሊቂነት ማረጋጋጥ ', '2025-03-13 05:17:10', '2025-03-13 05:17:10', NULL, NULL, NULL, 0, 90),
(128, 26, 'ዓላማ 5.1 የኢ.ቴ.ፓ.ኮ. ዓላማ ማሳኪያ አደረጃጀትና የአስተዲደር መመሪያዎችን ማሻሻል፣ የሰው ሀይል ማሟላትና አቅም ማጎሌበት', 'የኢ.ቴ.ፓ.ኮ. ዓላማ ማሳኪያ አደረጃጀትና የአስተዲደር መመሪያዎችን ማሻሻል፣ የሰው ሀይል ማሟላትና አቅም ማጎሌበት', '2025-03-13 05:19:37', '2025-04-09 11:30:46', NULL, NULL, NULL, 0, 91),
(129, 26, 'ዓላማ 5.2 የኮርፖሬሽኑን ገቢ አሰባሰብ እና ፋይናንስ አጠቃቀም አጠናክሮ ማስቀጠል ', 'የኮርፖሬሽኑን ገቢ አሰባሰብ እና ፋይናንስ አጠቃቀም አጠናክሮ ማስቀጠል', '2025-03-13 05:23:48', '2025-04-09 11:31:11', NULL, NULL, NULL, 0, 91),
(130, 26, 'ዓላማ 5.3 የኮርፖሬሽኑ በጀትና ንብረት በአግባቡ ጥቅም ሊይ ስለመዋሉ በውስጥ ኦዱት ማረጋገጥ ', 'የኮርፖሬሽኑ በጀትና ንብረት በአግባቡ ጥቅም ሊይ ስለመዋሉ በውስጥ ኦዱት ማረጋገጥ ', '2025-03-13 05:27:27', '2025-04-09 11:38:12', NULL, NULL, NULL, 0, 91),
(131, 26, 'ዓላማ 5.4 ኮርፖሬሽኑን ንብረት አያያዝና አጠቃቀም ሥራ ማካሄድ ', ' ኮርፖሬሽኑን ንብረት አያያዝና አጠቃቀም ሥራ ማካሄድ', '2025-03-13 05:29:03', '2025-04-09 11:38:43', NULL, NULL, NULL, 0, 91),
(132, 26, 'ዓላማ 5.5 የኮርፖሬሽኑን ሥራ በIT እንዲደገፍ የማዴረግ ሥራ አጠናክሮ ማስቀጠል', 'የኮርፖሬሽኑን ሥራ በIT እንዲደገፍ የማዴረግ ሥራ አጠናክሮ ማስቀጠል', '2025-03-13 05:31:19', '2025-04-09 11:39:19', NULL, NULL, NULL, 0, 91),
(133, 26, 'ዓላማ 5.6 ቢዝነስ ካምፓኒዎችን የመሳብ የፕሮሞሽን ሥራ ማካሄድ', 'ቢዝነስ ካምፓኒዎችን የመሳብ የፕሮሞሽን ሥራ ማካሄድ ', '2025-03-13 05:33:15', '2025-04-09 11:40:15', NULL, NULL, NULL, 0, 91),
(134, 26, 'ዓላማ 5.7 በህግ ጉዲዮች ሊይ የማማከርና የመፈጸም አገሌግልት መስጠት ', 'በህግ ጉዲዮች ሊይ የማማከርና የመፈጸም አገሌግልት መስጠት ', '2025-03-13 05:37:03', '2025-03-13 05:37:03', NULL, NULL, NULL, 0, 91),
(135, 26, 'ዓሊማ 5.8 የኮርፖሬሽኑን ሥራዎች የሚያግዙና የሚያቀላጥፉ ማንዋልችን ማዘጋጀት', 'የኮርፖሬሽኑን ሥራዎች የሚያግዙና የሚያቀልጥፉ ማንዋልችን ማዘጋጀት', '2025-03-13 05:39:25', '2025-04-09 11:41:09', NULL, NULL, NULL, 0, 91),
(136, 26, 'ዓላማ 5.9 ከባለ ድርሻዎች ጋር ስምምነት ማድረግ ', 'ከባለ ድርሻዎች ጋር ስምምነት ማድረግ ', '2025-03-13 05:42:09', '2025-04-09 11:41:37', NULL, NULL, NULL, 0, 91),
(137, 26, 'ዓሊማ 5.10 ተጨማሪ የቢዝነስ እድሎችን ማጥናትና መተግበር ', 'ተጨማሪ የቢዝነስ እድሎችን ማጥናትና መተግበር ', '2025-03-13 05:45:27', '2025-04-09 11:42:41', NULL, NULL, NULL, 0, 91),
(138, 26, 'ዓላማ 5.11 የገቢ ማስገኛ ስራዎችን ከተባባሪዎቸ/ሇጋሽ አካሊት ጋር መስራት ', 'የገቢ ማስገኛ ስራዎችን ከተባባሪዎቸ/ሇጋሽ አካሊት ጋር መስራት ', '2025-03-13 05:48:29', '2025-03-13 05:48:29', NULL, NULL, NULL, 0, 91);

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `plan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `supervisor_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `objective_id` int(11) DEFAULT NULL,
  `specific_objective_id` int(11) DEFAULT NULL,
  `specific_objective_detail_id` int(11) DEFAULT NULL,
  `status` enum('Pending','Approved') NOT NULL DEFAULT 'Pending',
  `year` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `report_status` enum('Pending','Approved','Declined') DEFAULT 'Pending',
  `department_name` varchar(255) NOT NULL,
  `editing_status` enum('active','deactivate') NOT NULL DEFAULT 'deactivate',
  `reporting` enum('active','deactivate') NOT NULL DEFAULT 'deactivate',
  `report_progress` enum('on_progress','completed') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`plan_id`, `user_id`, `department_id`, `supervisor_id`, `employee_id`, `goal_id`, `objective_id`, `specific_objective_id`, `specific_objective_detail_id`, `status`, `year`, `created_at`, `updated_at`, `report_status`, `department_name`, `editing_status`, `reporting`, `report_progress`) VALUES
(129, 38, 2, 106, 107, 87, 113, 461, 683, 'Pending', 0, '2025-04-11 11:23:32', '2025-04-11 13:40:24', 'Pending', '', 'deactivate', 'active', NULL),
(130, 38, 2, 106, 107, 87, 113, 462, 684, 'Pending', 0, '2025-04-11 11:37:44', '2025-04-11 13:40:24', 'Pending', '', 'deactivate', 'active', NULL),
(131, 38, 2, 106, 107, 87, 113, 463, 685, 'Pending', 0, '2025-04-11 11:44:21', '2025-04-11 13:40:24', 'Pending', '', 'deactivate', 'active', NULL),
(132, 38, 2, 106, 107, 87, 114, 465, 686, 'Pending', 0, '2025-04-11 12:08:26', '2025-04-14 12:16:45', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(133, 38, 2, 106, 107, 87, 114, 466, 687, 'Pending', 0, '2025-04-11 12:10:59', '2025-04-14 12:26:03', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(134, 38, 2, 106, 107, 88, 115, 467, 688, 'Pending', 0, '2025-04-11 12:14:44', '2025-04-11 18:00:01', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(135, 38, 2, 106, 107, 88, 116, 474, 689, 'Pending', 0, '2025-04-11 12:24:27', '2025-04-14 12:33:01', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(136, 38, 2, 106, 107, 88, 116, 475, 690, 'Pending', 0, '2025-04-11 12:32:16', '2025-04-14 12:33:43', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(137, 38, 2, 106, 107, 88, 117, 477, 691, 'Pending', 0, '2025-04-11 12:35:46', '2025-04-14 12:34:17', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(138, 38, 2, 106, 107, 88, 117, 478, 692, 'Pending', 0, '2025-04-11 12:37:28', '2025-04-14 12:36:13', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(139, 38, 2, 106, 107, 88, 117, 479, 693, 'Pending', 0, '2025-04-11 12:40:24', '2025-04-14 12:41:14', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(140, 38, 2, 106, 107, 88, 115, 468, 694, 'Pending', 0, '2025-04-11 12:42:50', '2025-04-14 12:43:28', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(141, 38, 2, 106, 107, 88, 115, 469, 695, 'Pending', 0, '2025-04-11 12:44:29', '2025-04-14 12:50:28', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(142, 38, 2, 106, 107, 88, 115, 470, 696, 'Pending', 0, '2025-04-11 12:47:10', '2025-04-14 12:59:00', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(143, 38, 2, 106, 107, 88, 115, 471, 697, 'Pending', 0, '2025-04-11 12:49:44', '2025-04-11 13:40:24', 'Pending', '', 'deactivate', 'active', NULL),
(144, 38, 2, 106, 107, 88, 115, 472, 698, 'Pending', 0, '2025-04-11 12:51:17', '2025-04-14 13:38:56', 'Pending', '', 'deactivate', 'active', 'on_progress'),
(145, 38, 2, 106, 107, 88, 115, 473, 699, 'Pending', 0, '2025-04-11 12:55:13', '2025-04-14 13:50:05', 'Pending', '', 'deactivate', 'active', 'on_progress');

-- --------------------------------------------------------

--
-- Table structure for table `reportfile`
--

CREATE TABLE `reportfile` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `specific_objective_id` int(11) DEFAULT NULL,
  `file_name` text NOT NULL,
  `file_path` text NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reportfile`
--

INSERT INTO `reportfile` (`id`, `specific_objective_id`, `file_name`, `file_path`, `uploaded_at`) VALUES
(17, 686, 'Investiment EITPC lS&FS 3rd quarter Report fainal 2.xlsx', 'uploads\\1744633005153-635764210.xlsx', '2025-04-14 12:16:45');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `status`) VALUES
(1, 'Admin', 1),
(2, 'CEO', 1),
(3, 'General manager', 1),
(5, 'deputy manager', 0),
(6, 'service head', 0),
(7, 'Team leader', 0),
(8, 'Expert', 0),
(9, 'ፕላን እና ሪፖርት', 0);

-- --------------------------------------------------------

--
-- Table structure for table `specific_objectives`
--

CREATE TABLE `specific_objectives` (
  `specific_objective_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `objective_id` int(11) DEFAULT NULL,
  `specific_objective_name` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `baseline` varchar(255) DEFAULT NULL,
  `plan` text DEFAULT NULL,
  `measurement` text DEFAULT NULL,
  `execution_percentage` decimal(5,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deadline_quarter` enum('Q1','Q2','Q3','Q4') NOT NULL,
  `deadline` date DEFAULT NULL,
  `priority` varchar(20) NOT NULL,
  `department_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `count` int(11) NOT NULL,
  `progress` enum('started','on going','completed') NOT NULL DEFAULT 'started',
  `income_id` int(11) DEFAULT NULL,
  `cost_id` int(11) DEFAULT NULL,
  `view` enum('የፋይናንስ ዕይታ','የተገልጋይ ዕይታ','የውስጥ አሰራር ዕይታ','የመማማርና ዕድገት ዕይታ') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specific_objectives`
--

INSERT INTO `specific_objectives` (`specific_objective_id`, `user_id`, `objective_id`, `specific_objective_name`, `details`, `baseline`, `plan`, `measurement`, `execution_percentage`, `created_at`, `updated_at`, `deadline_quarter`, `deadline`, `priority`, `department_id`, `name`, `count`, `progress`, `income_id`, `cost_id`, `view`) VALUES
(461, 26, 113, '1.1.1 በንዑስ ሊዝ መሬት በወሰደ ካምፓኒዎች በቀጥታ የተፈጠረ የሥራ ዕዴል በሰው ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:38:56', '2025-04-09 12:10:50', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(462, 26, 113, '1.1.2 የህንጻ ኪራይ በወሰዱ ካምፓኒዎች በቀጥታ የተፈጠረ የሥራ ዕድል በሰው ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:39:17', '2025-04-09 12:10:57', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(463, 26, 113, '1.1.3 ከካምፓኒዎቹ ሥራ ጋር ተያይዞ በተጓዳኝ የተፈጠረ የሥራ ዕድል በሰው ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:39:36', '2025-04-09 12:11:01', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(465, 26, 114, '1.2.1 በንዑስ ሊዝ መሬት በወሰደ እና ቢሮ በተከራየ አልሚ ካምፓኒዎች የተፈጠረ ቀጥተኛ የውጭ ኢንቨስትመንት (በሚሉዮን ዶሊር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:42:58', '2025-04-09 12:11:07', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(466, 26, 114, '1.2.2 በንዑስ ሉዝ መሬት በወሰደ እና ቢሮ በተከራዩ አሌሚ ካምፓኒዎች የተፈጠረ የሀገር ውስጥ ኢንቨስትመንት (በሚሉዮን ብር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:43:14', '2025-04-09 12:11:13', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(467, 26, 115, '2.1.1 የቴክኖልጂ ሽግግር ሇማዴረግ የሰሇጠኑ ሰሌጣኞች ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:45:54', '2025-04-09 12:11:18', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(468, 26, 115, '2.1.2 የቴክኖልጂ ሽግግር ሇማዴረግ የተፈጠረ ሥሌጠና ብዛት በዓይነት', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:46:11', '2025-04-09 12:11:22', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(469, 26, 115, '2.1.3 የተሇየ የቴክኖልጂ ብቃት ይዞ ከውጭ ሀገር የመጣ ባሇሙያን መተካት የቻሇ የሀገር ውስጥ ባሇሙያ ብዛት በቁጥር ', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:46:26', '2025-04-09 12:11:26', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(470, 26, 115, '2.1.4 በተሇየ የቴክኖልጂ ብቃት ሰርቲፋይዴ የሆነ (የብቃት ማረገጋገጫ ዕውቅና ያገኘ) ባሇሙያ ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:46:46', '2025-04-09 12:11:31', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(471, 26, 115, '2.1.5 በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ጥበቃ ያገኘ ባሇሙያ ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:47:00', '2025-04-09 12:11:34', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(472, 26, 115, '2.1.6 በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ምዝገባ ያገኘ ዴርጅት ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:47:24', '2025-04-09 12:11:39', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(473, 26, 115, '2.1.7 በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ማመሌከቻ ያቀረበ ባሇሙያ/ዴርጅት ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:47:40', '2025-04-09 12:11:43', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(474, 26, 116, '2.2.1 በንዑስ ሉዝ መሬት ከወሰደ ካምፓኒዎች ምርት/አገሌግልት ሽያጭ የተገኘ የወጪ ንግዴ ገቢ (በሚሉዮን ድሊር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:48:56', '2025-04-09 12:11:47', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(475, 26, 116, '2.2.2 የህንጻ ኪራይ ከወሰደ ካምፓኒዎች ምርት/አገሌግልት ሽያጭ የተገኘ የወጪ ንግዴ ገቢ (በሚሉዮን ድሊር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:49:12', '2025-04-09 12:11:52', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(477, 26, 117, '2.3.1. በሀገር ውስጥ የተመረተ ተተኪ ምርት/አገሌግልት ዓይነት ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:50:30', '2025-04-09 12:12:00', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(478, 26, 117, '2.3.2. ተተኪ ምርት/አገሌግልት በሀገር ውስጥ ያመረቱ ካምፓኒዎች ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:50:49', '2025-04-09 12:12:03', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(479, 26, 117, '2.3.3. በሀገር ውስጥ ከተሸጠ ተተኪ ምርት ሽያጭ የተገኘ ጠቅሊሊ ገቢ (በቢሉዮን ብር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:51:10', '2025-04-09 12:12:06', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(480, 26, 118, '3.1.1 የሇማ መሬት በንዑስ ሉዝ ከሚተሊሇፍሊቸው ካምፓኒዎች ጋር የተፈጸመ ውሌ ስምምነት ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:54:30', '2025-04-09 12:12:10', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(481, 26, 118, '3.1.2 የሇማ መሬት በንዑስ ሉዝ ሇመውሰዴ ርክክብ የተፈጸመሊቸው ካምፓኒዎች ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:54:50', '2025-04-09 12:12:14', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(482, 26, 118, '3 3.1.3 የካምፓኒዎች በንዑስ ሉዝ የተሰጠ የመሬት ስፋት በካሬ ሜትር ', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:55:37', '2025-04-09 12:12:18', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(483, 26, 118, '3.1.4. የለማ መሬት በንዑስ ሉዝ ሇወሰደ ካምፓኒዎች የተሰጠ የባለቤትነት ማረጋገጫ ካርታ ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:56:15', '2025-04-09 12:12:23', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(484, 26, 118, '3.1.5 የለማ መሬት በንዑስ ሉዝ  የወሰዱ ካምፓኒዎች የጸደቀ የግንባታ ዱዛይን ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:56:54', '2025-04-09 12:12:28', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(485, 26, 118, '3.1.6 የለማ መሬት በንዑስ ሉዝ የወሰደ ካምፓኒዎች የተሰጠ የግንባታ ፈቃዴ ሰርቲፊኬት ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:57:23', '2025-04-09 12:12:32', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(486, 26, 118, '3.1.7 የለማ መሬት በንዑስ ሊዝ የማስተላለፍ ለእያንዲንዱ ካምፓኒ አገሌግልት የተሰጠበት አማካይ ጊዜ በቀን', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 11:58:44', '2025-04-09 12:12:36', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(487, 26, 119, '3.2.1 የመገሌገያ ህንጻ ኪራይ ለመውሰዴ ውሌ የፈጸሙ ካምፓኒዎች ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:00:21', '2025-04-09 12:12:40', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(488, 26, 119, '3.2.2 የመገሌገያ ህንጻ ኪራይ የተረከቡ ካምፓኒዎች (ብዛት በቁጥር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:00:39', '2025-04-09 12:12:45', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(489, 26, 119, '3.2.3 የካምፓኒዎች በኪራይ የተሰጠ የሥራ ቦታ (ህንጻ/ክፍሌ) ስፋት በካሬ ሜትር ', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:01:09', '2025-04-09 12:12:50', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(490, 26, 119, '3.2.4 በበጀት ዓመቱ ውስጥ የመስሪያ ቦታ በኪራይ ለወሰደ ካምፓኒዎች አገሌግልት የተሰጠበት አማካይ ጊዜ በቀን', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:01:41', '2025-04-09 12:12:57', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(491, 26, 119, '3.2.5 የመገሌገያ ህንጻ ሇተከራዩ ካምፓኒዎች የጸዯቀ ዱዛይን ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:02:00', '2025-04-09 12:13:01', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(492, 26, 119, '3.2.6 የመገሌገያ ህንጻ ኪራይ የወሰደ ካምፓኒዎች አፈጻጸም ሊይ የተካሄዯ ዴጋፍ፣ ክትትሌና ቁጥጥር በካምፓኔ ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:02:20', '2025-04-09 12:13:07', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(493, 26, 120, '3.3.1 ሇኢንኩቤሽን ፕሮግራም ሰነዴ ማዘጋጀት', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:04:09', '2025-04-09 12:13:12', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(494, 26, 120, '3.3.2 በአክሰሇሬሽን ፕሮግራሞች ተጠቃሚ የሆኑ ካምፓኒዎች ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:04:32', '2025-04-09 12:13:17', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(495, 26, 120, '3.3.3 በኢንኩቤሽን ፕሮግራሞች ተጠቃሚ የሆኑ ካምፓኒዎች ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:04:47', '2025-04-09 12:13:23', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(496, 26, 120, '3.3.4 በኢንኩቤሽን ፕሮግራሞች ተጠቃሚ የሆኑ ወጣት ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:05:02', '2025-04-09 12:13:27', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(497, 26, 120, '3.3.5 በኢንኩቤሽን ፕሮግራሞች ተጠቃሚ ከሆኑት መካከሌ ውጤታማ የሆኑ ወጣቶች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:05:27', '2025-04-09 12:13:31', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(498, 26, 120, '3.3.6 የኢንኩቤተሮች ዴጋፍና ክትትሌ ጊዜ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-12 12:05:52', '2025-04-09 12:13:35', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(499, 26, 121, '3.4.1 ለኗሪዎች የተፈጠሩ የገበያ ትስስር መዴረኮች ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:40:08', '2025-04-09 12:13:40', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(500, 26, 121, ' 3.4.2 ከኗሪዎች ጋር የተዯረጉ የመግባቢያ ስምምነቶች ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:40:28', '2025-04-09 12:13:43', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(501, 26, 121, '3.4.3 ከኗሪዎች ጋር የተዯረጉ የፓርትነርሺፕ ስምምነቶች በዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:40:42', '2025-04-09 12:13:47', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(502, 26, 121, '3.4.4 ኗሪዎችን ከሥራ ፈሊጊዎች ጋር ለማገናኘት የተፈጠረ ሁነት ብዛት (ሇሥራ ዕዴሌ ፈጠራ)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:41:59', '2025-04-09 12:13:52', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(503, 26, 123, '3.5.1 ከዓመቱ 365 ቀናት ውስጥ ለፓርኩ ነዋሪዎች የኢንተርኔት አገሌግልት የተሰጠበት ቀን ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:43:04', '2025-04-09 12:13:57', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(504, 26, 123, '3.5.2 ከዓመቱ 365 ቀናት ውስጥ በፓርኩ ተግባራዊ የተዯረገ የዯህንነት ካሜራ አገሌግልት በቀን ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:43:26', '2025-04-09 12:14:02', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(505, 26, 123, '3.5.3 ከዓመቱ 250 የሥራ ቀናት ውስጥ ሇፓርኩ ነዋሪዎች የውሃ አገሌግልት የተሰጠበት ቀን ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:46:01', '2025-04-09 12:14:06', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(506, 26, 123, '3.5.4 ከዓመቱ 250 የሥራ ቀናት ውስጥ ለፓርኩ ነዋሪዎች የኤላክትሪክ አገሌግልት የተሰጠበት ቀን ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:46:25', '2025-03-13 11:46:25', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(507, 26, 123, '3.5.5 ከዓመቱ 250 የሥራ ቀናት ውስጥ በፓርኩ ነዋሪዎች ዘንዴ በዋጋና በጥራት ተቀባይነት ያሇው የካፊቴሪያ አገሌግልት የተሰጠበት ቀን ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:46:48', '2025-04-09 12:14:13', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(508, 26, 123, '3.5.6 ከዓመቱ 250 የሥራ ቀናት ውስጥ ከፓርኩ ነዋሪዎች የተሟሊ የስብሰባ አዲራሽ (30 ሰው የሚይዝ አዲራሽ) አገሌግልት የተሰጠበት ቀን ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:47:13', '2025-04-09 12:14:18', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(509, 26, 123, '3.5.7 ከዓመቱ 250 የሥራ ቀናት ውስጥ ሇ300 የፓርኩ ነዋሪዎች የትራንስፖርት ሰርቪስ አገሌግልት የተሰጠበት ቀን', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:47:30', '2025-04-09 12:14:22', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(510, 26, 123, '3.5.8 ከዓመቱ 250 የሥራ ቀናት ውስጥ ለደንበኞች የአንዴ መስኮት አገሌግልት የተሰጠበት ቀን ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:47:50', '2025-04-09 12:14:28', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(511, 26, 123, '3.5.9 ከዓመቱ 365 ቀናት ውስጥ ለደንበኞች የአንዴ መስኮት ፖርታሌ አገሌግልት የተሰጠበት ቀን ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:48:16', '2025-04-09 12:14:32', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(512, 26, 124, '3.6.1 ለፓርኩ የሰው ኃይሌ አቅርቦት (Talent Pool) በመፍጠር ሇነዋሪዎች የቀረበ ብቃት ያሇው የሰው ኃይሌ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:49:29', '2025-04-09 12:14:36', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(513, 26, 124, '3.6.2 በተፈጠረው ታለንት ፑሌ ሊይ በመመስረት የተቀጠሩ ሰሌጣኞች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:49:53', '2025-04-09 12:14:41', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(514, 26, 122, '4.1.1 የተዘጋጀ መዋቅራዊ ማስተር ፕሊን ጥናት\nሰነዴ\n', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:52:37', '2025-04-09 12:16:38', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(515, 26, 122, '4.1.2 የተቀናጀ የመሰረተ ሌማት የዱዛይን እና ተያያዥ ሰነዴ ብዛት በመቶኛ (የዉሃ፣ የፍሳሽ፣ የኤላክትሪክ፣ የመንገዴ እና የቴላኮም) ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:53:03', '2025-04-09 12:16:43', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(516, 26, 122, '4.1.3 የተጠናቀቀ የከርሰ ምዴር ዉሃ ቁፋሮ የዱዛይን እና ተያያዥ ሰነዴ ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:53:18', '2025-04-09 12:16:48', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(517, 26, 122, '4.1.4 የተጠናቀቀ የዕቃ ማከማቻ መጋዘን እና ወርክ ሾፕ የዱዛይን እና ተያያዥ ሰነዴ ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:53:29', '2025-04-09 12:16:52', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(518, 26, 122, '4.1.5 የተጠናቀቀ B+G+12 ቅይጥ ህንፃ የዱዛይን እና ተያያዥ ሰነዴ ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:55:56', '2025-04-09 12:17:55', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(519, 26, 122, '4.1.6 በፓርኩ የፋይበር መስመር ዱዛይን ሊይ የተከነወነ ማሻሻያ በሰነዴ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:56:05', '2025-04-09 12:18:01', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(520, 26, 122, '4.1.7 የተጠናቀቀ የኤላክትሪከ ሰብስቴሽን ዱዛይንና ተያያዥ ሰነዴ ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:56:37', '2025-04-09 12:18:06', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(521, 26, 122, '4.1.8 የተጠናቀቀ የውስጥ ሇውስጥ አገናኝ መንገዴ ዱዛይንና ተያያዥ ሰነዴ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 11:56:48', '2025-03-13 11:56:48', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(522, 26, 125, '4.2.1 የተገነቡ 2 የግቢ መግቢያ እና መዉጫ ዋና በሮች እና ላልች 3 ተጨማሪ በሮች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:01:32', '2025-04-09 12:18:13', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(523, 26, 125, '4.2.2 በተመረጡ ቦታዎች የተገነቡ የመኪና ማቆሚያዎች ብዛት (ሇ2 አዲዱስ ቦታዎች እና ሇነባር ህንፃዎች አገሌግልት የሚውለ)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:02:14', '2025-03-13 12:02:14', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(524, 26, 125, '4.2.3 የፓርኩን ዯህንነትና ጥበቃ ሇማጠናከር እና ገጽታ ሇመጨመር የተገነባ አጥር (በኪ. ሜትር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:02:23', '2025-03-13 12:02:23', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(525, 26, 125, '4.2.4 ግንባታው የተጠናቀቀ የከርሰ ምዴር ዉሃ ጉዴጓዴ ቁፋሮ (የጉዴጓዴ ብዛት በቁጥር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:02:30', '2025-04-09 12:18:19', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(526, 26, 125, '4.2.5 በ2000 ካሬ ሜትር ቦታ ሊይ የተገነባ የዕቃ ማከማቻ መጋዘን እና ዎርክሾፕ (ብዛት በቁጥር) ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:02:47', '2025-04-09 12:18:25', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(527, 26, 125, '4.2.6 የተገነባ የኤላክትሪክ ሀይሌ ሰብስቴሽን (በሜ.ጋ ዋት) ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:03:02', '2025-04-09 12:18:29', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(528, 26, 125, '4.2.7 ለፌዴራል ፖሉስ መገሌገያ የተገነባ ካምፕ (በቁጥር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:03:36', '2025-04-09 12:18:34', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(529, 26, 125, '4.2.8 የተገነባ ላንዴ ስኬፕ (ብዛት በቁጥር)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:03:59', '2025-04-09 12:18:38', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(530, 26, 125, '4.2.9 የተገነባ የውስጥ የውስጥ አገናኝ መንገዴ በኪ.ሜ. ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:04:19', '2025-04-09 12:18:43', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(531, 26, 125, '4.2.10 ለጥበቃ መገሌገያ የተገነባ የጥበቃ ማማ ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:05:02', '2025-03-13 12:05:02', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(532, 26, 125, '4.2.11 በፓርኩ የተገነባ የቪሳት ሲስተም ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:05:15', '2025-04-09 12:18:48', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(533, 26, 125, '4.2.12 በፓርኩ የተዘረጉ የዯህንነት ካሜራዎች ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:05:31', '2025-04-09 12:18:51', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(534, 26, 125, '4.2.13 አዱስ የኤላክትሪክ ሀይሌ ያገኘ ህንጻ ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:05:46', '2025-04-09 12:18:55', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(535, 26, 125, '4.2.14 አዱስ የውሀ መስመር ያገኘ ህንጻ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:05:59', '2025-04-09 12:18:59', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(536, 26, 126, '4.3.1 የታዯሰ ህንጻ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:12:21', '2025-04-09 12:19:05', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(537, 26, 126, '4.3.2 የህንጻ አገሌግልት መሰረተ-ሌማትና መሰረታዊ ስትራክቸር እዴሳትና ጥገና የተዯረገሇት ህንጻ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:12:37', '2025-04-09 12:19:08', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(538, 26, 126, '4.3.3 ከ15/.4 ወደ 33/.4 ኪሎ ቮልት የተለወጠ ትራንስፎርመር ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:13:30', '2025-04-09 12:19:13', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(539, 26, 126, '4.3.4 ዕዴሳት የተደረገለት ካፊቴሪያ ስፋት በካሬ ሜትር ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:13:58', '2025-03-13 12:13:58', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(540, 26, 126, '4.3.5 ዕዴሳት የተደረገለት ፓምፕ ቤት ስፋት በካሬ ሜትር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:14:25', '2025-03-13 12:14:25', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(541, 26, 126, '4.3.6 እዴሳት የተደረገለት ሊንዴስኬፕ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:14:43', '2025-04-09 12:19:19', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(542, 26, 126, '4.3.7 ጥገና የተደረገለት የመንገዴ መብራት ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:15:12', '2025-04-09 12:19:24', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(543, 26, 126, '4.3.8 በፓርኩ ህንፃዎች በሚኝ Public WiFi ሊይ የተከናወነ ጥገና', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:15:23', '2025-04-09 12:19:28', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(544, 26, 126, '4.3.9 እዴሳት የተደረገለት የዯህንነት ካሜራ ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:15:41', '2025-04-09 12:19:32', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(545, 26, 126, '4.3.10 እዴሳት የተደረገለት የአንዴ መስኮት አገሌግልት ዱጂታሌ ሲስተም ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:16:08', '2025-03-13 12:16:08', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(546, 26, 126, '4.3.11 እዴሳት የተደረገለት የጋራ መገሌገያ አዲራሽ ስፋት በካሬ ሜትር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:16:33', '2025-04-09 12:19:37', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(547, 26, 127, '4.4.1 የተከናወነ የአረንጓዳ ሌማት ሽፋን በሺህ ካ/ሜ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:18:05', '2025-03-13 12:18:05', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(548, 26, 127, '4.4.2 እንክብካቤ የተዯረገሇት የአረንጓዳ ሌማት ሽፋን በሺህ ካ/ሜ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:18:20', '2025-04-09 12:19:42', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(549, 26, 127, '4.4.3 በዓመት አራት ጊዜ በፓርኩ በሚገኙ ዴርጅቶች ሊይ የተካሄዯ የአከባቢ ብክሇት ቁጥጥርና ክትትሌ ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:18:30', '2025-04-09 12:19:45', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(550, 26, 128, '5.1.1 የፓርኩ አደረጃጀት ጥልቀት ባለው ጥናት እስከሚዘጋጅ ዴረስ ስራውን መሸከም በሚችሌ ሁኔታ ተዘጋጅቶ የጸዯቀ ጊዜያዊ አዯረጃጀት ሰነዴ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:20:50', '2025-03-13 12:20:50', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(551, 26, 128, '5.1.2 ጊዜያዊ አደረጃጀትን በመከተሌ በሌዩ ሌዩ ዘዳ የተሟሊ ጠቅሊሊ የሰራተኛ ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:21:11', '2025-04-09 12:20:12', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(552, 26, 128, '5.1.3 በኮርፖሬሽኑ እና በሠራተኞች ስራ አፈጻጸም ውጤት መካከሌ ያሇውን ክፍተት በዲሰሳ ጥናት በመሇየት የተሰጠ የአቅም ግንባታ ስሌጠና ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:21:27', '2025-04-09 12:23:23', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የመማማርና ዕድገት ዕይታ'),
(553, 26, 128, '5.1.4 የመካከልለኛና የረጅም ጊዜ ስሌጠና የተሰጣቸው የኮርፖሬሽኑ ሠራተኞች ብዛት (ሇ3 ሠራተኞች የመካከሇኛ ጊዜ፣ ሇ5 ሠራተኞች የአጭር ጊዜ እና ሇ2 ሠራተኞች የረጅም ጊዜ)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:21:50', '2025-04-09 12:23:29', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የመማማርና ዕድገት ዕይታ'),
(554, 26, 128, '5.1.5 በተመሳሳይ የስራ ባህሪያቸው በተመረጡ ዓሇም አቀፍ ተወዲዲሪ ፓርኮች ጋር በ2 ዙር የሌምዴ ሌውውጥ (ምርጥ ተሞክሮ) የወሰደ የኮርፖሬሽኑ ሠራተኞች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:22:06', '2025-03-13 12:22:06', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, ''),
(555, 26, 128, '5.1.6 ከተለያዩ የሌማት አጋሮች ጋር በመተባር የሥራ ሊይ ሌምምዴ በማዴረግ አቅማቸውን አጎሌብተው እየሰሩ በሚገኙባቸው ዴርጅቶች ውስጥ ባለበት እንዱቆዩ የተዯረጉ ወይም ሥራ ፈጣሪ የሆኑ ሰዎች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:22:22', '2025-04-09 12:23:54', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የመማማርና ዕድገት ዕይታ'),
(556, 26, 128, '5.1.7 የISO ስታንዲርዴ በፓርኩ ሊይ ተግባራዊ ሇማዴረግ የተዘጋጀ የቅዴመ ዝግጅት ሰነዴ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:22:38', '2025-04-09 12:23:58', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የመማማርና ዕድገት ዕይታ'),
(557, 26, 128, '5.1.8 ለፓርኩ የተሰጠ ISO ስታንዲርዴ የምስክር ወረቀት ብዛት በቁጥር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:23:00', '2025-04-09 12:24:07', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የመማማርና ዕድገት ዕይታ'),
(558, 26, 129, '5.2.1 በንዑስ ሉዝ መሬት ከወሰደ ካምፓኒዎች የተሰበሰበ ገቢ (የተፈጸመ የሉዝ ክፍያ) በሺህ ብር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:25:06', '2025-04-09 12:27:41', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(559, 26, 129, '5.2.2 በንዑስ ሉዝ መሬት ከወሰደ ካምፓኒዎች በድሊር የተሰበሰበ ገቢ (የተፈጸመ የሉዝ ክፍያ) በሺህ ድሊር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:25:21', '2025-04-09 12:27:45', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(560, 26, 129, '5.2.3 የህንጻ ኪራይ ከወሰደ ካምፓኒዎች በብር የተሰበሰበ ገቢ (የተፈጸመ የኪራይ ክፍያ) በሺህ ብር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:25:28', '2025-03-13 12:25:28', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(561, 26, 129, '5.2.4 የህንጻ ኪራይ ከወሰደ ካምፓኒዎች በድሊር የተሰበሰበ ገቢ (የተፈጸመ የኪራይ ክፍያ) በሺህ ድሊር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:25:37', '2025-04-09 12:27:53', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(562, 26, 129, '5.2.5 በዕቅድ እየተመራ ሥራ ሊይ የዋለ መበኛ በጀት በሚ ብር ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:25:45', '2025-04-09 14:03:07', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(563, 26, 129, '5.2.6 በዕቅድ እየተመራ ሥራ ሊይ የዋለ ካፒታሌ በጀት በሚ ብር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:25:59', '2025-04-09 14:02:03', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(564, 26, 129, '5.2.7 ከሌሎች የገቢ ምንጮች የተሰበሰበ ገቢ በሺህ ብር ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:26:07', '2025-04-09 14:01:43', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(565, 26, 129, '5.2.8 በግዥ ፍላጎት ላይ በመመስረተ የተዘጋጀ ዕቅድን ተከትል የተፈጸመ የጨረታ ግዥ በጊዜ ድግግሞሽ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:26:16', '2025-04-09 14:01:14', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(566, 26, 130, '5.3.1 የኮርፖሬሽኑ በጀት በአግባቡ ጥቅም ሊይ ስለመዋሉ የተረጋገጠበት የውስጥ ኦዱት ሰነድ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:28:05', '2025-04-09 14:00:13', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(567, 26, 130, '5.3.2 የኮርፖሬሽኑ ዕቃ/አገሌግልት ግዥ በአግባቡ ሰለመካሄዱ የተረጋገጠበት የውስጥ ኦዱት ሰነድ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:28:14', '2025-04-09 13:59:44', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(568, 26, 130, '5.3.3 የኮርፖሬሽኑ ንብረትና የተሸከርካሪ አያያዝና አጠቃቀም በአግባቡ ስአለመፈጸሙ የተረጋገጠበት የውስጥ ኦዱት ሰነድ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:28:24', '2025-04-09 13:59:05', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(569, 26, 131, '5.4.1 የተከናወነ የንብረት ቆጠራና ምዝገባ የተከናወነበት የጊዜ ድግግሞሽ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:29:49', '2025-04-09 13:55:44', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(570, 26, 131, '5.4.2 የሚወገዱ ንብረቶች ተለይተው ለውሳኔ የቀረቡበት ሰነድ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:30:02', '2025-04-09 13:53:06', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(571, 26, 131, '5.4.3 የኮርፖሬሽኑ ሥራ የዋለ የትራንስፖርት አገልግሎት በተሸከርካሪ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:30:40', '2025-04-09 13:51:19', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(572, 26, 132, '5.5.1 በኮርፖሬሽኑ የተዘረጋ የኮርፖሬት ኢንተርፕራይዝ ሪሶርስ ፕሊኒንግ (ERP) ሥርዓት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:32:02', '2025-04-09 13:30:14', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(573, 26, 132, '5.5.2 የተተገበረ የኢንተርፕራይዝ ኢሜይሌ ሥርዓት ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:32:10', '2025-04-09 13:32:02', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(574, 26, 132, '5.5.3 የIT ዘርፉን ታሳቢ በማድረግ ከሚመለከተው አካል ጋር በመተባበር የተከፈተ አንድ ዲጂታል ሊይብረሪ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:32:19', '2025-04-09 13:49:41', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(575, 26, 133, ' 5.6.1 የተከናወነ ሀገር አቀፍ የኢኖቬሽን ውድድር (Innovation challenge) ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:33:48', '2025-04-09 13:48:45', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(576, 26, 133, '5.6.2 ፓርኩን ለማስተዋወቅ ሥራ ሊይ የዋለ የማስታወቂያ ዘዳዎች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:34:13', '2025-03-13 12:34:13', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(577, 26, 134, '5.7.1 በህግ ጉዲዮች ሊይ የተሰጠ የማማከር አገሌግልት ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:37:51', '2025-04-09 13:32:15', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(578, 26, 134, '5.7.2 የተተገበሩ የኮርፖሬሽኑ ጥቅም ማስጠበቂያ ኬዞች ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:37:56', '2025-03-13 12:37:56', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(579, 26, 134, '5.7.3 አዲስ የተፈጸመ የመሬት ንዑስ ሊዝ ውል በሰነድ ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:38:03', '2025-04-09 13:47:09', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(580, 26, 134, '5.7.4 የመሬት ንዑስ ሊዝ ከወሰደ ድርጅቶች ጋር በጥበቃና መሰል ጉዳዮች ላይ የተፈጸመ አዲስ ውል በሰነዴ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:38:15', '2025-04-09 13:46:44', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(581, 26, 134, '5.7.5 አዲስ የተዘጋጁ የህንጻ ኪራይ ውል በውሌ ሰነድ ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:38:23', '2025-04-09 13:47:23', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(582, 26, 134, '5.7.6 የአፈጻጸም ክትትል የተደረገባቸው ሌዩ ሌዩ ውልች በውል ሰነድ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:38:36', '2025-04-09 13:47:16', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(583, 26, 134, '5.7.8 የፓርኩን ጸጥታና ደህንነት የማጠናከር የተዘጋጁ መድረኮች/ስምምነቶች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:38:45', '2025-04-09 13:45:27', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(584, 26, 135, ' 5.8.1 የተዘጋጁ ሌዩ ሌዩ ማንዋልች ብዛት (ከዲዛይንና ግንባታ ፈቃዴ፣ ከባለሀብቶች ህንጻ አጠቃቀም እና ከኪራይ ቢሮ አጠቃቀም ጋር የተያያዘ)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:40:38', '2025-04-09 13:45:01', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(585, 26, 135, '5.8.2 ተሻሽለው የጸደቁ ሰራተኛና አሰሪን የሚመሇከቱ የተሇያዩ መመሪያዎች ብዛት (የሥራ መሪዎች መተዲደሪያ ደንብ፤ የሰራተኞች አስተዲደር፤ የጤናና ጥቅማ ጥቅሞች እንዱሁም የትምህርትና ስሌጠና መመሪያ)', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:40:45', '2025-04-09 13:44:29', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የውስጥ አሰራር ዕይታ'),
(586, 26, 136, '5.9.1 ከትምህርት ተቋማት ጋር የተደረገ ስምምነት ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:43:44', '2025-04-09 13:43:16', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(587, 26, 136, '5.9.2 በአይሲቲ ዘርፍ ከተደራጁ ማህበራት ጋር የተደረገ ስምምነት ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:43:51', '2025-04-09 13:42:55', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(588, 26, 136, '5.9.3 ከልማት አጋሮች ጋር የተደረገ ስምምነት ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:43:57', '2025-04-09 13:42:37', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(589, 26, 136, '5.9.4 ከአገልግሎት ሰጪ ድርጅቶች ጋር የተዯረገ ስምምነት ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:44:04', '2025-04-09 13:42:22', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(590, 26, 136, '5.9.5 ከአለም አቀፍ ድርጅቶችና ማህበራት ጋር የተፈጠረ ትብብር ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:44:35', '2025-04-09 13:41:58', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(591, 26, 136, '5.9.6 የተፈጠረ ስትራተጂያዊ ሽርክና/ ፓርትነርሽፕ ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:44:51', '2025-04-09 13:33:58', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የተገልጋይ ዕይታ'),
(592, 26, 137, '5.10.1 በጥናት የተለዩ የቢዝነስ እድሎች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:46:24', '2025-04-09 13:41:38', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(593, 26, 137, '5.10.2 ከተባባሪዎች ጋር የሇሙ የቢዝነስ እዴሎች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:46:32', '2025-04-09 13:39:47', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(594, 26, 137, '5.10.3 ከፓርኩ ንዋሪዎች ጋር የተተገበሩ የገቢ ስራዎቸ ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:46:41', '2025-03-13 12:46:41', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(595, 26, 137, '5.10.4 ከፓርኩ ንዋሪዎች ጋር በትብብር በመስራት የተገኘ ገቢ በሺህ ብር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:46:49', '2025-04-09 13:35:21', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(596, 26, 137, '5.10.5 ለነዋሪዎች የሚቀርቡ አገልግሎቶችን ዋጋ ለመተመን የተደረገ ጥናት ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:47:14', '2025-04-09 13:39:21', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(597, 26, 137, '5.10.6 ለነዋሪዎች በክፍያ ከሚቀርቡ አገሌግልቶች የተገኘ ገቢ በሺህ ብር', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:47:33', '2025-04-09 13:35:29', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(598, 26, 138, '5.11.1 የተዘጋጁ የገንዘብ ማፈላለጊያ \nፕሮፖዛልች ብዛት ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:49:21', '2025-04-09 13:38:57', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(599, 26, 138, '5.11.2 የተተገበሩ የገቢ ማስገኛ ፕሮጅክቶች ብዛት', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:49:28', '2025-04-09 13:35:38', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ'),
(600, 26, 138, '5.11.3 ከለጋሽ/ተባባሪ አካሊት የተገኘ ዴጋፍ \nበሺህ ብር ', NULL, NULL, NULL, NULL, 0.00, '2025-03-13 12:49:38', '2025-04-09 13:37:41', 'Q1', NULL, '', 0, '', 0, 'started', NULL, NULL, 'የፋይናንስ ዕይታ');

-- --------------------------------------------------------

--
-- Table structure for table `specific_objective_details`
--

CREATE TABLE `specific_objective_details` (
  `specific_objective_detail_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `specific_objective_detailname` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `baseline` varchar(255) DEFAULT NULL,
  `plan` text DEFAULT NULL,
  `measurement` text DEFAULT NULL,
  `execution_percentage` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `year` int(11) NOT NULL,
  `month` int(11) DEFAULT NULL,
  `day` int(11) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `priority` varchar(20) NOT NULL,
  `department_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `count` int(100) NOT NULL,
  `outcome` decimal(10,2) DEFAULT NULL,
  `progress` enum('started','on going','completed') NOT NULL DEFAULT 'started',
  `created_by` varchar(255) NOT NULL,
  `specific_objective_id` int(11) DEFAULT NULL,
  `plan_type` varchar(255) DEFAULT NULL,
  `income_exchange` varchar(255) DEFAULT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `incomeName` varchar(255) DEFAULT NULL,
  `costName` varchar(255) DEFAULT NULL,
  `attribute` text DEFAULT NULL,
  `CIbaseline` decimal(10,2) DEFAULT NULL,
  `CIplan` decimal(10,2) DEFAULT NULL,
  `CIoutcome` decimal(10,2) DEFAULT NULL,
  `CIexecution_percentage` decimal(5,2) DEFAULT NULL,
  `editing_status` enum('active','deactivate') NOT NULL DEFAULT 'deactivate',
  `reporting` enum('active','deactivate') NOT NULL DEFAULT 'deactivate',
  `goal_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specific_objective_details`
--

INSERT INTO `specific_objective_details` (`specific_objective_detail_id`, `user_id`, `specific_objective_detailname`, `details`, `baseline`, `plan`, `measurement`, `execution_percentage`, `created_at`, `updated_at`, `year`, `month`, `day`, `deadline`, `status`, `priority`, `department_id`, `name`, `description`, `count`, `outcome`, `progress`, `created_by`, `specific_objective_id`, `plan_type`, `income_exchange`, `cost_type`, `employment_type`, `incomeName`, `costName`, `attribute`, `CIbaseline`, `CIplan`, `CIoutcome`, `CIexecution_percentage`, `editing_status`, `reporting`, `goal_id`) VALUES
(683, 38, 'መሬት በሊዝ ወስደው በፓርኩ የሚገኙ ድርጅቶች የፈጠሩት ቋሚ ስራ እድል።', 'መሬት በሊዝ ወስደው በፓርኩ የሚገኙ ድርጅቶች የፈጠሩት ቋሚ ስራ እድል።', '0', '500', 'performance', 0.00, '2025-04-11 11:23:27', '2025-04-15 08:37:58', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 0.00, 'started', 'Samuel ', 461, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 87),
(684, 38, 'የ ህንጻ ኪራይ በወሰዱ በፓርኩ የሚገኙ ድርጅቶች የፈጠሩት ቋሚ ስራ እድል።', 'የ ህንጻ ኪራይ በወሰዱ በፓርኩ የሚገኙ ድርጅቶች የፈጠሩት ቋሚ ስራ እድል።', '0', '100', 'performance', 0.00, '2025-04-11 11:37:30', '2025-04-15 08:38:02', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 0.00, 'started', 'Samuel ', 462, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 'deactivate', 'deactivate', 87),
(685, 38, 'በ ፓርኩ የሚገኙ ድርጀቶች ስራ ጋር ተያይዞ በተጓዳኝ የተፈጠረ የስራ እድል በሰው ብዛት', 'በ ፓርኩ የሚገኙ ድርጀቶች ስራ ጋር ተያይዞ በተጓዳኝ የተፈጠረ የስራ እድል በሰው ብዛት', '0', '100', 'performance', NULL, '2025-04-11 11:44:09', '2025-04-15 08:41:04', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, NULL, 'started', 'Samuel ', 463, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, 'deactivate', 'deactivate', 87),
(686, 38, 'በንዑስ ሊዝ መሬት በወሰደ እና ቢሮ በተከራየ አልሚ ካምፓኒዎች የተፈጠረ ቀጥተኛ የውጭ ኢንቨስትመንት (በሚሉዮን ዶላር)', 'በንዑስ ሊዝ መሬት በወሰደ እና ቢሮ በተከራየ አልሚ ካምፓኒዎች የተፈጠረ ቀጥተኛ የውጭ ኢንቨስትመንት (በሚሉዮን ዶላር)', '0', '49000000', 'USD', 0.36, '2025-04-11 12:08:22', '2025-04-14 12:16:45', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 178627.70, 'started', 'Samuel ', 465, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 87),
(687, 38, 'በንዑስ ሉዝ መሬት በወሰደ እና ቢሮ በተከራዩ አሌሚ ካምፓኒዎች የተፈጠረ የሀገር ውስጥ ኢንቨስትመንት (በሚሉዮን ብር)', 'በንዑስ ሉዝ መሬት በወሰደ እና ቢሮ በተከራዩ አሌሚ ካምፓኒዎች የተፈጠረ የሀገር ውስጥ ኢንቨስትመንት (በሚሉዮን ብር)', '0', '50000000', 'ETB', 110.10, '2025-04-11 12:10:57', '2025-04-14 12:26:03', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 55050000.00, 'started', 'Samuel ', 466, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 87),
(688, 38, 'የቴክኖልጂ ሽግግር ለማዴረግ የሰለጠኑ ሰልጣኞች ብዛት', 'የቴክኖልጂ ሽግግር ለማዴረግ የሰለጠኑ ሰልጣኞች ብዛት', '0', '35', 'number', 125.71, '2025-04-11 12:14:39', '2025-04-14 12:30:49', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 44.00, 'started', 'Samuel ', 467, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(689, 38, ' በንዑስ ሉዝ መሬት ከወሰደ ካምፓኒዎች ምርት/አገሌግልት ሽያጭ የተገኘ የወጪ ንግድ ገቢ (በሚሉዮን ዶላርር)', ' በንዑስ ሉዝ መሬት ከወሰደ ካምፓኒዎች ምርት/አገሌግልት ሽያጭ የተገኘ የወጪ ንግዴ ገቢ (በሚሉዮን ድሊር)', '0', '8000000', 'USD', 0.00, '2025-04-11 12:24:23', '2025-04-14 12:33:01', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 0.00, 'started', 'Samuel ', 474, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(690, 38, 'የህንጻ ኪራይ ከወሰደ ካምፓኒዎች ምርት/አገሌግልት ሽያጭ የተገኘ የወጪ ንግዴ ገቢ (በሚሉዮን ዶላር)', 'የህንጻ ኪራይ ከወሰደ ካምፓኒዎች ምርት/አገልግሎት ሽያጭ የተገኘ የወጪ ንግዴ ገቢ (በሚሉዮን ዶላር)', '0', '2000000', 'USD', 0.00, '2025-04-11 12:32:11', '2025-04-14 12:33:43', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 0.00, 'started', 'Samuel ', 475, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(691, 38, 'በሀገር ውስጥ የተመረተ ተተኪ ምርት/አገልግሎት ዓይነት ብዛት', 'በሀገር ውስጥ የተመረተ ተተኪ ምርት/አገልግሎት ዓይነት ብዛት', '0', '2', 'number', 100.00, '2025-04-11 12:35:43', '2025-04-14 12:34:17', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 2.00, 'started', 'Samuel ', 477, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(692, 38, 'ተተኪ ምርት/አገሌግልት በሀገር ውስጥ ያመረቱ ካምፓኒዎች ብዛት በቁጥር', 'ተተኪ ምርት/አገሌግልት በሀገር ውስጥ ያመረቱ ካምፓኒዎች ብዛት በቁጥር', '0', '8', 'number', 37.50, '2025-04-11 12:37:25', '2025-04-14 12:36:13', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 3.00, 'started', 'Samuel ', 478, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(693, 38, 'በሀገር ውስጥ ከተሸጠ ተተኪ ምርት ሽያጭ የተገኘ ጠቅሊሊ ገቢ (በቢሉዮን ብር)', 'በሀገር ውስጥ ከተሸጠ ተተኪ ምርት ሽያጭ የተገኘ ጠቅላላ ገቢ (በቢሉዮን ብር)', '0', '0.75', 'ETB', 46.00, '2025-04-11 12:40:21', '2025-04-14 12:41:14', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 0.35, 'started', 'Samuel ', 479, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(694, 38, 'የቴክኖልጂ ሽግግር ሇማዴረግ የተፈጠረ ሥሌጠና ብዛት በዓይነት', 'የቴክኖልጂ ሽግግር ሇማዴረግ የተፈጠረ ሥሌጠና ብዛት በዓይነት', '0', '3', 'number', 166.67, '2025-04-11 12:42:42', '2025-04-14 12:43:28', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 5.00, 'started', 'Samuel ', 468, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(695, 38, ' የተሇየ የቴክኖልጂ ብቃት ይዞ ከውጭ ሀገር የመጣ ባሇሙያን መተካት የቻለ የሀገር ውስጥ ባለሙያ ብዛት በቁጥር', ' የተሇየ የቴክኖልጂ ብቃት ይዞ ከውጭ ሀገር የመጣ ባሇሙያን መተካት የቻለ የሀገር ውስጥ ባለሙያ ብዛት በቁጥር', '0', '3', 'number', 800.00, '2025-04-11 12:44:26', '2025-04-14 12:50:28', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 24.00, 'started', 'Samuel ', 469, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(696, 38, 'በተለየ የቴክኖልጂ ብቃት ሰርቲፋይዴ የሆነ (የብቃት ማረገጋገጫ ዕውቅና ያገኘ) ባለሙያ ብዛት በቁጥር', 'በተለየ የቴክኖልጂ ብቃት ሰርቲፋይዴ የሆነ (የብቃት ማረገጋገጫ ዕውቅና ያገኘ) ባለሙያ ብዛት በቁጥር', '0', '1', 'number', 999.99, '2025-04-11 12:46:56', '2025-04-14 17:14:21', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 72.00, 'started', 'Samuel ', 470, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(697, 38, ' በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ጥበቃ ያገኘ ባለሙያ ብዛት በቁጥር', ' በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ጥበቃ ያገኘ ባለሙያ ብዛት በቁጥር', '0', '0', 'number', NULL, '2025-04-11 12:49:41', '2025-04-11 12:49:41', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, NULL, 'started', 'Samuel ', 471, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'deactivate', 'deactivate', 88),
(698, 38, 'በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ምዝገባ ያገኘ ዴርጅት ብዛት በቁጥር', 'በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ምዝገባ ያገኘ ዴርጅት ብዛት በቁጥር', '0', '0', 'number', 0.00, '2025-04-11 12:51:13', '2025-04-14 13:38:56', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 0.00, 'started', 'Samuel ', 472, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88),
(699, 38, 'በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ማመልከቻ ያቀረበ ባለሙያ ዴርጅት ብዛት በቁጥር', 'በኢንፎርሜሽን ቴክኖልጂ ዘርፍ የአዕምሯዊ ንብረት ማመልከቻ ያቀረበ ባለሙያ ዴርጅት ብዛት በቁጥር', '0', '2', 'number', 0.00, '2025-04-11 12:55:06', '2025-04-14 13:50:05', 2017, 5, 1, '2017-07-30', 'Pending', '', 2, '', '', 0, 0.00, 'started', 'Samuel ', 473, 'default_plan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 'deactivate', 'deactivate', 88);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `status` enum('1','0') DEFAULT '1',
  `online_flag` tinyint(1) DEFAULT 0,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role_id` int(11) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `employee_id`, `user_name`, `password`, `created_at`, `status`, `online_flag`, `updated_at`, `role_id`, `avatar_url`) VALUES
(6, 49, 'senayt@itpark.et', '$2b$10$ktd.Y1lVFq4EOyoKkDZnhu6yJ1JNWBykmrpmFUKMBsSo4b4/IP/7K', '2024-11-11 23:41:28', '1', 0, '2025-04-11 06:25:16', 3, '/uploads/1743579206516-photo_2025-04-02_00-29-51.jpg'),
(7, 50, 'simegn@itpark.et', '$2b$10$6SbuHMtP7XMbwVdakqMr1eTCY9QIhHxabIBHgI.CZpN9wqROs8rr6', '2024-11-11 23:44:17', '1', 0, '2025-06-29 23:56:38', 5, '/uploads/1743578325155-photo_2025-04-02_00-17-31.jpg'),
(13, 58, 'nebyat@itpark.et', '$2b$10$5X.XMQQMRay/6zJDdEReI.MLzAcq.ed9xBk5OO4UELVvaG2fckm5K', '2024-11-14 01:06:52', '1', 0, '2025-04-08 11:27:56', 6, '/uploads/1743579067141-photo_2025-04-02_00-29-51.jpg'),
(24, 71, 'adminadmin@itp.et', '$2b$10$b5EbPdhsv7X8E9Aekdzv/eHngE6qS/57Irctvr/4xXVfYzY6Dp2ae', '2025-03-09 07:25:00', '1', 1, '2025-08-12 15:36:30', 1, '/uploads/1744027060876-hayal.jpg'),
(25, 72, 'henok@itp.et', '$2b$10$zIyhU/Zh7zj33VZA.m8NsOC5sdIN95EBB7SejpM10VZUjk2Kk/oVu', '2025-03-09 07:31:21', '1', 0, '2025-08-12 15:32:10', 2, '/uploads/1743516026428-henok.jpg'),
(26, 73, 'getachew@itp.et', '$2b$10$RRnJrr5To6jpJYjhCQZtUOI2Lq58h.ZXwDZknfVfSdJ0RdjPysqZq', '2025-03-09 07:32:30', '1', 0, '2025-08-12 15:33:50', 9, '/uploads/1743579384865-photo_2025-04-02_00-30-25.jpg'),
(27, 74, 'habtamua@itp.et', '$2b$10$XQS7x6DJBK0WDrManmY15u4WX07d5QJ.StT.JjnLom86FKXhbUHL6', '2025-03-13 04:26:03', '1', 0, '2025-04-08 11:28:30', 6, NULL),
(30, 77, 'walelign@itp.et', '$2b$10$y4f7LsF5rsigVqFj.yTmMOO162DWm0Og7UKPwMZQ5mvD1nKfI/eya', '2025-03-28 04:42:16', '1', 0, '2025-03-28 05:20:13', 6, NULL),
(36, 104, 'merso@itpark.et', '$2b$10$QwZKF6X8DeaYv0aG2Ck.ZurxabUhg7C6oSZObgqz2jxenA6oG3tgC', '2025-04-08 11:09:57', '1', 0, '2025-04-09 11:09:33', 6, NULL),
(37, 106, 'eskedar@itpark.et', '$2b$10$RFIb4x3.YaOAMKLfdcc.f.Fx0.sWIM53Wd/yJnnxkFtZWYH9apFVK', '2025-04-08 11:10:59', '1', 0, '2025-06-29 23:55:34', 6, '/uploads/1744374354484-photo_2025-04-02_00-29-51.jpg'),
(38, 107, 'samuel@itpark.et', '$2b$10$NAJiyQBLPjs3I4mLihlcre0YQr6jvEPD7xVqqDUWwu4VU2gCrS.li', '2025-04-08 11:12:41', '1', 0, '2025-06-29 23:50:37', 8, '/uploads/1744370443189-photo_2025-04-11_03-52-50.jpg'),
(39, 108, 'yesuf@itpark.et', '$2b$10$oJA4cwtDhG9U0P7qAuF0ju8iRuXmiKZIVWQV1FKkr4XgrqFqwzAs2', '2025-04-08 11:13:55', '1', 0, '2025-04-08 11:13:55', 8, NULL),
(40, 109, 'ezira@itpark.et', '$2b$10$Aewol/o0/lNUINI0oa18ueWl0BNcTCE5E36e6RjDW2AKEJ0c1gw5W', '2025-04-08 11:14:19', '1', 0, '2025-04-09 11:09:50', 1, '/uploads/1744100138308-photo_2025-04-02_00-30-25.jpg'),
(41, 110, 'yosef@itpark.et', '$2b$10$2SSKh6sgwhBG5g3zf2J1Heb9RO./BOH99gUdpBs7BSwe7ze.kxCy6', '2025-04-08 11:25:58', '1', 0, '2025-04-08 11:25:58', 8, NULL),
(42, 111, 'sintayew@itpark.et', '$2b$10$sodAFnSejmX/2YYA1xvvX.mrqrEj/.NXyyQP9Skmk3uVcElDIM5AS', '2025-04-08 11:28:45', '1', 0, '2025-04-08 11:28:45', 8, NULL),
(43, 112, 'arega@itpark.et', '$2b$10$3urSF/9HQVwO/LAbIvqrZOjqgt8QTp0LQYDbvZf1J5R728BmXPrX2', '2025-04-08 11:30:32', '1', 0, '2025-04-08 11:30:32', 8, NULL),
(44, 113, 'birtukan@itpark.et', '$2b$10$qVEVJJQyc8z.HDU/DeFEeeT4wWEtkIOf8Bb5chESXh.FSdWWrUIL2', '2025-04-08 11:32:07', '1', 0, '2025-04-08 11:32:07', 8, NULL),
(45, 114, 'sisaynesh@itpark.et', '$2b$10$THEpmJgJlnYMPb4hxtRfSeQKEWGypX755IJ4rBbppv9XMzf9BXAlW', '2025-04-08 11:33:29', '1', 0, '2025-04-08 11:33:29', 8, NULL),
(46, 115, 'yetemegn@itpark.et', '$2b$10$yvlUCiePJuwdupdsmD2cou0bqiuy0Ew2myO/rpvSWaSkfyTP44QHC', '2025-04-08 11:36:44', '1', 0, '2025-04-08 11:36:44', 8, NULL),
(47, 116, 'ermiasketeme@itpark.et', '$2b$10$peonxfeeYUyrpK5rMqjn3.iHFYyqhQW.Hf8lIFs4MwpNBDx/0.uMC', '2025-04-08 11:49:23', '1', 0, '2025-04-08 11:49:23', 5, NULL),
(48, 117, 'hayal@itpark.et', '$2b$10$cGjccRkN7zFCXGuwXxGL7.1eoMEqAOQqNG3nV0yqxdAF233QhizdG', '2025-04-08 12:05:57', '1', 1, '2025-06-29 23:57:45', 8, '/uploads/1744189498550-hayal.jpg'),
(49, 118, 'desta@itpark.et', '$2b$10$GDyZerrIK.lkz8qE8nWnhe.KhhnZavLZID7fv.i9Qt/v.zqlSiP5m', '2025-04-08 12:14:44', '1', 0, '2025-04-08 12:14:44', 6, NULL),
(50, 119, 'sintayehu@itpark.et', '$2b$10$DXzaFBncpcI0Wlxoms4d2uHqkB5n6l4BQ/Dy0tvaR/D3Wc5q0b5cS', '2025-04-08 12:19:13', '1', 0, '2025-04-08 12:19:13', 8, NULL),
(51, 120, 'kasu@itpark.et', '$2b$10$QnCoXOk6z.hvB4R4LFNQGOeJ35ECgtjlMfJQ6ulUYbVqjJ991nQnW', '2025-04-08 12:20:08', '1', 0, '2025-04-08 12:20:08', 8, NULL),
(52, 122, 'wonde@itpark.et', '$2b$10$NKrqmG4UP8J3E2eAeCsmceUewxhxRDjf8DVYom3gUopacNuchemK2', '2025-04-08 12:21:20', '1', 0, '2025-04-08 12:21:20', 8, NULL),
(53, 123, 'eyasu@itpark.et', '$2b$10$MYOsvGOV5Ag5/3FWWwegCeI.1o53bAK.Pe6NB4c/k5kecxAZTng72', '2025-04-08 12:21:59', '1', 0, '2025-04-08 12:21:59', 8, NULL),
(54, 125, 'alemayehu@itpark.et', '$2b$10$kHtidFBJS1lAeZAk3N6YFelEa1oSasxbK.rZ.kpHYqTsjrKHKuLEa', '2025-04-08 12:22:49', '1', 0, '2025-04-08 12:22:49', 8, NULL),
(55, 126, 'amanuelgirma@itpark.et', '$2b$10$z0VNMfDBGITbhXjnZEix6.fNJ4vZe2mSCm5jq8eUtqvzqDYvpfI6e', '2025-04-08 12:23:02', '1', 0, '2025-04-08 12:23:02', 8, NULL),
(56, 128, 'mihretu@itpark.et', '$2b$10$02heLI.ZhHYA6xyLnVYQ..Upk6l4Wa3RiA4PikPPIS.IPAnrF3Q5W', '2025-04-08 12:24:43', '1', 0, '2025-04-08 12:24:43', 8, NULL),
(57, 129, 'birhanu@itpark.et', '$2b$10$.6BH8eoPUmUCSgalbq7n8eYHn/vmnP7s2FMKqg6vt6UfiFiDjzolq', '2025-04-08 12:25:15', '1', 0, '2025-04-08 12:25:15', 8, NULL),
(58, 130, 'melatbezu@itpark.et', '$2b$10$RoTkA75XfPYfmuD80a56MuZukYym9MwJwnUomrW42Idgvks25nTcG', '2025-04-08 12:26:35', '1', 0, '2025-04-08 12:26:35', 8, NULL),
(59, 131, 'teshale@itpark.et', '$2b$10$Ut269nuOctgezvVyFlId7.2vkAf8OX9Q6V/tSIWjvhe3M0ofvTS9m', '2025-04-08 14:07:18', '1', 0, '2025-04-08 14:07:18', 8, NULL),
(60, 132, 'getahun@itpark.et', '$2b$10$SsYR7VDhQ3oYPjyRwx9RveG.kK1X4GaGyzhuyzOgIIcMwBF2OqMYe', '2025-04-08 14:08:25', '1', 0, '2025-04-08 14:08:25', 8, NULL),
(61, 133, 'gelana@itpark.et', '$2b$10$szx/h08/Hs3A0u0lsDUW6uLCv1fP506gQ3ODzfcMWI8MfxIoL2qMO', '2025-04-08 14:09:36', '1', 0, '2025-04-08 14:09:36', 8, NULL),
(62, 134, 'tsehay@itpark.et', '$2b$10$UGNnzRoo2F0NLTaHAN9TQOqBKcgQ6FIyhk4y2klqnVV5q7rQlYth.', '2025-04-08 14:10:42', '1', 0, '2025-04-08 14:10:42', 8, NULL),
(63, 135, 'lemlem@itpark.et', '$2b$10$ZlacPpG7.rxebiyTjonEju4F/pfO6I.tN9z6Y3ibkUnMFUpvh92fa', '2025-04-08 14:11:58', '1', 0, '2025-04-08 14:11:58', 8, NULL),
(64, 136, 'walelign@itpark.et', '$2b$10$h6T1aGfli.4J81Rs8HD2FeEgebEiOSIvUU9gAhOR.SpNA0bk6UOgG', '2025-04-08 14:15:49', '1', 0, '2025-04-08 14:15:49', 8, NULL),
(65, 137, 'fetane@itpark.et', '$2b$10$hFVSW71vOYvYZV.T7.YLgum32E83vV58USL5bBEycOxTC8EFdzqsu', '2025-04-08 14:18:37', '1', 0, '2025-04-08 14:18:37', 8, NULL),
(66, 138, 'petros@itpark.et', '$2b$10$CL6oomef/SmALzPCWPyW2eyAcRkLXnnNRYpSX4oGbtJ0h5FD7dCRG', '2025-04-08 16:04:45', '1', 0, '2025-04-08 16:04:45', 8, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approvalhierarchy`
--
ALTER TABLE `approvalhierarchy`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `next_role_id` (`next_role_id`);

--
-- Indexes for table `approvalworkflow`
--
ALTER TABLE `approvalworkflow`
  ADD PRIMARY KEY (`approvalworkflow_id`),
  ADD KEY `plan_id` (`plan_id`),
  ADD KEY `approver_id` (`approver_id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`conversation_id`);

--
-- Indexes for table `cost`
--
ALTER TABLE `cost`
  ADD PRIMARY KEY (`cost_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `supervisor_id` (`supervisor_id`),
  ADD KEY `employees_ibfk_2` (`department_id`),
  ADD KEY `idx_employee_id` (`employee_id`);

--
-- Indexes for table `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`goal_id`);

--
-- Indexes for table `income`
--
ALTER TABLE `income`
  ADD PRIMARY KEY (`income_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `conversation_id` (`conversation_id`);

--
-- Indexes for table `objectives`
--
ALTER TABLE `objectives`
  ADD PRIMARY KEY (`objective_id`),
  ADD KEY `fk_goals` (`goal_id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`plan_id`),
  ADD UNIQUE KEY `plan_id` (`plan_id`),
  ADD KEY `FK_employee_id` (`employee_id`),
  ADD KEY `fk_goal` (`goal_id`),
  ADD KEY `fk_objective` (`objective_id`),
  ADD KEY `fk_specific_objective` (`specific_objective_id`),
  ADD KEY `fk_user` (`user_id`),
  ADD KEY `fk_department` (`department_id`),
  ADD KEY `fk_specific_objective_detail` (`specific_objective_detail_id`);

--
-- Indexes for table `reportfile`
--
ALTER TABLE `reportfile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `specific_objective_id` (`specific_objective_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `specific_objectives`
--
ALTER TABLE `specific_objectives`
  ADD PRIMARY KEY (`specific_objective_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_specific_objectives_objective_id` (`objective_id`),
  ADD KEY `idx_income_id` (`income_id`),
  ADD KEY `idx_cost_id` (`cost_id`);

--
-- Indexes for table `specific_objective_details`
--
ALTER TABLE `specific_objective_details`
  ADD PRIMARY KEY (`specific_objective_detail_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_specific_objective_detail_specific_objective_id` (`specific_objective_id`),
  ADD KEY `fk_specific_objective_details_goal` (`goal_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`user_name`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `fk_role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `approvalhierarchy`
--
ALTER TABLE `approvalhierarchy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `approvalworkflow`
--
ALTER TABLE `approvalworkflow`
  MODIFY `approvalworkflow_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `conversation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cost`
--
ALTER TABLE `cost`
  MODIFY `cost_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT for table `goals`
--
ALTER TABLE `goals`
  MODIFY `goal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `income`
--
ALTER TABLE `income`
  MODIFY `income_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `objectives`
--
ALTER TABLE `objectives`
  MODIFY `objective_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `reportfile`
--
ALTER TABLE `reportfile`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `specific_objectives`
--
ALTER TABLE `specific_objectives`
  MODIFY `specific_objective_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=602;

--
-- AUTO_INCREMENT for table `specific_objective_details`
--
ALTER TABLE `specific_objective_details`
  MODIFY `specific_objective_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=700;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `approvalhierarchy`
--
ALTER TABLE `approvalhierarchy`
  ADD CONSTRAINT `approvalhierarchy_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `approvalhierarchy_ibfk_3` FOREIGN KEY (`next_role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `approvalworkflow`
--
ALTER TABLE `approvalworkflow`
  ADD CONSTRAINT `approvalworkflow_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`plan_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `approvalworkflow_ibfk_3` FOREIGN KEY (`approver_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`) ON DELETE CASCADE;

--
-- Constraints for table `objectives`
--
ALTER TABLE `objectives`
  ADD CONSTRAINT `fk_goals` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`goal_id`) ON DELETE CASCADE;

--
-- Constraints for table `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `FK_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `fk_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_goal` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`goal_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_objective` FOREIGN KEY (`objective_id`) REFERENCES `objectives` (`objective_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_specific_objective` FOREIGN KEY (`specific_objective_id`) REFERENCES `specific_objectives` (`specific_objective_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_specific_objective_detail` FOREIGN KEY (`specific_objective_detail_id`) REFERENCES `specific_objective_details` (`specific_objective_detail_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `reportfile`
--
ALTER TABLE `reportfile`
  ADD CONSTRAINT `reportfile_ibfk_1` FOREIGN KEY (`specific_objective_id`) REFERENCES `specific_objective_details` (`specific_objective_detail_id`) ON DELETE CASCADE;

--
-- Constraints for table `specific_objectives`
--
ALTER TABLE `specific_objectives`
  ADD CONSTRAINT `specific_objectives_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `specific_objective_details`
--
ALTER TABLE `specific_objective_details`
  ADD CONSTRAINT `fk_specific_objective_detail_specific_objective_id` FOREIGN KEY (`specific_objective_id`) REFERENCES `specific_objectives` (`specific_objective_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_specific_objective_details_goal` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`goal_id`),
  ADD CONSTRAINT `specific_objective_detail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;
-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `path` varchar(255) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `path`, `icon`, `parent_id`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
-- Main Dashboard
(1, 'Dashboard', '/', 'bi-speedometer2', NULL, 1, 1, NOW(), NOW()),

-- User Management Section
(2, 'User Management', '#', 'bi-people', NULL, 2, 1, NOW(), NOW()),
(3, 'Add Employee', '/EmployeeForm', 'bi-person-plus', 2, 1, 1, NOW(), NOW()),
(4, 'Manage Accounts', '/UserTable', 'bi-table', 2, 2, 1, NOW(), NOW()),
(5, 'User Registration', '/UserForm', 'bi-person-add', 2, 3, 1, NOW(), NOW()),

-- Reports Section
(6, 'Reports', '#', 'bi-file-earmark-text', NULL, 3, 1, NOW(), NOW()),
(7, 'Analytics', '/reports/analytics', 'bi-graph-up', 6, 1, 1, NOW(), NOW()),
(8, 'Export Data', '/reports/export', 'bi-download', 6, 2, 1, NOW(), NOW()),

-- Planning & Strategy Section
(9, 'Planning & Strategy', '#', 'bi-diagram-3', NULL, 4, 1, NOW(), NOW()),
(10, 'Plans', '/plan/View', 'bi-clipboard-check', 9, 1, 1, NOW(), NOW()),
(11, 'Goals', '/goals', 'bi-bullseye', 9, 2, 1, NOW(), NOW()),
(12, 'Objectives', '/objectives', 'bi-target', 9, 3, 1, NOW(), NOW()),

-- CEO Management (for CEO role)
(13, 'CEO Dashboard', '/ceo/dashboard', 'bi-building', NULL, 5, 1, NOW(), NOW()),
(14, 'Organization Plans', '/ceo/plans', 'bi-diagram-2', 13, 1, 1, NOW(), NOW()),
(15, 'Strategic Reports', '/ceo/reports', 'bi-file-earmark-bar-graph', 13, 2, 1, NOW(), NOW()),

-- Team Leadership (for Team Leaders)
(16, 'Team Management', '#', 'bi-people-fill', NULL, 6, 1, NOW(), NOW()),
(17, 'Team Dashboard', '/team/dashboard', 'bi-kanban', 16, 1, 1, NOW(), NOW()),
(18, 'Team Plans', '/team/plans', 'bi-list-check', 16, 2, 1, NOW(), NOW()),
(19, 'Team Reports', '/team/reports', 'bi-clipboard-data', 16, 3, 1, NOW(), NOW()),

-- Staff Operations (for Staff/Employees)
(20, 'My Workspace', '#', 'bi-person-workspace', NULL, 7, 1, NOW(), NOW()),
(21, 'My Plans', '/staff/plans', 'bi-journal-check', 20, 1, 1, NOW(), NOW()),
(22, 'My Reports', '/staff/reports', 'bi-journal-text', 20, 2, 1, NOW(), NOW()),
(23, 'My Tasks', '/staff/tasks', 'bi-check2-square', 20, 3, 1, NOW(), NOW()),

-- System Administration
(24, 'System Administration', '#', 'bi-gear-fill', NULL, 8, 1, NOW(), NOW()),
(25, 'Settings', '/settings', 'bi-gear', 24, 1, 1, NOW(), NOW()),
(26, 'Menu Permissions', '/menu-permissions', 'bi-shield-lock', 24, 2, 1, NOW(), NOW()),
(27, 'System Logs', '/admin/logs', 'bi-file-text', 24, 3, 1, NOW(), NOW()),
(28, 'Backup & Restore', '/admin/backup', 'bi-cloud-arrow-up', 24, 4, 1, NOW(), NOW()),

-- Profile & Account
(29, 'Profile', '/ProfilePictureUpload', 'bi-person-circle', NULL, 9, 1, NOW(), NOW()),

-- Communication & Collaboration
(30, 'Communication', '#', 'bi-chat-dots', NULL, 10, 1, NOW(), NOW()),
(31, 'Messages', '/messages', 'bi-envelope', 30, 1, 1, NOW(), NOW()),
(32, 'Notifications', '/notifications', 'bi-bell', 30, 2, 1, NOW(), NOW()),

-- Finance & Resources (if applicable)
(33, 'Finance & Resources', '#', 'bi-currency-dollar', NULL, 11, 1, NOW(), NOW()),
(34, 'Budget Planning', '/finance/budget', 'bi-calculator', 33, 1, 1, NOW(), NOW()),
(35, 'Resource Allocation', '/finance/resources', 'bi-pie-chart', 33, 2, 1, NOW(), NOW()),

-- Help & Support
(36, 'Help & Support', '#', 'bi-question-circle', NULL, 12, 1, NOW(), NOW()),
(37, 'Documentation', '/help/docs', 'bi-book', 36, 1, 1, NOW(), NOW()),
(38, 'Support Tickets', '/help/tickets', 'bi-headset', 36, 2, 1, NOW(), NOW());

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `can_view` tinyint(1) DEFAULT 1,
  `can_create` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions` (Default permissions for each role)
--

-- Admin (role_id = 1) - Full access to all menus
INSERT INTO `role_permissions` (`role_id`, `menu_item_id`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
-- Core System
(1, 1, 1, 1, 1, 1), -- Dashboard
(1, 2, 1, 1, 1, 1), -- User Management
(1, 3, 1, 1, 1, 1), -- Add Employee
(1, 4, 1, 1, 1, 1), -- Manage Accounts
(1, 5, 1, 1, 1, 1), -- User Registration
(1, 6, 1, 1, 1, 1), -- Reports
(1, 7, 1, 1, 1, 1), -- Analytics
(1, 8, 1, 1, 1, 1), -- Export Data
(1, 9, 1, 1, 1, 1), -- Planning & Strategy
(1, 10, 1, 1, 1, 1), -- Plans
(1, 11, 1, 1, 1, 1), -- Goals
(1, 12, 1, 1, 1, 1), -- Objectives
(1, 13, 1, 1, 1, 1), -- CEO Dashboard
(1, 14, 1, 1, 1, 1), -- Organization Plans
(1, 15, 1, 1, 1, 1), -- Strategic Reports
(1, 16, 1, 1, 1, 1), -- Team Management
(1, 17, 1, 1, 1, 1), -- Team Dashboard
(1, 18, 1, 1, 1, 1), -- Team Plans
(1, 19, 1, 1, 1, 1), -- Team Reports
(1, 20, 1, 1, 1, 1), -- My Workspace
(1, 21, 1, 1, 1, 1), -- My Plans
(1, 22, 1, 1, 1, 1), -- My Reports
(1, 23, 1, 1, 1, 1), -- My Tasks
(1, 24, 1, 1, 1, 1), -- System Administration
(1, 25, 1, 1, 1, 1), -- Settings
(1, 26, 1, 1, 1, 1), -- Menu Permissions
(1, 27, 1, 1, 1, 1), -- System Logs
(1, 28, 1, 1, 1, 1), -- Backup & Restore
(1, 29, 1, 1, 1, 1), -- Profile
(1, 30, 1, 1, 1, 1), -- Communication
(1, 31, 1, 1, 1, 1), -- Messages
(1, 32, 1, 1, 1, 1), -- Notifications
(1, 33, 1, 1, 1, 1), -- Finance & Resources
(1, 34, 1, 1, 1, 1), -- Budget Planning
(1, 35, 1, 1, 1, 1), -- Resource Allocation
(1, 36, 1, 1, 1, 1), -- Help & Support
(1, 37, 1, 1, 1, 1), -- Documentation
(1, 38, 1, 1, 1, 1); -- Support Tickets

-- CEO (role_id = 2) - Strategic and oversight access
INSERT INTO `role_permissions` (`role_id`, `menu_item_id`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
(2, 1, 1, 0, 0, 0), -- Dashboard
(2, 6, 1, 0, 0, 0), -- Reports
(2, 7, 1, 0, 0, 0), -- Analytics
(2, 8, 1, 0, 0, 0), -- Export Data
(2, 9, 1, 1, 1, 0), -- Planning & Strategy
(2, 10, 1, 1, 1, 0), -- Plans
(2, 11, 1, 1, 1, 0), -- Goals
(2, 12, 1, 1, 1, 0), -- Objectives
(2, 13, 1, 1, 1, 1), -- CEO Dashboard
(2, 14, 1, 1, 1, 1), -- Organization Plans
(2, 15, 1, 1, 1, 1), -- Strategic Reports
(2, 16, 1, 0, 0, 0), -- Team Management (view only)
(2, 17, 1, 0, 0, 0), -- Team Dashboard (view only)
(2, 18, 1, 0, 0, 0), -- Team Plans (view only)
(2, 19, 1, 0, 0, 0), -- Team Reports (view only)
(2, 29, 1, 1, 1, 0), -- Profile
(2, 30, 1, 0, 0, 0), -- Communication
(2, 31, 1, 1, 1, 0), -- Messages
(2, 32, 1, 1, 0, 0), -- Notifications
(2, 33, 1, 1, 1, 0), -- Finance & Resources
(2, 34, 1, 1, 1, 0), -- Budget Planning
(2, 35, 1, 1, 1, 0); -- Resource Allocation

-- General Manager (role_id = 3) - Management access
INSERT INTO `role_permissions` (`role_id`, `menu_item_id`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
(3, 1, 1, 0, 0, 0), -- Dashboard
(3, 2, 1, 0, 0, 0), -- User Management
(3, 4, 1, 0, 0, 0), -- Manage Accounts
(3, 6, 1, 0, 0, 0), -- Reports
(3, 7, 1, 0, 0, 0), -- Analytics
(3, 8, 1, 0, 0, 0), -- Export Data
(3, 9, 1, 1, 1, 0), -- Planning & Strategy
(3, 10, 1, 1, 1, 0), -- Plans
(3, 11, 1, 1, 1, 0), -- Goals
(3, 12, 1, 1, 1, 0), -- Objectives
(3, 16, 1, 1, 1, 0), -- Team Management
(3, 17, 1, 1, 1, 0), -- Team Dashboard
(3, 18, 1, 1, 1, 0), -- Team Plans
(3, 19, 1, 1, 1, 0), -- Team Reports
(3, 29, 1, 1, 1, 0), -- Profile
(3, 30, 1, 0, 0, 0), -- Communication
(3, 31, 1, 1, 1, 0), -- Messages
(3, 32, 1, 1, 0, 0); -- Notifications

-- Deputy Manager (role_id = 5) - Departmental management access
INSERT INTO `role_permissions` (`role_id`, `menu_item_id`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
(5, 1, 1, 0, 0, 0), -- Dashboard
(5, 6, 1, 0, 0, 0), -- Reports
(5, 7, 1, 0, 0, 0), -- Analytics
(5, 9, 1, 1, 1, 0), -- Planning & Strategy
(5, 10, 1, 1, 1, 0), -- Plans
(5, 11, 1, 1, 1, 0), -- Goals
(5, 12, 1, 1, 1, 0), -- Objectives
(5, 16, 1, 1, 1, 0), -- Team Management
(5, 17, 1, 1, 1, 0), -- Team Dashboard
(5, 18, 1, 1, 1, 0), -- Team Plans
(5, 19, 1, 1, 1, 0), -- Team Reports
(5, 20, 1, 1, 1, 0), -- My Workspace
(5, 21, 1, 1, 1, 0), -- My Plans
(5, 22, 1, 1, 1, 0), -- My Reports
(5, 23, 1, 1, 1, 0), -- My Tasks
(5, 29, 1, 1, 1, 0), -- Profile
(5, 30, 1, 0, 0, 0), -- Communication
(5, 31, 1, 1, 1, 0), -- Messages
(5, 32, 1, 1, 0, 0); -- Notifications

-- Service Head (role_id = 6) - Service management access
INSERT INTO `role_permissions` (`role_id`, `menu_item_id`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
(6, 1, 1, 0, 0, 0), -- Dashboard
(6, 6, 1, 0, 0, 0), -- Reports
(6, 7, 1, 0, 0, 0), -- Analytics
(6, 9, 1, 1, 1, 0), -- Planning & Strategy
(6, 10, 1, 1, 1, 0), -- Plans
(6, 11, 1, 1, 1, 0), -- Goals
(6, 12, 1, 1, 1, 0), -- Objectives
(6, 16, 1, 1, 1, 0), -- Team Management
(6, 17, 1, 1, 1, 0), -- Team Dashboard
(6, 18, 1, 1, 1, 0), -- Team Plans
(6, 19, 1, 1, 1, 0), -- Team Reports
(6, 20, 1, 1, 1, 0), -- My Workspace
(6, 21, 1, 1, 1, 0), -- My Plans
(6, 22, 1, 1, 1, 0), -- My Reports
(6, 23, 1, 1, 1, 0), -- My Tasks
(6, 29, 1, 1, 1, 0), -- Profile
(6, 30, 1, 0, 0, 0), -- Communication
(6, 31, 1, 1, 1, 0), -- Messages
(6, 32, 1, 1, 0, 0); -- Notifications

-- Team Leader (role_id = 7) - Team leadership access
INSERT INTO `role_permissions` (`role_id`, `menu_item_id`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
(7, 1, 1, 0, 0, 0), -- Dashboard
(7, 9, 1, 1, 1, 0), -- Planning & Strategy
(7, 10, 1, 1, 1, 0), -- Plans
(7, 11, 1, 1, 1, 0), -- Goals
(7, 12, 1, 1, 1, 0), -- Objectives
(7, 16, 1, 1, 1, 0), -- Team Management
(7, 17, 1, 1, 1, 0), -- Team Dashboard
(7, 18, 1, 1, 1, 0), -- Team Plans
(7, 19, 1, 1, 1, 0), -- Team Reports
(7, 20, 1, 1, 1, 0), -- My Workspace
(7, 21, 1, 1, 1, 0), -- My Plans
(7, 22, 1, 1, 1, 0), -- My Reports
(7, 23, 1, 1, 1, 0), -- My Tasks
(7, 29, 1, 1, 1, 0), -- Profile
(7, 30, 1, 0, 0, 0), -- Communication
(7, 31, 1, 1, 1, 0), -- Messages
(7, 32, 1, 1, 0, 0); -- Notifications

-- Expert (role_id = 8) - Specialist access
INSERT INTO `role_permissions` (`role_id`, `menu_item_id`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
(8, 1, 1, 0, 0, 0), -- Dashboard
(8, 6, 1, 0, 0, 0), -- Reports
(8, 7, 1, 0, 0, 0), -- Analytics
(8, 9, 1, 1, 1, 0), -- Planning & Strategy
(8, 10, 1, 1, 1, 0), -- Plans
(8, 11, 1, 1, 1, 0), -- Goals
(8, 12, 1, 1, 1, 0), -- Objectives
(8, 20, 1, 1, 1, 0), -- My Workspace
(8, 21, 1, 1, 1, 0), -- My Plans
(8, 22, 1, 1, 1, 0), -- My Reports
(8, 23, 1, 1, 1, 0), -- My Tasks
(8, 29, 1, 1, 1, 0), -- Profile
(8, 30, 1, 0, 0, 0), -- Communication
(8, 31, 1, 1, 1, 0), -- Messages
(8, 32, 1, 1, 0, 0); -- Notifications

-- Plan and Report (role_id = 9) - Planning and reporting specialist
INSERT INTO `role_permissions` (`role_id`, `menu_item_id`, `can_view`, `can_create`, `can_edit`, `can_delete`) VALUES
(9, 1, 1, 0, 0, 0), -- Dashboard
(9, 6, 1, 0, 0, 0), -- Reports
(9, 7, 1, 0, 0, 0), -- Analytics
(9, 8, 1, 1, 0, 0), -- Export Data
(9, 9, 1, 1, 1, 1), -- Planning & Strategy
(9, 10, 1, 1, 1, 1), -- Plans
(9, 11, 1, 1, 1, 1), -- Goals
(9, 12, 1, 1, 1, 1), -- Objectives
(9, 20, 1, 1, 1, 0), -- My Workspace
(9, 21, 1, 1, 1, 0), -- My Plans
(9, 22, 1, 1, 1, 0), -- My Reports
(9, 23, 1, 1, 1, 0), -- My Tasks
(9, 29, 1, 1, 1, 0), -- Profile
(9, 30, 1, 0, 0, 0), -- Communication
(9, 31, 1, 1, 1, 0), -- Messages
(9, 32, 1, 1, 0, 0); -- Notifications

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `sort_order` (`sort_order`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_menu` (`role_id`,`menu_item_id`),
  ADD KEY `menu_item_id` (`menu_item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
