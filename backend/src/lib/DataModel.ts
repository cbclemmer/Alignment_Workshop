import { Database } from "sqlite3"
import lo from 'lodash'
import { BaseModel } from "../types.js"

export class DataModel<I extends BaseModel> {
  public id: number
  public table: string
  protected db: Database
  public initialized: boolean = false
  public data: I | undefined
  public keyList: (keyof I)[]

  constructor(table: string, db: Database, keyList: (keyof I)[], id: number = 0, data: I | undefined = undefined) {
    this.db = db
    this.id = id
    this.table = table
    this.data = data
    this.initialized = !!data
    this.keyList = keyList
  }

  public static dbList<I extends BaseModel>(db: Database, q: string, params: string[]): Promise<I[]> {
    return new Promise((res: any, rej: any) => {
      db.all(q, params, (err: any, rows: any) => {
        if (err) {
          rej(err.message)
          return
        }
        res(rows)
      })
    })
  }

  public static run(db: Database, q: string, params: string[]): Promise<string | null> {
    return new Promise((res: any, rej: any) => {
      db.run(q, params, (err: any) => {
        if (err) {
          rej(err.message)
          return
        }
        res(null)
      })
    })
  }

  public static async getById<I extends BaseModel>(db: Database, table: string, id: number): Promise<I | null> {
    try {
      console.log(`Getting id: ${id} from ${table}`)
      const res = await DataModel.dbList(db, `SELECT * FROM ${table} WHERE id = ?`, [id.toString()]) as I[]
      if (res.length == 0) {
        return null
      }
      return res[0]
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public instantiate(data: I): DataModel<I> {
    return new DataModel<I>(this.table, this.db, this.keyList, data.id, data)
  }

  public async get(id: number): Promise<I | null> {
    return DataModel.getById<I>(this.db, this.table, id)
  }

  public async list(params: any = { }): Promise<I[] | null> {
    try {
      const whereClause = Object.keys(params).map(k => `${k} = ?`).join(', ')
      const query = `SELECT * FROM ${this.table} ${whereClause.length > 0 ? 'WHERE' : ''} ${whereClause}`
      console.log('Running create query')
      console.log(query)

      const queryData = lo.values(params) as string[]
      return await DataModel.dbList(this.db, query, queryData)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public async create(data: I): Promise<I | null> {
    try {
      const usedKeys = lo.reject(this.keyList, (k: string) => k == 'id')
      const keys = usedKeys.join(', ')
      const values = lo.times(usedKeys.length, lo.constant('?')).join(', ')
      const query = `INSERT INTO ${this.table} (${keys}) VALUES (${values})`
      console.log('Running create query')
      console.log(query)

      const queryData = lo.values(lo.omit(data, 'id')) as string[]
      console.log(queryData)

      await DataModel.run(this.db, 
        query, 
        queryData
      )
      return data
    } catch (e) {
      console.error(e)
      return null
    }
  }

  public async update(): Promise<boolean> {
    if (!this.initialized) return false
    try {
      const dataValues: string[] = lo.values(lo.omit(this.data, 'id'))
      dataValues.push(this.id.toString())

      const query = `UPDATE ${this.table} SET ${Object.keys(lo.omit(this.data, 'id')).map((key: string) => `${key} = ?`)} WHERE id = ?`
      console.log('Running update query: ')
      console.log(query)
      console.log(dataValues)

      await DataModel.run(this.db,
        query,
        dataValues
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
        `DELETE FROM ${this.table} WHERE id = ?`, [this.id.toString()]
      )
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

