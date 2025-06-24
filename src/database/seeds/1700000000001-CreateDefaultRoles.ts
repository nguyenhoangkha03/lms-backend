import { DataSource } from 'typeorm';

export class CreateDefaultRoles1700000000001 {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      // Create roles table if not exists (this should be in migration)
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS roles (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(50) UNIQUE NOT NULL,
          description TEXT,
          is_system_role BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Insert default roles
      const roles = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'super_admin',
          description: 'Super Administrator with all permissions',
          is_system_role: true,
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          name: 'admin',
          description: 'Administrator with management permissions',
          is_system_role: true,
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          name: 'teacher',
          description: 'Teacher with course creation and management permissions',
          is_system_role: true,
        },
        {
          id: '00000000-0000-0000-0000-000000000004',
          name: 'student',
          description: 'Student with learning permissions',
          is_system_role: true,
        },
      ];

      for (const role of roles) {
        await queryRunner.query(
          `INSERT IGNORE INTO roles (id, name, description, is_system_role) VALUES (?, ?, ?, ?)`,
          [role.id, role.name, role.description, role.is_system_role],
        );
      }

      await queryRunner.commitTransaction();
      console.log('✅ Default roles created successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error creating default roles:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
