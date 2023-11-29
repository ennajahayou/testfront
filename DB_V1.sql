-- Active: 1696927941157@@127.0.0.1@3306@thankstip
-- Table des users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_ VARCHAR(255) NOT NULL,
    profil_informations TEXT,
    wallet_tip1 DECIMAL(10, 2) DEFAULT 0,
    wallet_tip2 DECIMAL(10, 2) DEFAULT 0,
    thanks INT DEFAULT 0
);

-- Table des DIO (Decentralized Intellectual Organizations)
CREATE TABLE dio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_dio VARCHAR(255) NOT NULL,
    id_projects INT,
    dio_description TEXT,
    id_members INT,
    id_ceo INT,
    FOREIGN KEY (id_members) REFERENCES users(id),
    FOREIGN KEY (id_ceo) REFERENCES users(id)
)ENGINE=INNODB;

-- Table de liaison entre users et DIO (pour enregistrer les membres)
CREATE TABLE users_dio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    id_dio INT,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_dio) REFERENCES dio(id)
)ENGINE=INNODB;

-- Table des projects DIO
CREATE TABLE projects_dio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_dio INT,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    id_contributors INT DEFAULT 0,
    investissements DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (id_dio) REFERENCES dio(id),
    FOREIGN KEY (id_contributors) REFERENCES users(id)
)ENGINE=INNODB;

-- Table Execution and champs to add
 CREATE TABLE execution (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_dio INT,
    exec_description VARCHAR(255),
    exec_content TEXT DEFAULT NULL,
    id_talent INT,
    id_ceo INT,
    candidate_description TEXT,
    deadline TIMESTAMP,
    score_tips INT DEFAULT 0,
    score_thanks INT DEFAULT 0,
    status_ VARCHAR(25),
    ceo_validated BOOLEAN,
    archived BOOLEAN DEFAULT FALSE,
    CONSTRAINT CK_Status CHECK (status_ IN ('Not assigned', 'In progress', 'In review', 'Done')),
    FOREIGN KEY (id_talent) REFERENCES users(id),
    FOREIGN KEY (id_ceo) REFERENCES users(id),
    FOREIGN KEY (id_dio) REFERENCES dio(id)
)ENGINE=INNODB;

-- Table Review

CREATE TABLE review (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_execution INT,
    id_issuer INT,
    comments_ TEXT,
    difficulty INT,
    reactivity INT,
    FOREIGN KEY (id_issuer) REFERENCES users(id),
    FOREIGN KEY (id_execution) REFERENCES execution(id)
);

-- table to add 
CREATE TABLE peer_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_execution INT,
    id_issuer INT,
    comments TEXT,
    expectations INT,
    reactivity INT,
    FOREIGN KEY (id_issuer) REFERENCES users(id),
    FOREIGN KEY (id_execution) REFERENCES execution(id)
);
-- table to add
CREATE TABLE ceo_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_execution INT,
    id_issuer INT,
    comments TEXT,
    expectations INT,
    reactivity INT,
    FOREIGN KEY (id_issuer) REFERENCES users(id),
    FOREIGN KEY (id_execution) REFERENCES execution(id)
);



