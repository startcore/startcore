import {writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {execCustom} from '../../utils'
import {prismaEnv, prismaService, initPrismaSchema} from './prisma-file'
export {syncPrismaSchema} from './sync-prisma-schema'

export const addPrisma = async (cwdProject: string): Promise<void> => {
  await execCustom(join(cwdProject, 'backend'), 'yarn add prisma --dev')
  await execCustom(join(cwdProject, 'backend'), 'yarn add @prisma/client')
  await execCustom(join(cwdProject, 'backend'), 'yarn prisma init')
  writeFileSync(join(cwdProject, 'backend/prisma/schema.prisma'), initPrismaSchema, 'utf8')
  writeFileSync(join(cwdProject, 'backend/.env'), prismaEnv, 'utf8')
  writeFileSync(join(cwdProject, 'backend/src/prisma.service.ts'), prismaService, 'utf8')
  await execCustom(join(cwdProject, 'backend'), 'yarn prisma migrate dev --name init')
  await execCustom(join(cwdProject, 'backend'), 'yarn prisma generate')
}
