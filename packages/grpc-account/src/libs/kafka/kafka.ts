import { Kafka, logLevel } from 'kafkajs';
import { env } from '@libs/env';
import { handleEvent } from '@libs/kafka/event-handler';
import { logger } from '@insightmesh/node-common';

export const startKafkaConsumer = async (): Promise<void> => {
  const serviceName = env('SERVICE_NAME');
  const topic = env('KAFKA_TOPIC');

  const kafka = new Kafka({
    clientId: env('KAFKA_CLIENT_ID'),
    brokers: env('KAFKA_URL').split(','),
    logLevel: logLevel.ERROR,
  });

  const consumer = kafka.consumer({ groupId: env('KAFKA_GROUP_ID'), sessionTimeout: 30000 });

  await consumer.connect();

  await consumer.subscribe({ topic: env('KAFKA_TOPIC'), fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const parsed = JSON.parse(message.value?.toString() || '{}');
        await handleEvent(parsed);
      } catch (error) {
        console.log(error);
        logger.error('Kafka message error:', error);
      }
    },
  });

  logger.debug(`Kafka consumer started for ${serviceName}, topic: ${topic}`);
};
