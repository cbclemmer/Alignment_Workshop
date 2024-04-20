import { Database } from "sqlite3"
import { Application } from 'express'

import express from 'express'
import cors from 'cors'
import sqlite from 'sqlite3'
import _ from "lodash"

import { DataModel } from "./lib/DataModel.js"
import { DataModelApi } from "./lib/api.js"
import { callPythonScript, createTuneFile, getConfig } from "./util.js"
import { ConversationKeys, IConversation, IMessage, IFormat, ITag, ITune, MessageKeys, FormatKeys, TagKeys, TuneKeys } from "./types.js"

const db: Database = new sqlite.Database('data.db')

db.run("\
CREATE TABLE IF NOT EXISTS formats (\
  id INTEGER PRIMARY KEY AUTOINCREMENT, \
  name TEXT, \
  systemMessage TEXT, \
  userNotation TEXT, \
  assistantNotation TEXT\
);");

db.run("\
CREATE TABLE IF NOT EXISTS tunes (\
  id INTEGER PRIMARY KEY AUTOINCREMENT, \
  name TEXT,\
  format_id INTEGER,\
  FOREIGN KEY (format_id) REFERENCES formats(id)\
);");

db.run("\
CREATE TABLE IF NOT EXISTS conversations (\
  id INTEGER PRIMARY KEY AUTOINCREMENT, \
  tune_id INTEGER,\
  name TEXT,\
  FOREIGN KEY (tune_id) REFERENCES tunes(id) \
);");

db.run("\
CREATE TABLE IF NOT EXISTS tags (\
  id INTEGER PRIMARY KEY AUTOINCREMENT, \
  conversation_id INTEGER,\
  name TEXT,\
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) \
);");

db.run("\
CREATE TABLE IF NOT EXISTS messages (\
  id INTEGER PRIMARY KEY AUTOINCREMENT, \
  conversation_id INTEGER,\
  text_data TEXT,\
  isUser INTEGER,\
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) \
);");

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const formatModel = new DataModel<IFormat>('formats', db, FormatKeys)
new DataModelApi({
  urlName: 'format',
  model: formatModel
}, app, db)

new DataModelApi({
  urlName: 'tune',
  model: new DataModel<ITune>('tunes', db, TuneKeys)
}, app, db)

const messageModel = new DataModel<IMessage>('messages', db, MessageKeys)
new DataModelApi({
  urlName: 'message',
  model: messageModel
}, app, db)

const convModel = new DataModel<IConversation>('conversations', db, ConversationKeys)
new DataModelApi({
  urlName: 'conversation',
  model: convModel
}, app, db)

new DataModelApi({
  urlName: 'tag',
  model: new DataModel<ITag>('tags', db, TagKeys)
}, app, db)

app.get('/api/pwd-check', async (req: any, res: any) => {
    const config = getConfig()
    const pwd = req.query.pwd
    if (config.pwd != pwd) {
      res.json({ error: 'Incorrect password'})
      return
    }
    res.json({ error: false })
    return
})

app.post('/api/generate', async (req: any, res: any) => {
  try {
    const response = await callPythonScript(req.body.prompt);
    res.json(response.toString());
  } catch (error: any) {
    console.error('Error making request to language model API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/api/tunes/download', async (req: any, res: any) => {
  const { tune_id, format_id } = req.query
  if (!tune_id) {
    res.json({ error: 'Missing tune id' })
    return
  }
  if (!format_id) {
    res.json({ error: 'Missing format id' })
    return
  }
  const conversations = await convModel.list({ tune_id })
  if (conversations == null) {
    res.json({ error: 'Could not get conversations for tune id: ' + tune_id })
    return
  }
  const format = await formatModel.get(format_id)
  if (format == null) {
    res.json({ error: 'Could not get format for id: ' + format_id })
    return
  }
  const messages = await Promise.all(conversations.map(async (c: IConversation) => await messageModel.list({ conversation_id: c.id })))
  const downloadString = createTuneFile(_.flatMap(messages, (m: IMessage[] | null) => m == null ? [] : m), format)
  
  res.setHeader('Content-Disposition', 'attachment; filename=tune.jsonl')
  res.setHeader('Content-Type', 'text/plain')
  res.send(downloadString)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})