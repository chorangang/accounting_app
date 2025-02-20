-- AlterTable
CREATE SEQUENCE account_titles_id_seq;
ALTER TABLE "account_titles" ALTER COLUMN "id" SET DEFAULT nextval('account_titles_id_seq');
ALTER SEQUENCE account_titles_id_seq OWNED BY "account_titles"."id";
