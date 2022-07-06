import {existsSync, mkdirSync, rmSync} from 'node:fs'
import {join} from 'node:path'
import {config} from '../../utils'
import {addControllerBase, addController} from './controller'
import {addDto} from './dto'
import {addModule} from './module'
import {addServiceBase, addService} from './service'

const makeBaseCrud = (cwdProject: string, model: config['models'][string]) => {
  const path = join(
    cwdProject,
    `backend/src/baseModule/${model.name.toLowerCase()}`,
  )

  if (existsSync(path)) {
    rmSync(path, {recursive: true, force: true})
  }

  mkdirSync(path, {recursive: true})

  addDto(path, model)
  addControllerBase(path, model.name)
  addServiceBase(path, model.name)
}

const makeCrud = (cwdProject: string, model: config['models'][string]) => {
  const path = join(cwdProject, `backend/src/${model.name.toLowerCase()}`)

  if (existsSync(path)) {
    return
  }

  mkdirSync(path)
  addController(path, model.name)
  addModule(path, model.name)
  addService(path, model.name)
}

export const addCrud = (
  cwdProject: string,
  model: config['models'][string],
): void => {
  makeCrud(cwdProject, model)
  makeBaseCrud(cwdProject, model)
}
