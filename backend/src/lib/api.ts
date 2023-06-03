import { Application } from "express"
import { Database } from "sqlite3"

import {BaseModel, DataModelAbstract } from './DataModel.js'

export type ApiParams<I> = {
  urlName: string
  model: DataModelAbstract<I>  
}

export class DataModelApi<I extends BaseModel> {
  constructor(params: ApiParams<I>, app: Application, db: Database) {
    const makeUrl = (endPoint: string) => `/api/${params.urlName}/${endPoint}`

    app.get(makeUrl('get'), async (req: any, res: any) => {
      const id = req.params.id
      if (!id) {
        res.json({ error: 'No model id supplied'})
        return
      }
      const model = await params.model.get(id)
      if (model == null) {
        res.json({ error: `Model id: ${id} not found`})
        return
      }
      res.json(model)
    })

    app.get(makeUrl('list'), async (req: any, res: any) => {
      const models = await params.model.list()
      if (models == null) {
        res.json([])
        return
      }
      res.json(models)
    })

    app.post(makeUrl('create'), async (req: any, res: any) => {
      const data: I = req.body
      data.id = parseInt(data.id.toString())
      const model = await params.model.create(data)
      res.json(model)
    })

    app.post(makeUrl('edit'), async (req: any, res: any) => {
      const data: I = req.body
      if (!data.id) {
        const err = 'Error: No id supplied for editing model'
        console.error(err)
        res.json({ error: err })
        return
      }
      data.id = parseInt(data.id.toString())
      const model = params.model.instantiate(data)
      res.json(await model.update())
    })

    app.post(makeUrl('delete'), async (req: any, res: any) => {
      const data: I = req.body
      if (!data.id) {
        const err = 'Error: No id supplied for editing model'
        console.error(err)
        res.json({ error: err })
        return
      }
      data.id = parseInt(data.id.toString())
      const model = params.model.instantiate(data)
      res.json(await model.delete())
    })
  }

}
