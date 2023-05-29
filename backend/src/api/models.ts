import { Database } from "sqlite3"
import { Application } from 'express'

import { IModel, Model } from "../models/Model.js"

export default function(app: Application, db: Database) {
  app.get('/api/models/:id/', async (req: any, res: any) => {
    const id = req.params.id
    if (!id) {
      res.json({ error: 'No model id supplied'})
      return
    }
    const model = await Model.get(db, id)
    if (model == null) {
      res.json({ error: `Model id: ${id} not found`})
      return
    }
    res.json(model)
  })

  app.get('/api/models', async (req: any, res: any) => {
    const models = await Model.list(db)
    if (models == null) {
      res.json([])
      return
    }
    res.json(models)
  })
  
  app.post('/api/create-model', async (req: any, res: any) => {
    const data: IModel = req.body
    data.id = parseInt(data.id.toString())
    const model = await Model.create(db, data)
    res.json(model)
  })
  
  app.post('/api/edit-model', async (req: any, res: any) => {
    const data: IModel = req.body
    if (!data.id) {
      const err = 'Error: No id supplied for editing model'
      console.error(err)
      res.json({ error: err })
      return
    }
    data.id = parseInt(data.id.toString())
    const model = new Model(db, data)
    res.json(await model.update())
  })
  
  app.post('/api/delete-model', async (req: any, res: any) => {
    const data: Model = req.body
    if (!data.id) {
      const err = 'Error: No id supplied for editing model'
      console.error(err)
      res.json({ error: err })
      return
    }
    data.id = parseInt(data.id.toString())
    const model = new Model(db, data)
    res.json(await model.delete())
  })
}