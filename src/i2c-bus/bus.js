/* eslint-disable max-classes-per-file */
const throat = require('throat');

const { I2CBus } = require('@johntalton/and-other-delights');

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



module.exports = { I2CTca9548Bus };
