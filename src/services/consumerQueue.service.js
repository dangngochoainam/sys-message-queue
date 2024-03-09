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

  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      const notiQueue = 'notificationQueueProcess';
      const timeExpried = 15000;
      setTimeout(() => { // test truong hop tin nhan khong duoc xu li de vào dlx
        channel.consume(
          notiQueue,
          (msg) => {
            console.log(
              `Received message: ${notiQueue}::`,
              msg.content.toString()
            );
          },
          { noAck: true }
        );
      }, timeExpried);
    } catch (error) {
      console.error(`Error in consumerToQueueNormal::`, error);
    }
  },

  consumerToQueueFailed: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();

      const notificationExchangeDLX = 'notificationExDLX';
      const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';
      const notiQueueHanler = 'notificationQueueHotFix';

      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHanler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      await channel.consume(
        queueResult.queue,
        (msg) => {
          console.log(
            `Received message failed, Please hot fix: ${notiQueueHanler}::`,
            msg.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(`Error in consumerToQueueFailed::`, error);
    }
  },
};
module.exports = messageService;
