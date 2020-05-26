/* eslint-disable max-classes-per-file */
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
    let error = false;
    let result;

    return ChannelManager.lock(() => {
      return mgr.before()
        .then(() => fn())
        .then(r => { result = r; return; })
        .catch(e => { error = e; })
        .then(() => mgr.after().catch(e => console.log('deep after fail', e)))
        .then(() => {
          if(error) { throw error; }
          //console.log('returning result', mgr.fnResult)
          return result;
        })
    });
  }
}

/**
 *
 **/
class SimpleCM extends ChannelManager {
  constructor(tca, channel) {
    super();
    this.tca = tca;
    this.channel = channel;
  }

  before() {
    return this.tca.setChannels([this.channel])
      .then(() => console.log('channel changed before', this.channel));
  }

  after() {
    return this.tca.setChannels([])
      .then(() => console.log('channel changed after'));
  }
}


/**
 *
 **/
class TcaBus /* extends I2CBus */ {
  constructor(bus, tca, channel, options) {
    this.bus = bus;
    this.manager = new SimpleCM(tca, channel);
  }

  read(cmd, length) {
    return ChannelManager.wrap(this.manager, () => this.bus.read(cmd, length));
  }


  write(cmd, buffer) { throw new Error('no implementation'); }

  readBuffer(length) { throw new Error('no implementation') }
  writeBuffer(buffer) { throw new Error('no implementation') }
}