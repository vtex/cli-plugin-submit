import { Command, flags } from '@oclif/command'
import { CustomCommand } from 'vtex'

export default class Submit extends Command {
  static description = 'Submits the current app, or an specified one, to validation from VTEX App Store team'

  static examples = [`vtex submit`, `vtex submit myvendor.myapp@1.2.3`]

  static flags = {
    ...CustomCommand.globalFlags,
    help: flags.help({ char: 'h' }),
  }

  static strict = false

  static args = [{ name: 'appId', required: false }]

  async run() {
    const {
      args: { appId },
    } = this.parse(Submit)

    this.log(appId)
  }
}
