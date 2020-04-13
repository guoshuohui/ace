/*
 * @adonisjs/ace
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import Mustache from 'mustache'
import { readFileSync } from 'fs'

/**
 * Process string as a template literal string and processes
 * data
 */
export function template (tpl: string, data: Object, isMustache: boolean) {
  if (isMustache) {
    return Mustache.render(tpl, data)
  }

  return tpl.replace(/\$\{([a-zA-Z0-9_-]*)}/g, (_, p1: string) => {
    if (!(p1 in data)) {
      return ''
    }
    return String(data[p1])
  })
}

/**
 * Loads template file from the disk and process it contents
 * using the [[template]] method
 */
export function templateFromFile (file: string, data: object, isMustache: boolean): string {
  const contents = readFileSync(file, 'utf8')
  return template(contents, data, isMustache)
}