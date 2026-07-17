import pool from '../config/db';
import fs from 'fs';
import path from 'path';
import { fakerRU } from '@faker-js/faker';

const getRandom = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const dummyDepartaments = [
    {
        name: 'IT',
        roles: [
            'Разработчик',
            'Тестировщик',
        ],
    },
    {
        name: 'Бухгалтерия',
        roles: [
            'Главный бухгалтер',
            'Бухгалтер',
        ],
    },
    {
        name: 'Отдел продаж',
        roles: [
            'Менеджер',
        ],
    },
    {
        name: 'HR',
        roles: [
            'Специалист по кадрам',
        ],
    }
];

const generateEmployees = (limit: number) => {
    const sex = Math.random() < 0.5 ? 'male' : 'female';
    const list: string[][] = [];
    for (let i = 0; i <= limit; i++) {
        const department = getRandom(dummyDepartaments);
        list.push([
            fakerRU.person.fullName({ sex }),
            department.name,
            getRandom(department.roles),
        ]);
    }
    return list;
}

const employeeList = generateEmployees(1000);

const generateIssues = (limit: number) => {
    const list: (string | number)[][] = [];
    for (let i = 0; i <= limit; i++) {
        const issueNumber = `ISSUE-${Date.now()}`;
        const author = Math.floor(Math.random() * employeeList.length)+1;
        const executor = Math.floor(Math.random() * employeeList.length)+1;
        const title = fakerRU.lorem.words(5);
        const deadline = fakerRU.date.between({ from: '2026-01-01', to: '2026-12-12' }).toISOString().slice(0, 19).replace('T', ' ');
        list.push([
            issueNumber,
            author,
            executor,
            title,
            deadline,
            getRandom(['new', 'in_progress', 'done'])
        ]);
    };
    return list;
}

const issuesList = generateIssues(1000000);

const initDb = async () => {
    const client = await pool.connect();
    try {
        const sql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf8');
        await client.query(sql);
        console.log('✅ Таблицы созданы');
    } catch (err) {
        console.error('❌ Ошибка инициализации БД:', err);
    }
    try {
        for (const emp of employeeList) {
            await client.query(
                `INSERT INTO requestflow_schema.employees (full_name, department, position) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (id) DO NOTHING`,
                emp
            );
        }
        console.log('✅ Начальные сотрудники добавлены');
    } catch (err) {
        console.error('❌ Создания сотрудников:', err);
    }
    try {
        for (const issue of issuesList)
            await client.query(`
      INSERT INTO requestflow_schema.issues (number, author_id, executor_id, description, deadline, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (number) DO NOTHING`,
                issue
            );
        console.log('✅ Тестовые заявки добавлены');
    } catch (err) {
        console.error('❌ Создания заявок:', err);
    } finally {
        client.release();
        process.exit(0);
    }
};

initDb();