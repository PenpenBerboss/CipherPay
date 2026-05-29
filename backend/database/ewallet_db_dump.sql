/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.5-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: ewallet_db
-- ------------------------------------------------------
-- Server version	11.8.5-MariaDB-1 from Debian

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `activity_logs` VALUES
(1,'65173d11-487e-422e-9122-26fb11ba1055','REGISTER','::ffff:127.0.0.1','curl/8.19.0','{\"email\":\"test@cipherpay.com\"}','2026-05-13 13:57:06'),
(2,'65173d11-487e-422e-9122-26fb11ba1055','LOGIN_SUCCESS','::ffff:127.0.0.1','curl/8.19.0',NULL,'2026-05-13 13:57:40'),
(3,'65173d11-487e-422e-9122-26fb11ba1055','LOGIN_SUCCESS','::ffff:127.0.0.1','curl/8.19.0',NULL,'2026-05-13 17:18:16'),
(4,'65173d11-487e-422e-9122-26fb11ba1055','LOGIN_SUCCESS','::ffff:127.0.0.1','curl/8.19.0',NULL,'2026-05-13 17:26:33'),
(5,'5b44bda3-d1a6-4568-8a81-2e2b63182234','REGISTER','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0','{\"email\":\"claude@gmail.com\"}','2026-05-13 18:14:19'),
(6,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 18:16:35'),
(7,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 19:38:08'),
(8,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 19:39:37'),
(9,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 19:42:50'),
(10,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 20:27:34'),
(11,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 20:42:35'),
(12,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 20:42:46'),
(13,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 20:45:28'),
(14,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-13 20:46:13'),
(15,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 15:07:07'),
(16,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 15:08:01'),
(17,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 15:09:51'),
(18,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 15:47:43'),
(19,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 15:55:38'),
(20,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 17:18:25'),
(21,'5b44bda3-d1a6-4568-8a81-2e2b63182234','MFA_ENABLED',NULL,NULL,NULL,'2026-05-14 17:19:08'),
(22,'5b44bda3-d1a6-4568-8a81-2e2b63182234','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 17:21:49'),
(23,'5b44bda3-d1a6-4568-8a81-2e2b63182234','MFA_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 17:22:18'),
(24,'a42e8a1c-0366-4aa3-94ed-caf8cefce15f','REGISTER','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0','{\"email\":\"penpen@gmail.com\"}','2026-05-14 23:17:17'),
(25,'a42e8a1c-0366-4aa3-94ed-caf8cefce15f','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 23:17:27'),
(26,'a42e8a1c-0366-4aa3-94ed-caf8cefce15f','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 23:29:20'),
(27,'a42e8a1c-0366-4aa3-94ed-caf8cefce15f','MFA_ENABLED',NULL,NULL,NULL,'2026-05-14 23:33:11'),
(28,'a42e8a1c-0366-4aa3-94ed-caf8cefce15f','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 23:33:28'),
(29,'a42e8a1c-0366-4aa3-94ed-caf8cefce15f','MFA_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 23:33:37'),
(30,'a42e8a1c-0366-4aa3-94ed-caf8cefce15f','LOGIN_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 23:42:19'),
(31,'a42e8a1c-0366-4aa3-94ed-caf8cefce15f','MFA_SUCCESS','::ffff:127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',NULL,'2026-05-14 23:43:01');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `success` tinyint(1) DEFAULT 0,
  `attempted_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_attempted_at` (`attempted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_attempts`
--

LOCK TABLES `login_attempts` WRITE;
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `login_attempts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` varchar(36) NOT NULL,
  `sender_id` varchar(36) NOT NULL,
  `receiver_id` varchar(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `hash` varchar(64) NOT NULL,
  `signature` varchar(64) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_receiver` (`receiver_id`),
  KEY `idx_transactions_hash` (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `balance` decimal(10,2) DEFAULT 0.00,
  `totp_secret` varchar(255) DEFAULT NULL,
  `totp_enabled` tinyint(1) DEFAULT 0,
  `is_locked` tinyint(1) DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
('5b44bda3-d1a6-4568-8a81-2e2b63182234','claude@gmail.com','$2a$10$YvODlXe3hI70SWh39JeuJegXXkqKqUMAF0cS7/rmPVc65/Wa.336C','claude','dupont','user',0.00,'FF4X2YKRGA7EY5KBLVVXIU2TIJKWKOJK',1,0,NULL,'2026-05-13 18:14:19','2026-05-14 17:19:08'),
('65173d11-487e-422e-9122-26fb11ba1055','test@cipherpay.com','$2a$10$GqAfJ.Vv1BS7XjGhnBPq1uwy8FYpr/utts06s3c7ZdbB/gturh.4e','Jean','Dupont','user',0.00,NULL,0,0,NULL,'2026-05-13 13:57:06','2026-05-13 13:57:06'),
('a42e8a1c-0366-4aa3-94ed-caf8cefce15f','penpen@gmail.com','$2a$10$I1bW.Njh1Y4.DzSOcScsl.wbvJESbV9Uvf/ZC6BQRnmMGWWpIVQmi','penpen','Inconnu','user',0.00,'J43SGWRJNVGTG43BFRTWCMRBNY6CMNJZ',1,0,NULL,'2026-05-14 23:17:17','2026-05-14 23:33:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-15  0:09:30
