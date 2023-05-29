import { Database } from "sqlite3"
import { Application } from 'express'
import { callPythonScript } from "./util.js"

import express from 'express'
import cors from 'cors'
import sqlite from 'sqlite3'
import modelApi from './api/models.js'

const db: Database = new sqlite.Database('data.db')

db.run('CREATE TABLE IF NOT EXISTS models (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, systemMessage TEXT, userNotation TEXT, assistantNotation TEXT)');

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

modelApi(app, db)

app.post('/api/generate', async (req: any, res: any) => {
  try {
    const response = await callPythonScript(req.body.prompt);
    res.json(response.toString());
  } catch (error: any) {
    console.error('Error making request to language model API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});