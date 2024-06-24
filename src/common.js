import { Converter } from './converter.js'

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
		const buffer = await bus.i2cRead(1)
		return Converter.decodeChannels(buffer)
	}
}
