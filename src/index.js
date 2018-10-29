
const throat = require('throat');

/**
 *
 **/
class ChannelManager {
  static get lock() {
    if(ChannelManager._lock === undefined) {
      ChannelManager._lock = throat(1);
    }
    return ChannelManager._lock;
  }

  static wrap(mgr, fn) {
    let error;
    let result;

    return ChannelManager.lock(() => {
      return mgr.before()
        .then(() => fn())
        .then(r => result = r)
        .catch(e => error = e)
        .then(() => mgr.after().catch(e => console.log('deep after fail', e)))
        .then(() => {
          if(error) { throw error; }
          //console.log('returning result', mgr.fnResult)
          return result
        })
    });
  }
}

class SimpleCM extends ChannelManager {
  constructor(tca, channel) {
    super();
    this.tca = tca;
    this.channel = channel;
  }

  before() {
    return this.tca.setChannels([this.channel])
      .then(() => console.log('channel changed before', this.channel))
  }

  after() {
    return this.tca.setChannels([])
      .then(() => console.log('channel changed after'))
  }
}


/**
 *
 **/
class TcaBus /* extends I2CBus */ {
  constructor(bus, tca, channel, options) {;
    this.bus = bus;
    this.manager = new SimpleCM(tca, channel);
  }

  read(cmd, length) {
    return ChannelManager.wrap(this.manager, () => this.bus.read(cmd, length));
  }


  write(cmd, buffer) { throw Error('no impl'); }

  readBuffer(length) { throw Error('no impl') }
  writeBuffer(buffer) { throw Error('no impl') }
}

/**
 * Tca9548
 **/
class Tca9548 {
  static from(impl, bus, options) { return Promise.resolve(new Tca9548(impl, bus, options)); }

  constructor(impl, bus, options) {
    this.impl = impl;
    this._bus = bus;
  }

  init(device, address, options) {
    console.log('init virual bus');
    return this.impl.init(1, address) // todo undo hardcoded device id (this._bus.deviceId)
      .then(bus => {
        const channel = device; // use device id as channel id
        return Promise.resolve(new TcaBus(bus, this, channel, options));
      });
  }

  // direct access to chanenls selection
  getChannels() { return Common.getChannels(this._bus); }
  setChannels(channels) { return Common.setChannels(this._bus, channels); }
}

class Common {
  static setChannels(bus, channels) {
    // console.log('set channels:', channels);
    return bus.writeBuffer(Buffer.from([Converter.channelsToMask(...channels)]));
  }

  static getChannels(bus) {
    return bus.readBuffer(1).then(mask => {
      return Converter.maskToChannels(mask.readUInt8());
    });
  }
}

class Converter {
  static channelsToMask(...channels) {
    if(channels.length === 0) { return 0; }

    return channels.reduce((acc, item) => {
      if(!Number.isInteger(item)|| item < 0 || item >= 8) { throw Error('invalid channel: ' + item); }
      return acc | (1 << item);
    }, 0);
  }

  static maskToChannels(mask) {
    // console.log('mask to channel', mask);
    // todo range(channelCount)
    return [0, 1, 2, 3, 4, 5, 6, 7].filter(idx => {
      return ((mask >> idx) & 1) === 1;
    })
  }
}


module.exports = { Tca9548 };
