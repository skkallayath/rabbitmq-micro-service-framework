import MicroServiceConfig from "./models/MicroServiceConfig";

export const defaultConfiguration: MicroServiceConfig = {
  url: process.env.RABBITMQ_URL || "amqp://localhost:5672",
};
