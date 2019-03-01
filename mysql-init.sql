DROP TABLE IF EXISTS products;

CREATE TABLE products(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(13,2) NOT NULL,
  description TEXT NOT NULL,
  imageUrl TEXT
);

INSERT INTO products (name, price, description, imageUrl)
VALUES
('Ass', 29.99, 'An ass. Don\'t be one', 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Donkey_1_arp_750px.jpg'),
('Shrubbery', 99.99, 'Ni!', 'http://dklandscaping.com/wp-content/uploads/2016/03/Planning-and-Maintaining-a-Shrubbery-Dk-Landscaping-CA.jpg');