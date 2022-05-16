import {existsSync, mkdirSync, rmSync} from 'node:fs'
import {join} from 'node:path'
import {config} from '../../utils'
import {addController} from './controller'
import {addDto} from './dto'
import {addModule} from './module'
import {addService} from './service'
export const addCrud = (cwdProject: string, model: config['models'][string]): void => {
  const path = join(cwdProject, `backend/src/${model.name.toLowerCase()}`)

  if (existsSync(path)) {
    rmSync(path, {recursive: true, force: true})
  }

  mkdirSync(path)
  addDto(cwdProject, model)
  addController(cwdProject, model.name)
  addModule(cwdProject, model.name)
  addService(cwdProject, model.name)
}
