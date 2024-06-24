import { Converter } from './converter.js'

const BYTE_LENGTH_ONE = 1

export class Common {
	/**
	 * @param bus {I2CBus}
	 * @param channels {Array<number>}
	 * @returns {Promise<void>}
	 */
	static setChannels(bus, channels) {
		return bus.i2cWrite(Converter.encodeChannels(channels))
	}

	/**
	 * @param bus {I2CBus}
	 * @returns {Promise<Array<number>>}
	 */
	static async getChannels(bus) {
		const buffer = await bus.i2cRead(BYTE_LENGTH_ONE)
		return Converter.decodeChannels(buffer)
	}
}
