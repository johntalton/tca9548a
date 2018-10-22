

const { Rasbus } = require('@johntalton/rasbus');

const { Multiplexer } = require('../');


const config = {
  bus: {
    driver: 'i2c',
    id: [1, 0x70]
  }
};

const sensors = [
  { bus: { driver: 'tca', id: [ 0, 0xff] }},
  { bus: { driver: 'tca', id: [ 1, 0xff] }},
]

class Sensor {
  static init(bus) {

  }
}

function setup() {
  return Rasbus.bytype(config.bus.driver).init(...config.bus.id)
    .then(bus => Multiplexer.from(bus));
}

function setupSensors(bus) {
  return bus.init().then(bus => {
    return Promose.all(sensors.map(sensor => Sensor.init(sensor.bus.id)));
  });
}

setup().then(mplex => {
  return mplex.select()
    .then(() => mplex.selectedChannels()
      .then(channels => {
        console.log('selected channels', channels);



        return setupSensors();
      })
    );
})
.catch(e => {
  console.log('top level error', e);
})


