/* eslint-disable camelcase */
import * as util from 'node:util'
import * as child_process from 'node:child_process'
const exec = util.promisify(child_process.exec)

export const execCustom = async (
  cwdProject: string,
  cmd: string,
): Promise<void> => {
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

export const config = {
  models: {
    'f319adc6-0b0f-4def-85ef-0cfd5a44b6c4': {
      id: 'f319adc6-0b0f-4def-85ef-0cfd5a44b6c4',
      name: 'Person',
      fields: {
        'a8852e74-611d-4012-a633-d0c3a6d53dce': {
          id: 'a8852e74-611d-4012-a633-d0c3a6d53dce',
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
        '758d2789-f6af-40b6-b425-94643a02ae5d': {
          id: '758d2789-f6af-40b6-b425-94643a02ae5d',
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
      },
    },
  },
}

export type config = {
  models: {
    [key in string]: {
      name: string;
      id: string;
      fields: {
        [key in string]: {
          id: string;
          name: string;
          type: string;
          modifiers: {
            isArray: boolean;
            isOptional: boolean;
          };
          attributes: {
            '@id'?: string;
            '@default'?: {
              value: string;
            };
          };
          isCreate: boolean;
          isUpdate: boolean;
        };
      };
    };
  };
};
