-- Revert MyLittleGarden:init from pg

BEGIN;

DROP TABLE IF EXISTS "user", "crop", "parcel", "user_has_crop", "favorite_crop";

COMMIT;
