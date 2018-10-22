

const { Rasbus } = require('@johntalton/rasbus');

const { Multiplexer } = require('../');


const config = {
  bus: {
    driver: 'i2c',
    id: [1, 0x70]
  }
};

function setup() {
  return Rasbus.bytype(config.bus.driver).init(...config.bus.id)
    .then(bus => Multiplexer.from(bus));
}

setup().then(mplex => {
  return mplex.select()
    .then(() => mplex.selectedChannels()
      .then(channels => {
        console.log('channels', channels);
      })
    );
})
.catch(e => {
  console.log('top level error', e);
})
