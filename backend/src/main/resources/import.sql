INSERT INTO TB_ROLE (authority) VALUES ('ROLE_USER');
INSERT INTO TB_ROLE (authority) VALUES ('ROLE_ADMIN');
INSERT INTO TB_ROLE (authority) VALUES ('ROLE_CLIENT');


INSERT INTO TB_USER (first_name, last_name, email, phone, password) VALUES ('Elissandro','Aparecido Anastacio', 'elissandro@gmail.com', '41-995628454', '$2a$10$98IYctnO0aPdbPvrInNamePge53JwF9mbkDaYpqePf0YjVxaQGgGy');
INSERT INTO TB_USER (first_name, last_name, email, phone, password) VALUES ('Mario','','mario.stecz@gmail.com','41-99802-6769', '$2a$10$98IYctnO0aPdbPvrInNamePge53JwF9mbkDaYpqePf0YjVxaQGgGy');

INSERT INTO TB_USER_ROLE (user_id, role_id) VALUES (1, 1);
INSERT INTO TB_USER_ROLE (user_id, role_id) VALUES (1, 2);
INSERT INTO TB_USER_ROLE (user_id, role_id) VALUES (2, 1);


