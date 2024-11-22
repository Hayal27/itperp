-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2024 at 11:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Character set and collation settings
SET NAMES utf8mb4;

-- Database: `itppr`

-- Table structure for table `chatmessage`
CREATE TABLE `chatmessage` (
  `chat_id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `chat_content` varchar(1000) NOT NULL,
  `sent_at` datetime NOT NULL,
  `received_at` datetime DEFAULT NULL,
  `read_status` varchar(20) NOT NULL,
  PRIMARY KEY (`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `decision`
CREATE TABLE `decision` (
  `decision_id` int(11) NOT NULL AUTO_INCREMENT,
  `issue_id` int(11) NOT NULL,
  `office_id` int(11) NOT NULL,
  `last_decision` int(100) NOT NULL,
  `decision_description` varchar(1000) NOT NULL,
  `made_at` datetime NOT NULL,
  PRIMARY KEY (`decision_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `plan`
CREATE TABLE `plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `letter` blob NOT NULL,
  `status` varchar(20) NOT NULL,
  `priority` varchar(20) NOT NULL,
  `severity` varchar(20) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `assignedTo` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `plans`
CREATE TABLE `plans` (
  `plan_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `objective` varchar(255) NOT NULL,
  `goal` varchar(255) NOT NULL,
  `row_no` varchar(50) NOT NULL,
  `details` text NOT NULL,
  `measurement` varchar(50) NOT NULL,
  `baseline` varchar(50) NOT NULL,
  `plan` varchar(50) NOT NULL,
  `outcome` varchar(50) NOT NULL,
  `execution_percentage` decimal(5,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Pending','Approved','Declined') DEFAULT 'Pending',
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `report`
CREATE TABLE `report` (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `objective` varchar(255) NOT NULL,
  `goal` varchar(255) NOT NULL,
  `row_no` varchar(50) NOT NULL,
  `details` text NOT NULL,
  `measurement` varchar(50) NOT NULL,
  `baseline` varchar(50) NOT NULL,
  `plan` varchar(50) NOT NULL,
  `outcome` varchar(50) NOT NULL,
  `execution_percentage` decimal(5,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Pending','Approved','Declined') DEFAULT 'Pending',
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `planstatus`
CREATE TABLE `planstatus` (
  `status_id` int(5) NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(20) NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert initial data into `planstatus`
INSERT INTO `planstatus` (`plan_name`) VALUES
('Pending'),
('Approved'),
('Declined');

-- Table structure for table `reportstatus`
CREATE TABLE `reportstatus` (
  `status_id` int(5) NOT NULL AUTO_INCREMENT,
  `report_name` varchar(20) NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert initial data into `reportstatus`
INSERT INTO `reportstatus` (`report_name`) VALUES
('Pending'),
('Approved'),
('Declined');

-- Table structure for table `department`
CREATE TABLE `department` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  `department_user_name` varchar(100) NOT NULL,
  `department_password` varchar(100) NOT NULL,
  `department_contact_info` varchar(30) NOT NULL,
  `department_status` varchar(15) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `role`
CREATE TABLE `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `status` int(11) DEFAULT 1,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert initial data into `role`
INSERT INTO `role` (`role_name`, `status`) VALUES
('Admin', 1),
('የፋስሊቲ ማስፋፊያና ጥገና አገልግሎት', 1),
('CEO', 1),
('የኮንስትራክሽን ማኔጅሜንት ዘርፍ ም/ስራ አስኪያጅ', 0),
('የግንባታ ፕሮጀችት ክትትልና ቁጥጥር አገልግሎት', 0),
('መሬትና መሰረተ ልማት አገልግሎት', 0),
('የ ኢንፎርሜሽን ቴክኖሎጂ ዘርፍ ም/ስራ አስኪያጅ', 0),
('ፋይናንስ እና አስተዳደር አገልግሎት', 0),
('የህግ ጉዳዮች ዘርፍ አማካሪ', 0),
('ጀኔራል ማኔጀር', 0),
('የቴክኖሊ ልማት አገልግሎት', 0),
('የ ICT ኢንኩቨሽን አገልግሎት', 0),
('የ ኢንቨስተሮች ድጋፍ አና ክትትል አገልግሎት', 0);

-- Table structure for table `tasks`
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by` int(11) NOT NULL,
  `assigned_to` int(11) NOT NULL,
  `task_description` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `user` (`user_id`, `role_id`, `fname`, `lname`, `user_name`, `password`, `phone`, `sex`, `create_at`, `updated_at`, `status`) VALUES
(1, 1, '', '', 'admin', 'admin', '', '', '2024-10-25 09:13:26', NULL, '1'),
(2, 2, '', '', 'moke', '1234', '', '', '2024-06-18 12:09:18', NULL, '1'),
(3, 5, 'Abebe', 'Bekele', 'abe', '1234', '+251925584562', 'M', '2024-06-22 18:50:04', NULL, '1'),
(4, 4, 'Beke', 'bke', 'beke', '1234', '0925236545', 'M', '2024-06-22 18:50:04', NULL, '1'),
(5, 5, 'Tariku', 'work', 'tare', '1234', '+251925584562', 'M', '2024-06-23 00:46:46', NULL, '1'),
(6, 4, 'yonas', 'ceo', 'yonas@itp.com', '1234', '0916048977', '', '2024-10-25 09:20:31', NULL, '1');

-- Table structure for table `user_roles`
CREATE TABLE `user_roles` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
