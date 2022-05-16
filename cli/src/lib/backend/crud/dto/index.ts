import {mkdirSync} from 'node:fs'
import {join} from 'node:path'
import {config} from '../../../utils'
import {addCreateDto} from './create-dto'
import {addUpdateDto} from './update-dto'

export const addDto = (cwdProject: string, model: config['models'][string]): void => {
  mkdirSync(join(cwdProject, `backend/src/${model.name.toLowerCase()}/dto`))

  addCreateDto(cwdProject, model)
  addUpdateDto(cwdProject, model)
}
