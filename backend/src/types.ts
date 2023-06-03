export interface BaseModel {
  id: number
}

export const ModelFormatKeys: (keyof IModelFormat)[] = ['id', 'name', 'systemMessage', 'userNotation', 'assistantNotation']
export interface IModelFormat extends BaseModel {
  id: number
  name: string
  systemMessage: string
  userNotation: string
  assistantNotation: string
}