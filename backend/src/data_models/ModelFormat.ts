import { Database } from "sqlite3"
import {DataModel, DataModelAbstract, BaseModel } from "../lib/DataModel.js"

export interface IModelFormat extends BaseModel {
  id: number
  name: string
  systemMessage: string
  userNotation: string
  assistantNotation: string
}

export class ModelFormat extends DataModel implements IModelFormat, DataModelAbstract<IModelFormat> {
  public initialized: boolean = false
  public name: string = ''
  public systemMessage: string = ''
  public userNotation: string = ''
  public assistantNotation: string = ''

  constructor(db: Database, data: IModelFormat | undefined = undefined) {
    super(db, !!data ? data.id : 0)
    if (!!data) {
      this.initialized = true
      this.name = data.name
      this.systemMessage = data.systemMessage
      this.userNotation = data.userNotation
      this.assistantNotation = data.assistantNotation
    }
  }

  public instantiate(data: IModelFormat): ModelFormat {
    return new ModelFormat(this.db, data)
  }

  public async get(id: number): Promise<ModelFormat | null> {
    return ModelFormat.getStatic(this.db, id)
  }

  public async list(): Promise<ModelFormat[] | null> {
    return ModelFormat.listStatic(this.db)
  }

  public async create(data: IModelFormat): Promise<ModelFormat | null> {
    return ModelFormat.createStatic(this.db, data)
  }

  public static async getStatic(db: Database, id: number): Promise<ModelFormat | null> {
    const model = await DataModel.getById(db, 'models', id)
    if (model == null) {
      return null
    }
    return new ModelFormat(db, model as IModelFormat)
  }

  public static async listStatic(db: Database): Promise<ModelFormat[] | null> {
    try {
      const models = await DataModel.dbList(db, 'SELECT * FROM models', [])
      return models.map((m: IModelFormat) => new ModelFormat(db, m))
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public static async createStatic(db: Database, data: IModelFormat): Promise<ModelFormat | null> {
    try {
      await DataModel.run(db, 
        'INSERT INTO models (name, systemMessage, userNotation, assistantNotation) VALUES (?, ?, ?, ?)', 
        [data.name, data.systemMessage, data.userNotation, data.assistantNotation]
      )
      return new ModelFormat(db, data)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public async update(): Promise<boolean> {
    if (!this.initialized) return false
    try {
      await DataModel.run(this.db,
        'UPDATE models SET name = ?, systemMessage = ?, userNotation = ?, assistantNotation = ? WHERE id = ?', 
        [this.name, this.systemMessage, this.userNotation, this.assistantNotation, this.id.toString()]
      )
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  public async delete(): Promise<boolean> {
    if (!this.initialized) return false
    try {
      await DataModel.run(this.db,
        'DELETE FROM models WHERE id = ?', [this.id.toString()]
      )
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}