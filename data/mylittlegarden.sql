BEGIN;



CREATE TABLE "user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    password text NOT NULL
    
);

CREATE TABLE "plant" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    plant_img TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE "parcel" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT,
    width INT,
    height INT
);



CREATE TABLE "user_has_plant" (
    user_id int REFERENCES "user" (id),
    plant_id int REFERENCES "plant" (id)
    parcel_id int REFERENCES "parcel" (id),
    position_x TEXT NOT NULL,
    position_y TEXT NOT NULL
);




INSERT INTO "user" ("user_name", "email", "password") VALUES
('mlg', 'mlg@yopmail.com', 'mlg');


INSERT INTO "plant" ("name", "plant_img", "description") VALUES
('Tomates', '/img/tomate.jpg', 'La tomate (Solanum lycopersicum L.) est une espèce de plantes herbacées du genre Solanum de la famille des Solanacées, originaire du Nord-Ouest de l''Amérique du Sud, largement cultivée pour son fruit. 
Le terme désigne aussi ce fruit charnu. La tomate se consomme comme un légume-fruit, crue ou cuite. Elle est devenue un élément incontournable de la gastronomie dans de nombreux pays, et tout particulièrement dans le bassin méditerranéen.'),
('Aubergine', '/img/aubergine.jpg', 'L''aubergine (Solanum melongena L.) est une plante dicotylédone de la famille des Solanaceae, cultivée pour son légume-fruit. Le terme aubergine désigne la plante et le fruit.');


INSERT INTO "parcel" ("name", "position_x", "position_y") VALUES
('garden1', '1', '2'),
('garden2', '1', '2'),
('garden3', '1', '2');


COMMIT;