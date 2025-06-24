import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class CreateDefaultCategories1700000000002 {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const categories = [
        {
          id: uuidv4(),
          name: 'Công nghệ thông tin',
          slug: 'cong-nghe-thong-tin',
          description: 'Các khóa học về lập trình, phát triển phần mềm, AI/ML',
          color: '#3B82F6',
          order_index: 1,
        },
        {
          id: uuidv4(),
          name: 'Kinh doanh',
          slug: 'kinh-doanh',
          description: 'Các khóa học về quản trị kinh doanh, marketing, tài chính',
          color: '#10B981',
          order_index: 2,
        },
        {
          id: uuidv4(),
          name: 'Ngôn ngữ',
          slug: 'ngon-ngu',
          description: 'Các khóa học ngoại ngữ, tiếng Anh, tiếng Nhật, tiếng Hàn',
          color: '#F59E0B',
          order_index: 3,
        },
        {
          id: uuidv4(),
          name: 'Thiết kế',
          slug: 'thiet-ke',
          description: 'Các khóa học về thiết kế đồ họa, UI/UX, nghệ thuật',
          color: '#EF4444',
          order_index: 4,
        },
      ];

      for (const category of categories) {
        await queryRunner.query(
          `INSERT INTO categories (id, name, slug, description, color, order_index) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            category.id,
            category.name,
            category.slug,
            category.description,
            category.color,
            category.order_index,
          ],
        );
      }

      await queryRunner.commitTransaction();
      console.log('✅ Default categories created successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error creating default categories:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
