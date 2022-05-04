import {existsSync, mkdirSync, rmSync} from 'node:fs'
import {join} from 'node:path'
import {config} from '../../utils'
import {addController} from './controller'
import {addDto} from './dto'
import {addModule} from './module'
import {addService} from './service'
export const addCrud = (cwdProject: string, model: config['models'][number]): void => {
  const path = join(cwdProject, `backend/src/${model.modelName.toLowerCase()}`)

  if (existsSync(path)) {
    rmSync(path, {recursive: true, force: true})
  }

  mkdirSync(path)
  addDto(cwdProject, model)
  addController(cwdProject, model.modelName)
  addModule(cwdProject, model.modelName)
  addService(cwdProject, model.modelName)
}
