import { Connection, Channel, connect, ConsumeMessage } from "amqplib";
import { deserializeError } from "serialize-error";
import MicroServiceConfig from "../models/MicroServiceConfig";
import MicroServiceResponse from "../models/MicroServiceResponse";

export default class RpcClient {
  private _config: MicroServiceConfig | undefined;

  private _connection: Connection | undefined;

  private _channel: Channel | undefined;

  private _replyQueue: string | undefined;

  connect = async (config: MicroServiceConfig) => {
    this._config = config;
    await this._initilaize();
  };

  private _initilaize = async () => {
    if (!this._config || !this._config.url) {
      throw Error("Invalid configuraton");
    }
    this._connection = await connect(this._config.url);
    this._channel = await this._connection.createChannel();
    const queue = await this._channel.assertQueue(
      "",
      this._config.queueConfigurations || {
        autoDelete: false,
        durable: true,
        arguments: {
          "x-message-ttl": 1000 * 60 * 5,
        },
      }
    );
    this._replyQueue = queue.queue;
  };

  private _consumeReply = async (
    message: ConsumeMessage | null,
    resolve: Function,
    reject: Function
  ) => {
    if (message === null) return;
    const incomingContent: MicroServiceResponse | undefined = message.content
      ? JSON.parse(message.content.toString())
      : undefined;
    // transform response
    const content: any =
      incomingContent && incomingContent.response
        ? incomingContent.response
        : undefined;

    // check for an error signature too
    if (
      content instanceof Error ||
      (content && content.stack && content.message)
    ) {
      reject(deserializeError(content));
    } else {
      resolve(content);
    }
    if (this._channel && this._replyQueue) {
      // delete the queue once it has served request
      this._channel.deleteQueue(this._replyQueue);
    }
    // console.log('\nRPC Q DELETED : ', this.replyQueue);
  };

  _listenForReply = async (resolve: Function, reject: Function) => {
    if (!this._channel || !this._replyQueue) {
      return;
    }
    await this._channel.consume(
      this._replyQueue,
      (msg) => this._consumeReply(msg, resolve, reject),
      {
        noAck: true,
      }
    );
  };

  request = async (rpcQueue: string, event: string, params: any[]) => {
    return new Promise(async (resolve, reject) => {
      if (!this._channel) {
        reject(new Error("No channel found"));
        return;
      }
      await this._channel.sendToQueue(
        rpcQueue,
        // eslint-disable-next-line new-cap
        Buffer.from(JSON.stringify({ event, params })),
        {
          replyTo: this._replyQueue,
        }
      );
      await this._listenForReply(resolve, reject);
    });
  };

  async close() {
    if (this._connection) {
      await this._connection.close();
    }
  }
}
