/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Runner, assert } from '@athenna/test'

await Runner.setTsEnv()
  .addPlugin(assert())
  .addPath('tests/unit/**/*.ts')
  .setCliArgs(process.argv.slice(2))
  .setGlobalTimeout(5000)
  .run()
