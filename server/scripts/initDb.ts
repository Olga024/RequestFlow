import pool from '../config/db';
import fs from 'fs';
import path from 'path';

const initDb = async () => {
    const client = await pool.connect();
    try {
        const sql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf8');
        await client.query(sql);
        console.log('✅ Таблицы созданы');
        const employees = [
            ['Иванов Иван Иванович', 'IT', 'Разработчик'],
            ['Петрова Ольга Сергеевна', 'Бухгалтерия', 'Главный бухгалтер'],
            ['Сидоров Петр Алексеевич', 'Отдел продаж', 'Менеджер'],
            ['Кузнецова Анна Владимировна', 'HR', 'Специалист по кадрам'],
            ['Михайлов Дмитрий Николаевич', 'IT', 'Тестировщик'],
        ];
        for (const emp of employees) {
            await client.query(
                `INSERT INTO employees (full_name, department, position) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (id) DO NOTHING`,
                emp
            );
        }
        console.log('✅ Начальные сотрудники добавлены');

        await client.query(`
      INSERT INTO requests (number, author_id, executor_id, description, deadline, status)
      VALUES 
        ('REQ-001', 1, 5, 'Настроить почтовый сервер', NOW() + INTERVAL '7 days', 'new'),
        ('REQ-002', 2, 3, 'Подготовить отчёт по налогам', NOW() + INTERVAL '3 days', 'in_progress'),
        ('REQ-003', 4, 1, 'Обновить штатное расписание', NOW() + INTERVAL '10 days', 'done')
      ON CONFLICT (number) DO NOTHING
    `);
        console.log('✅ Тестовые заявки добавлены');
    } catch (err) {
        console.error('❌ Ошибка инициализации БД:', err);
    } finally {
        client.release();
        process.exit(0);
    }
};

initDb();