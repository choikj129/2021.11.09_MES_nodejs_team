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
-- Table structure for table `defect`
--

DROP TABLE IF EXISTS `defect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `defect` (
  `defect_id` int NOT NULL AUTO_INCREMENT,
  `monitor_id` int NOT NULL,
  `error` text,
  `cause` text,
  `date` varchar(45) NOT NULL,
  PRIMARY KEY (`defect_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `defect`
--

LOCK TABLES `defect` WRITE;
/*!40000 ALTER TABLE `defect` DISABLE KEYS */;
INSERT INTO `defect` VALUES (21,18,'injection_speed : 59.71( 4.34)',NULL,'2021-10-22 10:48:38'),(24,20,'mold_temp : 31.83( 6.53)',NULL,'2021-10-22 10:48:42'),(30,26,'melt_temp : 282.31( 6.55)',NULL,'2021-10-22 10:48:54'),(33,29,'melt_temp : 281.71( 5.95)',NULL,'2021-10-22 10:49:00'),(34,30,'mold_temp : 31.85( 6.55) injection_speed : 59.64( 4.27)',NULL,'2021-10-22 10:49:02'),(35,31,'injection_speed : 58.98( 3.61)',NULL,'2021-10-22 10:49:04'),(36,36,'injection_speed : 58.92( 3.55)',NULL,'2021-10-22 10:52:56'),(37,38,'mold_temp : 31.23( 5.93) melt_temp : 282.1( 6.34)',NULL,'2021-10-22 10:53:00'),(38,45,'injection_speed : 59.19( 3.82)',NULL,'2021-10-22 10:53:14'),(39,1,'mold_temp : 1.88(-23.42) melt_temp : -1.62(-277.38) injection_speed : 1.96(-53.41) hold_pressure : -0.17(-135.56)',NULL,'2021-10-25 09:44:26'),(40,5,'mold_temp : 1.92(-23.38) melt_temp : -2.02(-277.78) injection_speed : 0.41(-54.96) hold_pressure : -0.71(-136.11)',NULL,'2021-10-25 09:44:34'),(41,6,'mold_temp : 0.35(-24.95) melt_temp : -0.3(-276.06) injection_speed : -1.4(-56.77) hold_pressure : -0.64(-136.03)',NULL,'2021-10-25 09:44:36'),(42,1,'mold_temp : 0.03(-25.27) melt_temp : -0.11(-275.87) injection_speed : 0.54(-54.83) hold_pressure : 0.17(-135.23)',NULL,'2021-10-25 09:53:49'),(43,1,'mold_temp : 0.03(-25.27) melt_temp : -0.11(-275.87) injection_speed : 0.54(-54.83) hold_pressure : 0.17(-135.23)',NULL,'2021-10-25 09:53:49'),(44,2,'mold_temp : 2.73(-22.57) melt_temp : -1.66(-277.42) injection_speed : 0.78(-54.59) hold_pressure : 0.44(-134.96)',NULL,'2021-10-25 09:53:51'),(45,2,'injection_speed : 58.94( 3.57)',NULL,'2021-10-26 13:04:17'),(46,2,'injection_speed : 58.94( 3.57)',NULL,'2021-10-26 13:04:17'),(47,9,'injection_speed : 59.84( 4.48)',NULL,'2021-10-26 13:04:31'),(48,9,'injection_speed : 59.84( 4.48)',NULL,'2021-10-26 13:04:31'),(49,14,'injection_speed : 60.19( 4.82)',NULL,'2021-10-26 13:04:41'),(50,14,'injection_speed : 60.19( 4.82)',NULL,'2021-10-26 13:04:41'),(51,14,'injection_speed : 60.19( 4.82)',NULL,'2021-10-26 13:04:41'),(52,14,'injection_speed : 60.19( 4.82)',NULL,'2021-10-26 13:04:41'),(53,16,'injection_speed : 59.1( 3.73)',NULL,'2021-10-26 13:08:12'),(54,16,'injection_speed : 59.1( 3.73)',NULL,'2021-10-26 13:08:12');
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

-- Dump completed on 2021-10-26 13:22:24
