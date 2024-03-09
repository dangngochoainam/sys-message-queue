'use strict';

const {
  consumerToQueue,
  consumerToQueueNormal,
  consumerToQueueFailed,
} = require('./src/services/consumerQueue.service');
const queueName = 'test-topic';

consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer started ${queueName}`);
  })
  .catch((err) => console.error('Error in server::', err));

// consumerToQueueNormal(queueName)
//   .then(() => {
//     console.log(`Message consumerToQueueNormal started`);
//   })
//   .catch((err) => console.error('Error in server::', err));

// consumerToQueueFailed(queueName)
//   .then(() => {
//     console.log(`Message consumerToQueueFailed started`);
//   })
//   .catch((err) => console.error('Error in server::', err));
