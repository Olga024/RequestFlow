import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes';
import requestRoutes from './routes/requestRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api', requestRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});