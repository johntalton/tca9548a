const { Common } = require('./common.js');

const I2C_ADDRESSES = [
  0x70, 0x71, 0x72, 0x73,
  0x74, 0x75, 0x76, 0x77
];
const [DEFAULT_I2C_ADDRESS] = I2C_ADDRESSES;

/**
 * Device instance object API and Factory.
 **/
class Tca9548 {
  static from(bus, options) { return Promise.resolve(new Tca9548(bus, options)); }

  constructor(bus, options) { this._bus = bus; }

  // direct access to channels selection
  getChannels() { return Common.getChannels(this._bus); }
  setChannels(channels) { return Common.setChannels(this._bus, channels); }
}

module.exports = { Tca9548, DEFAULT_I2C_ADDRESS };
