-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: blogdb
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `user_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (3,'Örnek Yorum12',3,1,'2024-08-13 05:16:54'),(5,'Örnek yorum3',4,6,'2024-08-13 05:23:21'),(10,'Arabalar çok güzeldir12',5,1,'2024-08-14 14:02:35'),(17,'Bu makale bir harika!',3,54,'2024-08-28 04:58:37');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,NULL,'/uploads/a5860b24bd272c9ddbe9ca02407eae02','2024-08-22 13:45:12'),(2,NULL,'/uploads/c8edfc38829c03dafb9497260129e325','2024-08-22 13:48:01'),(3,52,'/uploads/cba7b9e784b54bc77c7f3e3e43a40534','2024-08-22 13:50:32'),(5,54,'/uploads/17e216f7821364ba19e53ca907f503d3','2024-08-28 04:49:23');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'Arabalar Hakkında','20. yy boyunca toplumlar gelişmişlik seviyelerine uygun olarak otomobil kavramı ile\r\ntanışmış, bu icat toplumların yaşamında ve kültüründe muazzam etkiler bırakmıştır.\r\nOtomobilin verdiği özgürlük ve imkânlar kent yapılarından, beşeri ilişkilerin tekrardan tesisine\r\nkadar toplumları yeniden yapılandırmıştır. Bu çalışmada otomobil kavramının Türk\r\ntoplumundaki etkisinitartışılacaktır. Çalışmada öncelikle otomobilin toplum ve mekâna etkisi ile\r\nbir gösteriş objesine dönüşümü araştırılacak, Türk toplumunun otomobille tanışması ele\r\nalınacaktır. Çalışmanın ilerleyen bölümlerinde gerek edebiyat gerekse sinemada otomobil teması\r\nbağlamına Türk toplumunda otomobilin yansıması ön plana çıkarılacak, günlük yaşamda Türk\r\ntoplumunun otomobille ilişkisine yer verilecektir',2,'2024-08-08 07:31:10',NULL),(6,'Kırmızı Rengi Hakkında','Kırmızı, al veya kızıl, parlak gökkuşağının en dışındaki renk. Sarı ve mavi gibi ana renklerden biridir. Güneş içteki gökkuşağındaki kırmızı renk ve gözümüzün açısı 42 derecedir. Elektromanyetik tayfın görülebilen renklerinden biridir. Kırmızı ışığın dalga boyu 630-760 nanometre civarındadır. Kırmızı en düşük frekanslı renktir. Kırmızının altındaki frekanslara kızılötesi (infrared ya da infraruj) denir. Karşıt rengi mavidir. Kırmızının, tamamlayıcı rengi yeşildir.\r\n\r\nKırmızı rengin elde ediliş serüvenine bakıldığında üç temel kaynak görülmektedir. Bitkisel Kaynaklar, Hayvansal Kaynaklar ve Mineral Kaynaklar. Bunlar bitkisel olarak Kök boya (Rubia Tinctorum), hayvansal olarak Kermes ve Koşnil (Dactylopius coccus), mineral olarak ise Aşı boyası ve Zincifre’dir. Yün boyamakta kullanılan kırmız bir kök olan kök boya, vişneçürüğü rengine yakın bir koyu kırmızılıktadır. Boyar madde içeriği diğer bitkilerden daha üstün olan kök boya, yüzyıllarca solmadan canlılığını korumuştur. Alizarin adındaki en temel boyar madde ile beraber toplam 19 boyar maddeyi köklerinde barındıran kök boyanın tarımı Kuzey Afrika ve Avrupa’da yapılmış, sonrasında Portekizler ve İngilizler tarafından Hindistan’a ulaşmıştır. Türkiye de dahil olmak üzere geniş bir coğrafyada yetişen bu bitki kurutulup değirmende öğütülmekte ve macun haline getirilmektedir.[2]\r\n\r\nİnsan kanı oksijenin varlığında hemoglobin yüzünden kırmızıdır. Kırmızı renk deniz suyu tarafından emildiği için siyah gözükürler.\r\n\r\nİştah açar. O yüzden dünyadaki gıda firmalarının çoğu logosunda kırmızıyı kullanır. Kırmızı tansiyonu yükseltir, kan akışını hızlandırır. Yanlış bir inanış vardır, boğaların kırmızıya saldırdığı sanılır. Oysa boğalar renk körüdür. Kırmızıya değil kendilerine sallanan koyu renkli beze saldırır.\r\n\r\nKırmızı renginin bazı çağrışımları: aşk ya da sevgi, nefret, cesaret, kuvvet, ısı, enerji, mutluluk, refah, saldırganlık, kızgınlık, baştan çıkarma, cinsellik, erotizm, ahlâksızlık, sonbahar, sosyalizm, komünizm, tutkunluk, güzellik, ateş, erkeksilik, tehlike, kan, Noel, savaş.',2,'2024-08-09 13:31:18',NULL),(21,'Panama Kanalı','asdasdasdasd',9,'2024-08-15 04:25:02',NULL),(37,'Yeni Gönderim','<p>Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim Yeni Gönderim&nbsp;<br></p>',2,'2024-08-16 10:52:34',NULL),(40,'asdsadasds','<p style=\"text-align: left; \">ASDASSADSADSADASDA</p>',5,'2024-08-19 11:40:59',NULL),(41,'ASDASDDSA','<p style=\"text-align: left;\"><b>asdasdasdasdas</b>asdasdasd</p>',5,'2024-08-19 11:41:28',NULL),(42,'Örnek Gönderi Kategori','<p style=\"text-align: left;\">Örnek Gönderim&nbsp; <b>AAAAA</b></p>',5,'2024-08-20 14:03:48','technology'),(43,'Örnek Gönderi','<p><span style=\"background-color: rgb(255, 255, 0);\">sdadasdasdasdas</span></p>',5,'2024-08-21 03:52:23','literature'),(44,'ASDASDSADSADSAD','<p>ASDASDASDASDASDASD</p>',5,'2024-08-22 05:26:10','general-culture'),(45,'ASDASDASD','<p>ASDASDASDASDASDASD</p>',5,'2024-08-22 05:47:21','general-culture'),(46,'ASDASDASD','<p>ASDASDASDASDASDASDASDASD</p>',5,'2024-08-22 05:48:28','literature'),(47,'SADSD','<p>ASDASDDAS</p>',5,'2024-08-22 12:45:48','sociology'),(48,'aSDASDASDASDASDASD','<p>SADASDASDSAD</p>',5,'2024-08-22 12:54:45','technology'),(50,'ASDASDASDSAD','<p>a</p>',5,'2024-08-22 13:45:12','general-culture'),(51,'ASDASDASD','<p>ASDASDASDASD</p>',5,'2024-08-22 13:48:01','technology'),(52,'ASDASD','<p>ASDDSAS</p>',5,'2024-08-22 13:50:32','literature'),(54,'Bilgisayar: Modern Dünyanın Vazgeçilmezi 1','<p>Bilgisayarlar, modern dünyanın temel taşlarından biri haline gelmiştir. Teknolojinin hızla gelişmesiyle birlikte, bilgisayarlar sadece bilgi işlem gücünü artırmakla kalmamış, aynı zamanda günlük yaşamın her alanında etkisini göstermiştir. Bu cihazlar, veri işleme, bilgi depolama, iletişim ve eğlence gibi birçok alanda vazgeçilmez araçlar haline gelmiştir.</p><p>Bilgisayarlar, elektronik devrelerin bir araya gelmesiyle oluşan, veri işleme kapasitesine sahip cihazlardır. Bir bilgisayarın temel bileşenleri arasında işlemci (CPU), bellek (RAM), depolama birimi (hard disk veya SSD) ve giriş/çıkış birimleri (klavye, mouse, ekran) bulunur. Bu bileşenler, kullanıcıların karmaşık işlemleri kısa sürede yapabilmelerini sağlar.</p><p>Bilgisayarlar, iş dünyasında büyük bir devrim yaratmıştır. Ofislerde kullanılan yazılım programları, iş süreçlerini otomatikleştirerek verimliliği artırmıştır. Aynı zamanda, internet bağlantısı sayesinde dünya genelinde iletişim kurmak ve bilgi paylaşmak mümkün hale gelmiştir. Eğlence sektörü de bilgisayarların sunduğu imkanlardan faydalanmış; video oyunları, film ve müzik gibi içerikler bilgisayarlar aracılığıyla milyonlarca kullanıcıya ulaşmıştır.</p><p>Gelecekte, bilgisayar teknolojisinin daha da gelişmesi bekleniyor. Yapay zeka, makine öğrenimi ve büyük veri gibi alanlarda bilgisayarlar daha karmaşık görevleri yerine getirecek, hatta bazı durumlarda insanlardan daha hızlı ve doğru kararlar alabileceklerdir. Ayrıca, kuantum bilgisayarlar gibi yeni nesil bilgisayar teknolojileri, bilgi işlem gücünde devrim yaratma potansiyeline sahiptir.</p><p>Sonuç olarak, bilgisayarlar modern yaşamın ayrılmaz bir parçası olmuştur. Eğitimden sağlığa, iş dünyasından eğlenceye kadar birçok alanda bilgisayarların etkisi hissedilmektedir. Teknolojinin gelişmesiyle birlikte bilgisayarlar, insan yaşamını kolaylaştırmaya ve dönüştürmeye devam edecektir.</p>',3,'2024-08-28 04:49:23','technology');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_admin` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'fatih','$2b$10$o5fRTwUGK/vDg6hXyPIMfOKAjWx8wvJK966uQSUdTKGPzU/tu6GhS','fatih@ornek.com','2024-08-06 13:07:46',0),(3,'fatih1','$2b$10$QApRUOlKfQRnD.1d07wHuenpNmT/BCGwk2Cp.c/.k6MrYVfszxRr.','fatih81fy@gmail.com','2024-08-07 12:20:17',1),(4,'fatih2','$2b$10$0w1d5OzvJJnqhNGM5tI5F.pGH9MxnKYBitulA6CGi7xadx9l7rINi','fatih81fy@gmail.com','2024-08-12 02:12:32',0),(5,'fatih3','$2b$10$auR93SZsl1pou1pVVb7/F.QlujQ0ahq7J6EdOL2Dm7KJslQH8K442','fatih81fy@gmail.com','2024-08-12 02:39:56',0),(6,'fatih4','$2b$10$FQXsMmvBTvegRIJWtUb3A.jX2YQ2lsx5.S/1t8oaHc3R7DvvVLHR.','fatih81fy@gmail.com','2024-08-15 04:12:31',0),(7,'fatih5','$2b$10$7bdEKmhltn4yrqkywKbADeL9CDPigdO1fEAa4fqdWGnYo9vNw3Y/6','fatih81fy@gmail.com','2024-08-15 04:14:33',0),(8,'fatih6','$2b$10$aULOEq/nXgRgjKzc.2iDGO8QuAsDX9rEgPzUKDmxQGbFHrU06EfLO','fatih81fy@gmail.com','2024-08-15 04:20:50',0),(9,'fatih7','$2b$10$gq/WChJMCqx0hG3VkhmLVedgmxfU0fXM0AL8zJAMeqGE3g8Ijl6q6','fatih@ornek.com','2024-08-15 04:23:04',0),(10,'fatih8','$2b$10$jRBLAYb6c0WzKmGbcCJB4.iFG8sIny23oAvueVDA6DBd5Ct8lZPpi','fatih@ornek.com','2024-08-15 04:29:25',0),(12,'fatihgüncelleme','$2b$10$7SBpmsEec4yWUenac3/Ffe4N5NnGsFScaVQY1r0X9QTDh5LqJsxcu','fatih81fy@gmail.com','2024-08-16 08:59:49',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-11 18:45:00
