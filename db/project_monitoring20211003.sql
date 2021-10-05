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
-- Table structure for table `monitoring20211003`
--

DROP TABLE IF EXISTS `monitoring20211003`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitoring20211003` (
  `monitor_id` int NOT NULL AUTO_INCREMENT,
  `mold_temp` double NOT NULL,
  `melt_temp` double NOT NULL,
  `injection_speed` double NOT NULL,
  `hold_pressure` double NOT NULL,
  `injection_time` double NOT NULL,
  `hold_time` double NOT NULL,
  `filling_time` double NOT NULL,
  `cycle_time` double NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `z` double NOT NULL,
  `stud_h` double NOT NULL,
  `stud_d` double NOT NULL,
  `thick` double NOT NULL,
  `defect` varchar(5) NOT NULL,
  `date` text NOT NULL,
  PRIMARY KEY (`monitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitoring20211003`
--

LOCK TABLES `monitoring20211003` WRITE;
/*!40000 ALTER TABLE `monitoring20211003` DISABLE KEYS */;
INSERT INTO `monitoring20211003` VALUES (1,24.9,277.2,55.4,136.9,9.58,7.13,4.47,59.56,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:41'),(2,27.5,275.2,30.6,37.6,4.47,6.53,16.89,59.52,48,31.9,15.8,4.5,4.8,1.4,'N','2021-10-03 12:05:43'),(3,25,276.1,55.4,136.6,9.58,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:45'),(4,24.8,276.3,55.6,136.4,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:47'),(5,24.8,276.3,55.6,136.4,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:49'),(6,24.8,275.5,55.8,136.1,9.56,7.13,4.44,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:51'),(7,24.8,275.5,55.8,136.1,9.56,7.13,4.44,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:53'),(8,24.8,275.8,55.6,136.7,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:55'),(9,24.8,275.8,55.6,136.7,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:57'),(10,25.1,276,55.4,136.7,9.58,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:05:59'),(11,25.1,276,55.4,136.7,9.58,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:06:01'),(12,25.2,276.6,55.4,136.8,9.58,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:06:03'),(13,25.2,276.6,55.4,136.8,9.58,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:06:05'),(14,25.1,277.2,55.5,136.5,9.59,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:06:07'),(15,25.1,277.2,55.5,136.5,9.59,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:06:09'),(16,25.2,276.1,55.5,136.8,9.59,7.13,4.47,59.58,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:06:11'),(17,25.2,276.1,55.5,136.8,9.59,7.13,4.47,59.58,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:06:13'),(18,24.9,275.8,55.3,136.7,9.6,7.13,4.48,59.56,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:06:15'),(19,24.9,277.2,55.4,136.9,9.58,7.13,4.47,59.56,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:24:58'),(20,27.5,275.2,30.6,37.6,4.47,6.53,16.89,59.52,48,31.9,15.8,4.5,4.8,1.4,'N','2021-10-03 12:25:00'),(21,25,276.1,55.4,136.6,9.58,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:25:02'),(22,24.8,276.3,55.6,136.4,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:25:04'),(23,24.8,276.3,55.6,136.4,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:25:06'),(24,24.9,277.2,55.4,136.9,9.58,7.13,4.47,59.56,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:09'),(25,27.5,275.2,30.6,37.6,4.47,6.53,16.89,59.52,48,31.9,15.8,4.5,4.8,1.4,'N','2021-10-03 12:26:11'),(26,25,276.1,55.4,136.6,9.58,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:13'),(27,24.8,276.3,55.6,136.4,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:15'),(28,24.8,276.3,55.6,136.4,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:17'),(29,24.8,275.5,55.8,136.1,9.56,7.13,4.44,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:19'),(30,24.8,275.5,55.8,136.1,9.56,7.13,4.44,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:21'),(31,24.8,275.8,55.6,136.7,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:23'),(32,24.8,275.8,55.6,136.7,9.57,7.13,4.45,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:25'),(33,25.1,276,55.4,136.7,9.58,7.13,4.47,59.52,48,31.9,15.8,4.5,4.8,1.5,'Y','2021-10-03 12:26:27');
/*!40000 ALTER TABLE `monitoring20211003` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-05  9:13:45
