-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: localhost    Database: Ripio testing
-- ------------------------------------------------------
-- Server version	8.0.23

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
-- Table structure for table `Accounts`
--

DROP TABLE IF EXISTS `Accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Accounts` (
  `account_Id` int NOT NULL AUTO_INCREMENT COMMENT 'ID que identifica la cuenta',
  `account_Type` tinyint NOT NULL COMMENT 'Tipo de moneda de la cuenta',
  `account_Balance` decimal(20,10) NOT NULL COMMENT 'Balance de la cuenta\\n',
  `account_Ci` int NOT NULL COMMENT 'La cédula del usuario dueño de la cuenta',
  PRIMARY KEY (`account_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Accounts`
--

LOCK TABLES `Accounts` WRITE;
/*!40000 ALTER TABLE `Accounts` DISABLE KEYS */;
INSERT INTO `Accounts` VALUES (1,1,100.0000000000,47963085),(2,1,100.0000000000,47963086);
/*!40000 ALTER TABLE `Accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Coins`
--

DROP TABLE IF EXISTS `Coins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Coins` (
  `coin_Type` int NOT NULL AUTO_INCREMENT,
  `coin_Name` varchar(20) NOT NULL,
  `coin_RateUsd` decimal(20,10) NOT NULL COMMENT 'Determina el equivalente en USD de la moneda',
  PRIMARY KEY (`coin_Type`),
  UNIQUE KEY `coin_Name_UNIQUE` (`coin_Name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Coins`
--

LOCK TABLES `Coins` WRITE;
/*!40000 ALTER TABLE `Coins` DISABLE KEYS */;
INSERT INTO `Coins` VALUES (1,'USD',1.0000000000),(2,'ETH',1400.0000000000),(3,'BTC',50000.0000000000);
/*!40000 ALTER TABLE `Coins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Conversions`
--

DROP TABLE IF EXISTS `Conversions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Conversions` (
  `conversion_Id` int NOT NULL AUTO_INCREMENT,
  `conversion_From` tinyint NOT NULL COMMENT 'Moneda desde la cual se convierte (se corresponde a los id de coins en la tabla coin)\n',
  `conversion_To` tinyint NOT NULL COMMENT 'Moneda a la cual se hace la conversión (se corresponde a los id de coins en la tabla coin)',
  `conversion_Rate` decimal(20,10) NOT NULL COMMENT 'La tasa a la cual se hace la conversión ',
  PRIMARY KEY (`conversion_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Conversions`
--

LOCK TABLES `Conversions` WRITE;
/*!40000 ALTER TABLE `Conversions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Conversions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transactions`
--

DROP TABLE IF EXISTS `Transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transactions` (
  `transaction_Id` int NOT NULL AUTO_INCREMENT COMMENT 'Id de transaction',
  `transaction_From` int NOT NULL COMMENT 'Account_ID de la cuenta de donde salió el dinero',
  `transaction_To` int NOT NULL COMMENT 'Account_ID de la cuenta a donde llegó el dinero',
  `transaction_AmountFrom` decimal(20,10) NOT NULL COMMENT 'Monto debitado desde la cuenta origen',
  `transaction_AmountTo` decimal(20,10) NOT NULL COMMENT 'Monto acreditado en la cuenta destino',
  PRIMARY KEY (`transaction_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transactions`
--

LOCK TABLES `Transactions` WRITE;
/*!40000 ALTER TABLE `Transactions` DISABLE KEYS */;
INSERT INTO `Transactions` VALUES (1,1,2,50.0000000000,50.0000000000),(2,2,1,60.0000000000,60.0000000000);
/*!40000 ALTER TABLE `Transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_Ci` int NOT NULL COMMENT 'Cédula de identidad del usuario',
  `user_Password` varchar(45) NOT NULL COMMENT 'Password del usuario\n',
  PRIMARY KEY (`user_Ci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (11111111,'123'),(47963085,'1234'),(47963086,'123');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-14 18:06:37
