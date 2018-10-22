/**
 *
 **/
class TcaBus /* extends I2CBus */ {
  constructor(bus, options) { this.bus = bus; }

  read(cmd, length) {}
  write(cmd, buffer) {}

  readBuffer(length) {}
  writeBuffer(buffer) {}
}

/**
 * Tca9548
 **/
class Tca9548 {
  static from(bus, options) { return Promise.resolve(new Tca9548(bus, options)); }

  constructor(bus, options) {
    this._bus = bus;
  }

  init(options) {
    return Promise.resolve(new TcaBus(this._bus, options));
  }
}

class Common {
  static select(bus, channels) {
    return bus.writeBuffer(Buffer.from([Converter.channelsToMask(channels)]));
  }

  static selectedChannels(bus) {
    return bus.readBuffer(1).then(mask => {
      return Converter.maskToChannels(mask);
    });
  }
}

class Converter {
  static channelsToMask(...channels) { return 3; }
  static maskToChannels(mask) { throw Error('not yet'); }
}

class ChannelManager {

}

module.exports = { Tca9548 };