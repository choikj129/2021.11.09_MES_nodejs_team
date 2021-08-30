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
-- Table structure for table `lego`
--

DROP TABLE IF EXISTS `lego`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lego` (
  `lego_id` int NOT NULL,
  `lego_name` varchar(45) NOT NULL,
  `size_x` decimal(18,2) NOT NULL,
  `size_y` decimal(18,2) NOT NULL,
  `size_z` decimal(18,2) NOT NULL,
  `stud_height` decimal(18,2) NOT NULL DEFAULT '4.50',
  `stud_diameter` decimal(18,2) NOT NULL DEFAULT '5.10',
  `stud_num` varchar(45) NOT NULL DEFAULT '0',
  `thickness` decimal(18,2) NOT NULL DEFAULT '1.50',
  PRIMARY KEY (`lego_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lego`
--

LOCK TABLES `lego` WRITE;
/*!40000 ALTER TABLE `lego` DISABLE KEYS */;
INSERT INTO `lego` VALUES (1,'bricks_rect',48.00,31.90,15.80,4.50,4.80,'4*2',1.50),(2,'bricks_square',8.00,8.00,9.60,4.50,4.80,'1*1',1.50),(3,'circle',24.00,24.00,13.00,4.50,4.80,'0',1.50),(4,'floor',205.00,205.00,5.00,4.50,4.80,'16*16',1.50);
/*!40000 ALTER TABLE `lego` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-30 15:50:20
