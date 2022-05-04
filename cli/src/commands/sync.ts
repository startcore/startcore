import {Command} from '@oclif/core'
import {sync} from '../lib'

export default class Sync extends Command {
  async run(): Promise<void> {
    sync()
  }
}
