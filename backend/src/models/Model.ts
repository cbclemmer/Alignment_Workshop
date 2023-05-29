import { Database } from "sqlite3"
import DataModel from "./DataModel.js"

export interface IModel {
  id: number
  name: string
  systemMessage: string
  userNotation: string
  assistantNotation: string
}

export class Model extends DataModel implements IModel {
  public name: string
  public systemMessage: string
  public userNotation: string
  public assistantNotation: string

  constructor(db: Database, data: IModel) {
    super(db, data.id)
    this.name = data.name
    this.systemMessage = data.systemMessage
    this.userNotation = data.userNotation
    this.assistantNotation = data.assistantNotation
  }

  public static async get(db: Database, id: number): Promise<Model | null> {
    const model = await DataModel.getById(db, 'models', id)
    if (model == null) {
      return null
    }
    return new Model(db, model as IModel)
  }

  public static async list(db: Database): Promise<Model[] | null> {
    try {
      const models = await DataModel.dbList(db, 'SELECT * FROM models', [])
      return models.map((m: IModel) => new Model(db, m))
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public static async create(db: Database, data: IModel): Promise<Model | null> {
    try {
      await DataModel.run(db, 
        'INSERT INTO models (name, systemMessage, userNotation, assistantNotation) VALUES (?, ?, ?, ?)', 
        [data.name, data.systemMessage, data.userNotation, data.assistantNotation]
      )
      return new Model(db, data)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public async update(): Promise<boolean> {
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