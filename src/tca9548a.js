import { Common } from './common.js'

export const I2C_ADDRESSES = [
	0x70, 0x71, 0x72, 0x73,
	0x74, 0x75, 0x76, 0x77
]

export const [ DEFAULT_I2C_ADDRESS ] = I2C_ADDRESSES

export class Tca9548a {
	#bus

	static from(bus, options = {}) { return new Tca9548a(bus, options) }
	constructor(bus, options = {}) { this.#bus = bus }

	getChannels() { return Common.getChannels(this.#bus) }
	setChannels(channels) { return Common.setChannels(this.#bus, channels) }
}
