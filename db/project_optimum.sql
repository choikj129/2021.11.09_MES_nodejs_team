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
-- Table structure for table `optimum`
--

DROP TABLE IF EXISTS `optimum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `optimum` (
  `optimum_id` int NOT NULL AUTO_INCREMENT,
  `setup_id` int NOT NULL,
  `mold_m` decimal(18,2) NOT NULL,
  `melt_m` decimal(18,2) NOT NULL,
  `hold_m` decimal(18,2) NOT NULL,
  `injection_m` decimal(18,2) NOT NULL,
  `mold_s` decimal(18,2) NOT NULL,
  `melt_s` decimal(18,2) NOT NULL,
  `hold_s` decimal(18,2) NOT NULL,
  `injection_s` decimal(18,2) NOT NULL,
  `date` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`optimum_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `optimum`
--

LOCK TABLES `optimum` WRITE;
/*!40000 ALTER TABLE `optimum` DISABLE KEYS */;
INSERT INTO `optimum` VALUES (1,1,25.11,275.96,55.14,134.67,2.80,2.91,1.75,1.72,'2021-10-18'),(2,2,25.97,274.68,56.05,134.92,2.84,2.99,1.73,1.76,'2021-10-19'),(3,3,24.55,275.41,55.51,136.30,2.81,3.00,1.78,1.82,'2021-10-20'),(4,4,25.58,276.99,54.76,135.69,2.92,2.88,1.67,1.74,'2021-10-21');
/*!40000 ALTER TABLE `optimum` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-20 10:51:07
