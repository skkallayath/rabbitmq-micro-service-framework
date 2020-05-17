import { Options } from "amqplib";

export default interface MicroServiceConfig {
  url: string;
  queueConfigurations?: Options.AssertQueue;
}
