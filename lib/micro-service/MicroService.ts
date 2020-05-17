import { Connection, connect, Channel, Message, ConsumeMessage } from 'amqplib';
import { serializeError } from 'serialize-error';
import MicroServiceConfig from './MicroServiceConfig';
import MicroServiceContent from './MicroServiceContent';
import MicroServiceResponse from './MicroServiceResponse';

export default class MicroService {
  private _serivceName: string;

  private _config: MicroServiceConfig | undefined;

  private _connection: Connection | undefined;

  private _channel: Channel | undefined;

  private _handlers: { [key: string]: Function } = {};

  constructor(name: string) {
    this._serivceName = name;
    this._config = undefined;
    this._connection = undefined;
    this._channel = undefined;
    this._handlers = {};
  }

  registerHandler = (name: string, handler: Function) => {
    this._handlers[name] = handler;
  };

  connect = async (config: MicroServiceConfig) => {
    this._config = config;
    await this._initialize();
  };

  private _serializeResponse = (response: any): MicroServiceResponse => {
    if (
      response instanceof Error ||
      (response && response.stack && response.message)
    ) {
      const serializedError = serializeError(response);
      return { response: serializedError };
    }
    return { response };
  };

  private _sendResponseBack = async (msg: ConsumeMessage, reply: any) => {
    if (this._channel) {
      const response: MicroServiceResponse = this._serializeResponse(reply);
      const responseBuffer: Buffer = Buffer.from(JSON.stringify(response));
      await this._channel.sendToQueue(msg.properties.replyTo, responseBuffer, {
        correlationId: msg.properties.correlationId,
      });
      await this._channel.ack(msg);
    }
  };

  private _findHandler = (content: MicroServiceContent) => {
    if (!this._handlers || !content || !content.event) {
      return;
    }
    return this._handlers[content.event];
  };

  private _consumeMessage = async (
    message: ConsumeMessage | null
  ): Promise<void> => {
    if (!message || !message.content) return;

    const content: MicroServiceContent = JSON.parse(message.content.toString());

    const handler = this._findHandler(content);
    if (!handler) {
      return;
    }

    const response = await handler(...content.params);

    await this._sendResponseBack(message, response);
  };

  private _initialize = async () => {
    if (!this._config || !this._serivceName || !this._config.url) {
      throw Error('Invalid configuraton');
    }
    this._connection = await connect(this._config.url);
    this._channel = await this._connection.createChannel();
    await this._channel.assertQueue(
      this._serivceName,
      this._config.queueConfigurations || {
        autoDelete: false,
        durable: true,
        arguments: {
          'x-message-ttl': 1000 * 60 * 5,
        },
      }
    );

    await this._channel.consume(this._serivceName, this._consumeMessage);
  };

  closeConnection = async () => {
    if (this._connection) {
      await this._connection.close();
    }
  };
}
