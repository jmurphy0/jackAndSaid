DROP DATABASE IF EXISTS chats_db;
CREATE DATABASE chats_db;

USE chats_db;
CREATE TABLE users(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) UNIQUE NOT NULL,
    last_name VARCHAR(100) UNIQUE NOT NULL,
    age INT UNSIGNED NOT NULL,
    gender TINYINT(1), 
    img_path VARCHAR(1024),
    bio TEXT NOT NULL,
    username VARCHAR(200) UNIQUE NOT NULL,
    login_pw VARCHAR(200) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    security_question TEXT NOT NULL,
    security_answer TEXT NOT NULL
);

CREATE TABLE chats(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chat_name VARCHAR(120) NOT NULL,
    time VARCHAR(120),
    chat_members VARCHAR(255),
    messages TEXT NOT NULL
);


CREATE TABLE matches(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    matched  TINYINT(1)
);
INSERT INTO users (first_name, last_name, age, gender, img_path, bio, username, login_pw, email, security_question, security_answer)
VALUES 
('Lois', 'Dahle', 85, 0, 'https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png', 'About Lois and what she likes....', 'lois85', 'lois12345', "lois@gmail.com", 'What is your mothers maiden name', 'loisAnswer'),
('April', 'Jones', 54, 0, 'https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png', 'About April and what she likes....', 'april54', 'april12345',"april@gmail.com", 'What is your mothers maiden name', 'aprilAnswer'),
('Jose', 'Prieto', 84, 1, 'https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png', 'About Jose and what he likes....', 'jose84', 'jose12345', 'jose@icloud.com','What is your mothers maiden name', 'joseAnswer'),
('Leroy', 'Shires', 53, 1, 'https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png', 'About Leroy and what he likes....', 'leroy53', 'leroy12345','leroy@hotmail.com', 'What is your mothers maiden name', 'leroyAnswer'),
('Kathy', 'Vesey', 58, 0, 'https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png', 'About Kathy and what she likes....', 'kathy58', 'kathy12345','kathy@yahoo.com', 'What is your mothers maiden name', 'kathyAnswer'),
('Alicia', 'Ramirez', 48, 1, 'https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png', 'About Alecia and what she likes....', 'alicia48', 'alicia12345', 'alicia@me.com','What is your mothers maiden name', 'aliciaAnswer');
SELECT * FROM chats;