import { Database } from "sqlite3"
import { Application } from 'express'

import { Model } from "../types.js"

export default function(app: Application, db: Database) {
  app.get('/api/models/:id/', (req: any, res: any) => {
    const id = req.params.id
    if (!id) {
      res.json({ error: 'No model id supplied'})
      return
    }
    db.all('SELECT * FROM Models WHERE id = ' + id, (err: any, rows: any) => {
      if (err || rows.length == 0) {
        console.error('ERROR: ' + err.message)
        res.json({ error: `Model id: ${id} not found`})
        return
      }
      res.json(rows[0])
    })
  })

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
  
  app.post('/api/edit-model', async (req: any, res: any) => {
    const model: Model = req.body
    if (!model.id) {
      const err = 'Error: No id supplied for editing model'
      console.error(err)
      res.json({ error: err })
      return
    }
    await db.run('UPDATE models SET name = ?, systemMessage = ?, userNotation = ?, assistantNotation = ? WHERE id = ?', [model.name, model.systemMessage, model.userNotation, model.assistantNotation, model.id], (err: any) => {
      if (err) {
        console.error('ERROR: ' + err.message)
        res.json(false)
        return
      }
      res.json(true)
    })
  })
  
  app.post('/api/delete-model', async (req: any, res: any) => {
    const model: Model = req.body
    if (!model.id) {
      const err = 'Error: No id supplied for editing model'
      console.error(err)
      res.json({ error: err })
      return
    }
    await db.run('DELETE FROM models WHERE id = ?', [model.id], (err: any) => {
      if (err) {
        console.error('ERROR: ' + err.message)
        res.json(false)
        return
      }
      res.json(true)
    })
  })
}