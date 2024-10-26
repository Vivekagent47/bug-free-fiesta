import { MigrationInterface, QueryRunner } from 'typeorm';

export class Create1729951668736 implements MigrationInterface {
  name = 'Create1729951668736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "data" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "parentId" integer, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_eab38eb12a3ec6df8376c95477c" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15fbcbc67663c6bfc07b354c22" ON "tags_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b1a2a7ed45c29179b5ad51548a" ON "tags_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ADD CONSTRAINT "FK_9f9590cc11561f1f48ff034ef99" FOREIGN KEY ("parentId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags_closure" ADD CONSTRAINT "FK_15fbcbc67663c6bfc07b354c22c" FOREIGN KEY ("id_ancestor") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags_closure" ADD CONSTRAINT "FK_b1a2a7ed45c29179b5ad51548a1" FOREIGN KEY ("id_descendant") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tags_closure" DROP CONSTRAINT "FK_b1a2a7ed45c29179b5ad51548a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags_closure" DROP CONSTRAINT "FK_15fbcbc67663c6bfc07b354c22c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" DROP CONSTRAINT "FK_9f9590cc11561f1f48ff034ef99"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b1a2a7ed45c29179b5ad51548a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15fbcbc67663c6bfc07b354c22"`,
    );
    await queryRunner.query(`DROP TABLE "tags_closure"`);
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
