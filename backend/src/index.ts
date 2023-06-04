import { Database } from "sqlite3"
import { Application } from 'express'
import { callPythonScript } from "./util.js"

import express from 'express'
import cors from 'cors'
import sqlite from 'sqlite3'
import { DataModel } from "./lib/DataModel.js"
import { DataModelApi } from "./lib/api.js"
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
  name TEXT\
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
  text_data TEXT,\
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

new DataModelApi({
  urlName: 'format',
  model: new DataModel<IFormat>('formats', db, FormatKeys)
}, app, db)

new DataModelApi({
  urlName: 'tune',
  model: new DataModel<ITune>('tunes', db, TuneKeys)
}, app, db)

new DataModelApi({
  urlName: 'message',
  model: new DataModel<IMessage>('messages', db, MessageKeys)
}, app, db)

new DataModelApi({
  urlName: 'conversation',
  model: new DataModel<IConversation>('conversations', db, ConversationKeys)
}, app, db)

new DataModelApi({
  urlName: 'tag',
  model: new DataModel<ITag>('tags', db, TagKeys)
}, app, db)

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