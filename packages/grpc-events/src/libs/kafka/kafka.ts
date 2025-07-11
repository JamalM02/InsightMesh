import { Kafka } from 'kafkajs';
import { Partitioners } from 'kafkajs';
import { env } from '@libs/env';
export const kafka = new Kafka({
  clientId: env('KAFKA_CLIENT_ID'),
  brokers: env('KAFKA_URL').split(','),
});

export const kafkaProducer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
