import { Command, flags } from '@oclif/command'
import { CustomCommand } from 'vtex'

import { submitApp } from '../modules/submit'

export default class Submit extends Command {
  public static description =
    'Submits the current app, or an specified one, to validation from VTEX App Store team'

  public static examples = [`vtex submit`, `vtex submit myvendor.myapp@1.2.3`]

  public static flags = {
    ...CustomCommand.globalFlags,
    help: flags.help({ char: 'h' }),
  }

  public static strict = false

  public static args = [{ name: 'appId', required: false }]

  public async run() {
    const {
      args: { appId },
    } = this.parse(Submit)

    await submitApp(appId)
  }
}
