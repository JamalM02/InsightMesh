import dotenv from 'dotenv';
import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';

dotenv.config();

const { ADDRESS, NAMESPACE, TASK_QUEUE } = process.env;

async function run() {
  const connection = await NativeConnection.connect({
    address: ADDRESS,
  });
  try {
    const worker = await Worker.create({
      connection,
      namespace: NAMESPACE!,
      taskQueue: TASK_QUEUE!,

      workflowsPath: require.resolve('./workflows'),
      activities,
    });

    await worker.run();
  } finally {
    await connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
