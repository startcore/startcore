import {execCustom} from '../utils'
import {addSwagger} from './add-swagger'
import {setSettings} from './add-settigns'
import {addPrisma} from './prisma'

export const createBackend = async (cwdProject: string, nameProject: string) => {
  console.log(cwdProject)
  await execCustom(cwdProject, 'npx @nestjs/cli new backend --package-manager yarn')
  await addSwagger(cwdProject, nameProject)
  await addPrisma(cwdProject)
  setSettings(cwdProject)
}
