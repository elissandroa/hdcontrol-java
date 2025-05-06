INSERT INTO TB_ROLE (authority) VALUES ('ROLE_USER');
INSERT INTO TB_ROLE (authority) VALUES ('ROLE_ADMIN');

INSERT INTO TB_USER (first_name, last_name, email, phone, password) VALUES ('Maria','Silva', 'maria@gmail.com', '123456789', '123456');
INSERT INTO TB_USER (first_name, last_name, email, phone, password) VALUES ('Jose','Pereira', 'jose@gmail.com', '987654321', '654321');

INSERT INTO TB_USER_ROLE (user_id, role_id) VALUES (1, 1);
INSERT INTO TB_USER_ROLE (user_id, role_id) VALUES (1, 2);
INSERT INTO TB_USER_ROLE (user_id, role_id) VALUES (2, 1);

INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 1', 'Description 1', 'Brand A', 10.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 2', 'Description 2', 'Brand B', 20.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 3', 'Description 3', 'Brand C', 30.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 4', 'Description 4', 'Brand D', 40.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 5', 'Description 5', 'Brand E', 50.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 6', 'Description 6', 'Brand F', 60.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 7', 'Description 7', 'Brand G', 70.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 8', 'Description 8', 'Brand H', 80.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 9', 'Description 9', 'Brand I', 90.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 10', 'Description 10', 'Brand J', 100.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 11', 'Description 11', 'Brand K', 110.99);

INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-01', 0);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-02', 1);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-03', 2);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-04', 3);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-05', 0);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-06', 1);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-07', 2);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-08', 3);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-09', 0);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-10', 1);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-11', 2);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-12', 3);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-13', 0);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-14', 1);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-15', 2);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-16', 3);

INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (1, 1, 1 , 10.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (2, 1, 2 , 20.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (3, 2, 1 , 30.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (4, 2, 2 , 40.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (5, 3, 1 , 50.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (6, 4, 2 , 60.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (7, 5, 1 , 70.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (1, 6, 1 , 10.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (2, 7, 2 , 20.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (3, 8, 1 , 30.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (4, 9, 2 , 40.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (5, 10, 1 , 50.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (6, 11, 2 , 60.80);

INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (1, 1);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (1, 2);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (2, 3);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (2, 4);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (3, 5);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (4, 6);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (5, 7);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (6, 1);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (7, 2);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (8, 3);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (9, 4);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (10, 5);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (11, 6);



INSERT INTO TB_PAYMENT (ORDER_ID, MOMENT) VALUES (1, now());
INSERT INTO TB_PAYMENT (ORDER_ID, MOMENT) VALUES (2, now());
INSERT INTO TB_PAYMENT (ORDER_ID, MOMENT) VALUES (3, now());

