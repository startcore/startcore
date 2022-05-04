import {writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {execCustom} from '../utils'
import {addApp} from './add-app'
import {dataProvider} from './data-provider-file'
import {addModule} from './module'

const yarnCreateReactApp = async (cwdProject: string, name: string) => {
  await execCustom(cwdProject, `yarn create react-app ${name} --template typescript`)
}

export const createAdmin = async (cwdProject: string): Promise<void> => {
  await yarnCreateReactApp(cwdProject, 'admin')
  await execCustom(join(cwdProject, 'admin'), 'yarn add react-admin prop-types')
  writeFileSync(join(cwdProject, 'admin', 'src', 'dataProvider.ts'), dataProvider)
  addApp(cwdProject, [])
}

export const syncAdmin = async (cwdProject: string, settings: any): Promise<void> => {
  addApp(cwdProject, settings.models)
  for (const model of settings.models) {
    addModule(cwdProject, model)
  }
}
