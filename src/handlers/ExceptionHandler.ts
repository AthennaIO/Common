import { Macroable } from '#src/helpers/Macroable'

export type ExceptionHandlerContext = {
  error: any
}

export class ExceptionHandler extends Macroable {
  public async handle(_: ExceptionHandlerContext): Promise<void> {
    throw new Error('Not implemented')
  }
}
