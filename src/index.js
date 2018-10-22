
/**
 * Multiplexer
 **/
class Multiplexer {
  static from(bus) { return Promise.resolve(new Tca9548(bus)); }
}

class Tca9548 {
  constructor(bus) {
    this._bus = bus;
  }

  select(channels) { return Common.select(this._bus, channels); }

  selectedChannels() { return Common.selectedChannels(this._bus); }
}

class Common {
  static select(bus, ...channels) {
    console.log('channels', channels);
    let chMask = 3;
    return bus.writeBuffer(Buffer.from([chMask]));
  }

  static selectedChannels(bus) {
    return bus.readBuffer(1);
  }
}

module.exports = { Multiplexer };
