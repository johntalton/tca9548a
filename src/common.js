import { Converter } from './converter.js'

/**
 * Device static interface providing core api.
 **/
export class Common {
  /**
   * @param bus {I2CBus}
   * @param channels {Array<number>}
   * @returns {Promise<void>}
   */
  static setChannels(bus, channels) {
    return bus.i2cWrite(Uint8Array.from([ Converter.channelsToMask(channels) ]))
  }

  /**
   * @param bus {I2CBus}
   * @returns {Promise<Array<number>>}
   */
  static async getChannels(bus) {
    const abuffer = await bus.i2cRead(1)
    const maskBuffer = new Uint8Array(abuffer)
    const mask = maskBuffer[0]

    return Converter.maskToChannels(mask)
  }
}
