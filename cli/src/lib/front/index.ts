import {execCustom} from '../utils'

const yarnCreateReactApp = async (cwdProject: string, name: string) => {
  await execCustom(cwdProject, `yarn create react-app ${name} --template typescript`)
}

export const createFront = async (cwdProject: string) => {
  await yarnCreateReactApp(cwdProject, 'front')
}
