/*
 * @adonisjs/ace
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { logger, sticker } from '@poppinss/cliui'
import { Exception } from '@poppinss/utils'
import { CommandConstructorContract, SerializedCommand } from '../Contracts'

/**
 * Raised when a required argument is missing
 */
export class MissingArgumentException extends Exception {
	public command: CommandConstructorContract
	public argumentName: string

	/**
	 * A required argument is missing
	 */
	public static invoke(
		name: string,
		command: CommandConstructorContract
	): MissingArgumentException {
		const exception = new this(`Missing required argument "${name}"`, 500, 'E_MISSING_ARGUMENT')

		exception.argumentName = name
		exception.command = command
		return exception
	}

	/**
	 * Handle itself
	 */
	public handle(error: MissingArgumentException) {
		logger.error(logger.colors.red(`Missing required argument "${error.argumentName}"`))
	}
}

/**
 * Raised when an the type of a flag is not as one of the excepted type
 */
export class InvalidFlagException extends Exception {
	public command?: CommandConstructorContract
	public flagName: string
	public expectedType: string

	/**
	 * Flag type validation failed.
	 */
	public static invoke(
		prop: string,
		expected: string,
		command?: CommandConstructorContract
	): InvalidFlagException {
		const exception = new this(`"${prop}" must be defined as "${expected}"`, 500, 'E_INVALID_FLAG')

		exception.flagName = prop
		exception.command = command
		exception.expectedType = expected
		return exception
	}

	/**
	 * Handle itself
	 */
	public handle(error: InvalidFlagException) {
		logger.error(
			logger.colors.red(`Expected "--${error.flagName}" to be a valid "${error.expectedType}"`)
		)
	}
}

/**
 * Raised when command is not registered with kernel
 */
export class InvalidCommandException extends Exception {
	public commandName: string
	public suggestions: SerializedCommand[] = []

	public static invoke(
		commandName: string,
		suggestions: SerializedCommand[]
	): InvalidCommandException {
		const exception = new this(
			`"${commandName}" is not a registered command`,
			500,
			'E_INVALID_COMMAND'
		)

		exception.commandName = commandName
		exception.suggestions = suggestions
		return exception
	}

	/**
	 * Handle itself
	 */
	public handle(error: InvalidCommandException) {
		logger.error(`"${error.commandName}" command not found`)

		if (!error.suggestions.length) {
			return
		}

		logger.log('')
		const suggestionLog = sticker().heading('Did you mean one of these?')
		error.suggestions.forEach(({ commandName }) => {
			suggestionLog.add(logger.colors.yellow(commandName))
		})

		suggestionLog.render()
	}
}
