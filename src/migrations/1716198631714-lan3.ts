import { MigrationInterface, QueryRunner } from "typeorm";

export class Lan31716198631714 implements MigrationInterface {
    name = 'Lan31716198631714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_371bb366fc603c6ea2bcd699865\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_7ea2738d6dd730beda6fc2f2b46\``);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`member_role\` (\`membersId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_2f5d45180063dd63e614d0195d\` (\`membersId\`), INDEX \`IDX_58409d75287201b63dfb1e60fe\` (\`rolesId\`), PRIMARY KEY (\`membersId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`deadline\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`memberId\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`title\` varchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`content\` varchar(5000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`deadline\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`status\` enum ('TODO', 'INPROGRESS', 'DONE') NOT NULL DEFAULT 'TODO'`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`memberId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`projectId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`nhatdz\` varchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_371bb366fc603c6ea2bcd699865\` FOREIGN KEY (\`memberId\`) REFERENCES \`members\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_7ea2738d6dd730beda6fc2f2b46\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`member_role\` ADD CONSTRAINT \`FK_2f5d45180063dd63e614d0195d5\` FOREIGN KEY (\`membersId\`) REFERENCES \`members\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`member_role\` ADD CONSTRAINT \`FK_58409d75287201b63dfb1e60fe8\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member_role\` DROP FOREIGN KEY \`FK_58409d75287201b63dfb1e60fe8\``);
        await queryRunner.query(`ALTER TABLE \`member_role\` DROP FOREIGN KEY \`FK_2f5d45180063dd63e614d0195d5\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_7ea2738d6dd730beda6fc2f2b46\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_371bb366fc603c6ea2bcd699865\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`nhatdz\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`memberId\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`deadline\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`title\` varchar(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`status\` enum ('TODO', 'INPROGRESS', 'DONE') NOT NULL DEFAULT 'TODO'`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`projectId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`memberId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`deadline\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`content\` varchar(5000) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_58409d75287201b63dfb1e60fe\` ON \`member_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_2f5d45180063dd63e614d0195d\` ON \`member_role\``);
        await queryRunner.query(`DROP TABLE \`member_role\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_7ea2738d6dd730beda6fc2f2b46\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_371bb366fc603c6ea2bcd699865\` FOREIGN KEY (\`memberId\`) REFERENCES \`members\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
