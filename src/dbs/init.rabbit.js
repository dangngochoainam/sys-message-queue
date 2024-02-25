'use strict';

const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    if (!connection) throw new Error('Connection not established');

    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (error) {
    console.err('Error in connectToRabbitMQ', error);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    const queueName = 'test-queue';
    const message = 'Hello, Nam DNH';

    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, Buffer.from(message));

    await connection.close();
  } catch (error) {
    console.error('Error in connectToRabbitMQForTest', error);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log('Waiting for messages...');

    channel.consume(
      queueName,
      (msg) => {
        console.log(`Received message: ${queueName}::`, msg.content.toString());
      },
      { noAck: true }
    );
  } catch (error) {
    console.error('Error publish message to rabbitMQ::', error);
  }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest, consumerQueue };
