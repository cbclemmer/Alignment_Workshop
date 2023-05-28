const { spawn } = require('child_process')
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const sqlite = require('sqlite3')

const db = new sqlite.Database('data.db')

type Model = {
  id: number
  name: string
  systemMessage: string
  userNotation: string
  assistantNotation: string
}

db.run('CREATE TABLE IF NOT EXISTS models (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, systemMessage TEXT, userNotation TEXT, assistantNotation TEXT)');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/models', async (req: any, res: any) => {
  db.all('SELECT * FROM models', (err: any, rows: any) => {
    if (err) {
      console.error('ERROR: ' + err.message)
      res.json(null)
      return
    }
    res.json(rows)
  })
})

app.post('/api/create-model', async (req: any, res: any) => {
  const model: Model = req.body
  await db.run('INSERT INTO models (name, systemMessage, userNotation, assistantNotation) VALUES (?, ?, ?, ?)', [model.name, model.systemMessage, model.userNotation, model.assistantNotation], (err: any) => {
    if (err) {
      console.error('ERROR: ' + err.message)
      res.json(false)
      return
    }
    res.json(true)
  })
})

app.get('/api/models/:id/', (req: any, res: any) => {
  const id = req.params.id
  if (!id) {
    res.json({ error: 'No model id supplied'})
    return
  }
  db.all('SELECT TOP 1 * FROM Models WHERE id = ' + id, (err: any, rows: any) => {
    if (err || rows.length == 0) {
      console.error('ERROR: ' + err.message)
      res.json({ error: `Model id: ${id} not found`})
      return
    }
    res.json(rows[0])
  })
})

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

function callPythonScript(inputString: string): Promise<string> {
  return new Promise<string>((res, rej) => {
    const pythonScript = spawn('python3', ['oob_api.py', inputString]);
  
    pythonScript.stdout.on('data', (data: any) => {
      console.log('API request successful')
      res(data)
    });
  
    pythonScript.stderr.on('data', (data: any) => {
      console.error('API request failure')
      rej(data.toString())
    });
  
    pythonScript.on('close', (code: any) => { });
  })
}