'use strict';

const { connectToRabbitMQ, consumerQueue } = require('../dbs/init.rabbit');

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(`Error in consumerToQueue::`, error);
    }
  },
};
module.exports = messageService;
