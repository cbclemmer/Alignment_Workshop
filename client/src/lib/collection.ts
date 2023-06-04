import { getApi, postApi } from "./api"
import { Action, ActionList, ListState } from "./types"
import { createAction } from "./util"

const LOADING = 'LOADING'
const UPDATE = 'UPDATE'

export interface ListActions<DT, C extends string> extends ActionList {
  LOADING: Action<typeof LOADING, C,  boolean>,
  UPDATE: Action<typeof UPDATE, C, DT[]>
}

function runAction<DT, C extends string, K extends keyof ListActions<DT, C>>(component: C, dispatch: any, type: K, payload: ListActions<DT, C>[K]['payload']): Action<K, C, ListActions<DT, C>[K]['payload']> {
  return dispatch(createAction<ListActions<DT, C>, K>(type, component, payload))
}

export class Collection<DT, C extends string> {
  private api_midpoint: string
  public runAction: <K extends keyof ListActions<DT, C>>(type: K, payload: ListActions<DT, C>[K]['payload']) => Action<K, C, ListActions<DT, C>[K]['payload']>

  constructor(component: C, api_midpoint: string, dispatch: any) {
    this.api_midpoint = api_midpoint
    this.runAction = <K extends keyof ListActions<DT, C>>(type: K, payload: ListActions<DT, C>[K]['payload']) => runAction<DT, C, K>(component, dispatch, type, payload)
  }

  private async get(endpoint: string, data: any = { }) {
    return getApi(`${this.api_midpoint}/${endpoint}`, data)
  }

  private async post(endpoint: string, data: DT) {
    return postApi(`${this.api_midpoint}/${endpoint}`, data)
  }

  public async getOne(id: number): Promise<DT | null> {
    this.runAction(LOADING, true)
    let model = null
    try {
      model = await this.get(`/get/${id}`) as DT
    } finally {
      this.runAction(LOADING, false)
    }
    return model
  }

  public async getList(params: any = { }) {
    this.runAction(LOADING, true)
    try {
      const res = await this.get('list', params)
      this.runAction(UPDATE, res.data)
    } finally {
      this.runAction(LOADING, false)
    }
  }

  public async create(data: DT) {
    this.runAction(LOADING, true)
    try {
      const res = await this.post('create', data)
      if (!res) {
        console.error('ERROR: creating tune failed')
        return
      }
    } finally {
      this.runAction(LOADING, false)
    }
  }

  public async edit(data: DT) {
    this.runAction(LOADING, true)
    try {
      const res = await this.post('edit', data)
      if (!res) {
        console.error('ERROR: creating tune failed')
        return
      }
    } finally {
      this.runAction(LOADING, false)
    }
  }

  public async remove(model: DT) {
    this.runAction(LOADING, true)
    try {
      const res = await this.post('delete', model)
      if (!!res.data.error) {
        console.error(res.data.errror)
        return
      }
    } finally {
      this.runAction(LOADING, false)
    }
  }
}

export const createCollectionReducer = <DT, C extends string, K extends keyof ListActions<DT, C>>(component: C) => (
  state: ListState<DT> = { loading: false, items: [] }, 
  action: Action<keyof ListActions<DT, C>, C, ListActions<DT, C>[K]['payload']>
): ListState<DT> => {
  console.log(action)
  if (action.component != component) return state
  switch (action.type) {
      case LOADING:
          return { ...state, loading: action.payload }
      case UPDATE:
          return { ...state, items: action.payload }
      default:
          return state
  }   
}