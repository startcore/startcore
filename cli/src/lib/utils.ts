/* eslint-disable camelcase */
import * as util from 'node:util'
import * as child_process from 'node:child_process'
const exec = util.promisify(child_process.exec)

export const execCustom = async (cwdProject: string, cmd: string): Promise<void> => {
  try {
    await exec(cmd, {
      cwd: cwdProject,
    })
    // console.log('stdout:', stdout)
    // console.log('stderr:', stderr)
  } catch (error) {
    console.error(error)
  }
}

export const settings = {
  models: [
    {
      modelName: 'Person',
      fields: [
        {
          name: 'id',
          type: 'String',
          modifiers: {
            isArray: false,
            isOptional: false,
          },
          attributes: {
            '@id': '',
            '@default': {
              value: 'uuid()',
            },
          },
          isCreate: false,
          isUpdate: false,
        },
        {
          name: 'email',
          type: 'String',
          modifiers: {
            isArray: false,
            isOptional: false,
          },
          attributes: {
            '@default': {
              value: 'uuid()',
            },
          },
          isCreate: true,
          isUpdate: true,
        },
      ],
    },
  ],
}
