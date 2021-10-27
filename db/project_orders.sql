-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	8.0.26

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
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orders_id` int NOT NULL AUTO_INCREMENT,
  `cust_name` varchar(20) DEFAULT NULL,
  `lego_name` varchar(45) DEFAULT NULL,
  `orders_qty` varchar(45) DEFAULT NULL,
  `orders_date` varchar(45) DEFAULT NULL,
  `delivery_date` text,
  `cid` varchar(10) DEFAULT NULL,
  `date_c` text,
  `mid` varchar(10) DEFAULT NULL,
  `date_m` text,
  `work` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`orders_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'삼성전자','bricks_rect','100','2021-10-21','2021-10-28','c',NULL,NULL,NULL,'Y'),(2,'LG전자','bricks_rect','100','2021-10-22','2021-10-25','ch',NULL,NULL,NULL,NULL),(4,'삼성전자','bricks_rect','100','2021-10-22','2021-10-28','c',NULL,NULL,NULL,'Y'),(5,'삼성전자','circle','50','2021-10-25','2021-10-29','ㅊ',NULL,NULL,NULL,'Y'),(6,'삼성전자','bricks_square','10','2021-10-26','2021-10-29','c',NULL,NULL,NULL,'Y'),(7,'LG전자','bricks_square','10','2021-10-26','2021-10-28','kj',NULL,NULL,NULL,'Y');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-26 13:22:25
