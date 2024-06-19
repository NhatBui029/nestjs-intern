import { MigrationInterface, QueryRunner } from "typeorm";

export class Lan51717038768712 implements MigrationInterface {
    name = 'Lan51717038768712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tickets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(120) NOT NULL, \`content\` varchar(5000) NOT NULL, \`deadline\` datetime NOT NULL, \`status\` enum ('TODO', 'INPROGRESS', 'DONE') NOT NULL DEFAULT 'TODO', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`memberId\` int NULL, \`projectId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` varchar(1000) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_03b9b76db4a5a56333146c93f8\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`startDate\` datetime NULL, \`endDate\` datetime NULL, \`projectType\` enum ('LABOUR', 'FIX_PRICE', 'MAINTENANCE') NOT NULL, \`profit\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_44dd30ca9c5d27cd9dc16fefaf\` (\`startDate\`), INDEX \`IDX_20437b608d77f713a27199f6c9\` (\`projectType\`), UNIQUE INDEX \`IDX_2187088ab5ef2a918473cb9900\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`member_role\` (\`membersId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_2f5d45180063dd63e614d0195d\` (\`membersId\`), INDEX \`IDX_58409d75287201b63dfb1e60fe\` (\`rolesId\`), PRIMARY KEY (\`membersId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_member\` (\`projectsId\` int NOT NULL, \`membersId\` int NOT NULL, INDEX \`IDX_b6429606f098fc7a27a0551318\` (\`projectsId\`), INDEX \`IDX_2190c3bc515896e9a3e2d8508c\` (\`membersId\`), PRIMARY KEY (\`projectsId\`, \`membersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`deadline\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`memberId\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`projectId\``);
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
        await queryRunner.query(`ALTER TABLE \`project_member\` ADD CONSTRAINT \`FK_b6429606f098fc7a27a05513184\` FOREIGN KEY (\`projectsId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`project_member\` ADD CONSTRAINT \`FK_2190c3bc515896e9a3e2d8508ca\` FOREIGN KEY (\`membersId\`) REFERENCES \`members\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_member\` DROP FOREIGN KEY \`FK_2190c3bc515896e9a3e2d8508ca\``);
        await queryRunner.query(`ALTER TABLE \`project_member\` DROP FOREIGN KEY \`FK_b6429606f098fc7a27a05513184\``);
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
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`projectId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`memberId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`status\` enum ('TODO', 'INPROGRESS', 'DONE') NOT NULL DEFAULT 'TODO'`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`deadline\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`content\` varchar(5000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`title\` varchar(120) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_2190c3bc515896e9a3e2d8508c\` ON \`project_member\``);
        await queryRunner.query(`DROP INDEX \`IDX_b6429606f098fc7a27a0551318\` ON \`project_member\``);
        await queryRunner.query(`DROP TABLE \`project_member\``);
        await queryRunner.query(`DROP INDEX \`IDX_58409d75287201b63dfb1e60fe\` ON \`member_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_2f5d45180063dd63e614d0195d\` ON \`member_role\``);
        await queryRunner.query(`DROP TABLE \`member_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_2187088ab5ef2a918473cb9900\` ON \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_20437b608d77f713a27199f6c9\` ON \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_44dd30ca9c5d27cd9dc16fefaf\` ON \`projects\``);
        await queryRunner.query(`DROP TABLE \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_03b9b76db4a5a56333146c93f8\` ON \`members\``);
        await queryRunner.query(`DROP TABLE \`members\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`tickets\``);
    }

}
