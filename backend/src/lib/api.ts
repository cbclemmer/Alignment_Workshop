import { Application } from "express"
import { Database } from "sqlite3"

import { DataModel } from './DataModel.js'
import { BaseModel } from "../types.js"

export type ApiParams<I extends BaseModel> = {
  urlName: string
  model: DataModel<I>  
}

export class DataModelApi<I extends BaseModel> {
  constructor(params: ApiParams<I>, app: Application, db: Database) {
    const makeStaticUrl = (endPoint: string) => `/api/${params.urlName}/${endPoint}`
    const makeUrl = (endPoint: string) => `/api/${params.urlName}/${endPoint}/:id`

    // /api/foo/get/:id
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

    // /api/foo/list
    app.get(makeStaticUrl('list'), async (req: any, res: any) => {
      const models = await params.model.list()
      if (models == null) {
        res.json([])
        return
      }
      res.json(models)
    })

    // /api/foo/create
    app.post(makeStaticUrl('create'), async (req: any, res: any) => {
      const data: I = req.body
      data.id = parseInt(data.id.toString())
      const model = await params.model.create(data)
      res.json(model)
    })

    // /api/foo/edit
    app.post(makeStaticUrl('edit'), async (req: any, res: any) => {
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

    // /api/foo/delete
    app.post(makeStaticUrl('delete'), async (req: any, res: any) => {
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
