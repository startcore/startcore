import {mkdirSync} from 'node:fs'
import {join} from 'node:path'
import {addCreateDto} from './create-dto'
import {addUpdateDto} from './update-dto'
import {modelType} from './utils'

export const addDto = (cwdProject: string, model: modelType) => {
  mkdirSync(join(cwdProject, `backend/src/${model.modelName.toLowerCase()}/dto`))

  addCreateDto(cwdProject, model)
  addUpdateDto(cwdProject, model)
}
