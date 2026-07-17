**Описание проекта**
RequestFlow — веб-приложение для учёта заявок сотрудников. Реализованы:
справочник сотрудников;
создание, редактирование, фильтрация и смена статусов заявок;
отчётность по заявкам;
хранение данных в PostgreSQL.
1. Создание базы данных
psql -U postgres
CREATE DATABASE requestflow_db;
\q
2. Установить зависимости для бэкенда
cd server
npm install
3. Установить зависимости для фронтенда
cd ../client
npm install
4. Инициализация базы данных
cd ../server
npm run db:init
5.  Запуск приложения
npm run dev
cd ../client
npm run dev
6. Перейди по адресу: http://localhost:5173