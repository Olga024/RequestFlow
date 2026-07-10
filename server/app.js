const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api', requestRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Мок-сервер работает' });
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`   📋 Сотрудники: http://localhost:${PORT}/api/employees`);
  console.log(`   📋 Заявки: http://localhost:${PORT}/api/requests`);
  console.log(`   📊 Отчёт: http://localhost:${PORT}/api/reports`);
});
