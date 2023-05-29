import { Database } from "sqlite3";

export default class DataModel {
  public id: number
  protected db: Database

  constructor(db: Database, id: number) {
    this.db = db
    this.id = id
  }

  public static dbList(db: Database, q: string, params: string[]): Promise<any[]> {
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

  public static async getById(db: Database, table: string, id: number): Promise<Object | null> {
    try {
      const res = await DataModel.dbList(db, 'SELECT * FROM ? WHERE id = ?', [table, id.toString()])
      if (res.length == 0) {
        return null
      }
      return res[0]
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

