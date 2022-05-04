import {mkdirSync} from 'node:fs'
import {join} from 'node:path'
import {config} from '../../../utils'
import {addCreateDto} from './create-dto'
import {addUpdateDto} from './update-dto'

export const addDto = (cwdProject: string, model: config['models'][number]): void => {
  mkdirSync(join(cwdProject, `backend/src/${model.modelName.toLowerCase()}/dto`))

  addCreateDto(cwdProject, model)
  addUpdateDto(cwdProject, model)
}
