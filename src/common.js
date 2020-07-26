const { Converter } = require('./converter.js');

/**
 * Device static interface providing core api.
 **/
class Common {
  static setChannels(bus, channels) {
    // console.log('set channels:', channels);
    return bus.writeBuffer(Buffer.from([Converter.channelsToMask(channels)]));
  }

  static getChannels(bus) {
    return bus.readBuffer(1).then(mask => {
      return Converter.maskToChannels(mask.readUInt8());
    });
  }
}

module.exports = { Common };
