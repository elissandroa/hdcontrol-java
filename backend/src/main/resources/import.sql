INSERT INTO TB_ROLE (authority) VALUES ('ROLE_USER');
INSERT INTO TB_ROLE (authority) VALUES ('ROLE_ADMIN');
INSERT INTO TB_ROLE (authority) VALUES ('ROLE_CLIENT');


INSERT INTO TB_USER (first_name, last_name, email, phone, password) VALUES ('Maria','Silva', 'maria@gmail.com', '123456789', '$2a$10$98IYctnO0aPdbPvrInNamePge53JwF9mbkDaYpqePf0YjVxaQGgGy');
INSERT INTO TB_USER (first_name, last_name, email, phone, password) VALUES ('Jose','Pereira', 'jose@gmail.com', '987654321', '$2a$10$98IYctnO0aPdbPvrInNamePge53JwF9mbkDaYpqePf0YjVxaQGgGy');

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
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 12', 'Description 12', 'Brand L', 120.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 13', 'Description 13', 'Brand M', 130.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 14', 'Description 14', 'Brand N', 140.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 15', 'Description 15', 'Brand O', 150.99);
INSERT INTO TB_PRODUCT (name, description, brand, price) VALUES ('Product 16', 'Description 16', 'Brand P', 160.99);
	



INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-02', 1);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-03', 2);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-04', 3);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-06', 1);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-07', 2);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-08', 3);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (1,'T-REX','TROCA DE ID','2023-10-10', 1);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-11', 2);
INSERT INTO TB_ORDER (user_id, service_description, observation, delivery_date, status) VALUES (2,'T-REX','TROCA DE ID','2023-10-12', 3);
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
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (5, 10, 1 , 50.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (6, 11, 2 , 60.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (8, 2, 2 , 80.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (9, 3, 1 , 90.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (10, 4, 2 , 100.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (12, 6, 2 , 120.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (13, 7, 1 , 130.80);
INSERT INTO TB_ORDER_ITEM (product_id, order_id, quantity, price) VALUES (14, 8, 2 , 140.80);	


INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (2, 3);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (2, 4);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (3, 5);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (4, 6);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (6, 1);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (7, 2);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (8, 3);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (10, 5);
INSERT INTO TB_ORDER_PRODUCT (order_id, product_id) VALUES (11, 6);


INSERT INTO TB_PAYMENT (ORDER_ID, MOMENT, STATUS) VALUES (1L, now(), 1);
INSERT INTO TB_PAYMENT (ORDER_ID, MOMENT, STATUS) VALUES (2L, now(), 0);
INSERT INTO TB_PAYMENT (ORDER_ID, MOMENT, STATUS) VALUES (3L, now(), 2);

