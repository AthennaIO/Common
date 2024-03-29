/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type InstallPackageOptions = {
  /**
   * Define the path where the install command should ran.
   *
   * @default Path.pwd()
   */
  cwd?: string

  /**
   * Define if the libraries should be installed as
   * devDependencies or not.
   *
   * @default false
   */
  dev?: boolean

  /**
   * Add additional arguments for the registry CLI you
   * are using to install the libraries.
   *
   * @default []
   */
  args?: string[]

  /**
   * Define if the registry should use cached libraries when
   * installing it.
   *
   * @default false
   */
  cached?: boolean

  /**
   * Define if the libraries installation should display the
   * logs from the registry or not.
   *
   * @default true
   */
  silent?: boolean

  /**
   * Throw errors if something goes wrong when trying to
   * install the libraries.
   *
   * @default true
   */
  reject?: boolean

  /**
   * Define the registry that will be used to install the
   * dependencies. Tested only with `npm`, but
   * you can try to use whatever you like.
   *
   * @default "npm"
   */
  registry?: string
}
