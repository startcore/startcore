import {Command, CliUx} from '@oclif/core'
import {
  initFolder,
  createAdmin,
  createFront,
  createBackend,
} from '../lib'
import * as Listr from 'listr'

export default class Init extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = []

  public async run(): Promise<void> {
    const nameProject = await CliUx.ux.prompt('Name project?', {default: `examplev${Date.now()}`})
    let cwdProject = ''
    const tasks = new Listr([
      {
        title: 'create folder',
        task: () => {
          cwdProject = initFolder(nameProject)
        },
      },
      {
        title: 'init project',
        task: () => {
          return new Listr([
            {
              title: 'init Admin',
              task: () => {
                return createAdmin(cwdProject)
              },
            },
            {
              title: 'init Front',
              task: () => {
                return createFront(cwdProject)
              },
            },
            {
              title: 'init Backend',
              task: () => {
                return createBackend(cwdProject, nameProject)
              },
            },
          ],
          // {concurrent: true},
          )
        },
      },
    ])

    tasks.run().catch((error: Error) => {
      console.error(error)
    })
  }
}
