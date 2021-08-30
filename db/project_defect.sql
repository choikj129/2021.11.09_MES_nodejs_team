-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `defect`
--

DROP TABLE IF EXISTS `defect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `defect` (
  `defect_id` int NOT NULL,
  `monitor_id` int NOT NULL,
  `x_defect` varchar(45) NOT NULL,
  `y_defect` varchar(45) NOT NULL,
  `z_defect` varchar(45) NOT NULL,
  `stud_h_defect` varchar(45) NOT NULL,
  `stud_d_defect` varchar(45) NOT NULL,
  `thick_defect` varchar(45) NOT NULL,
  `error` text NOT NULL,
  `cause` text NOT NULL,
  PRIMARY KEY (`defect_id`),
  KEY `defect_fk_idx` (`monitor_id`),
  CONSTRAINT `defect_fk` FOREIGN KEY (`monitor_id`) REFERENCES `monitoring` (`monitor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `defect`
--

LOCK TABLES `defect` WRITE;
/*!40000 ALTER TABLE `defect` DISABLE KEYS */;
INSERT INTO `defect` VALUES (1,48,'Y','Y','Y','Y','Y','N','',''),(2,81,'Y','Y','Y','N','Y','N','',''),(3,96,'N','N','Y','Y','Y','N','',''),(4,100,'N','N','Y','Y','Y','N','',''),(5,102,'N','N','Y','Y','Y','N','',''),(6,104,'N','N','Y','Y','Y','N','',''),(7,106,'Y','N','Y','Y','Y','N','',''),(8,108,'Y','Y','N','N','Y','N','',''),(9,110,'Y','Y','Y','N','N','N','',''),(10,112,'Y','Y','N','N','Y','N','',''),(11,114,'Y','N','Y','N','Y','N','',''),(12,116,'Y','N','Y','N','Y','N','',''),(13,117,'Y','N','Y','N','Y','N','',''),(14,118,'Y','N','Y','N','Y','N','',''),(15,119,'Y','N','Y','N','Y','N','',''),(16,120,'Y','N','Y','N','Y','N','',''),(17,121,'Y','N','Y','N','Y','N','','');
/*!40000 ALTER TABLE `defect` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-30 15:50:19
