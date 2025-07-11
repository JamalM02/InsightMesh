import { CreateEventRequest, CreateEventResponse } from '@grpc/service';
import { sendKafkaEvent } from '@libs/kafka';

export const createEvent = async (request: CreateEventRequest): Promise<CreateEventResponse> => {
  const result = await sendKafkaEvent(request);
  return result;
};
