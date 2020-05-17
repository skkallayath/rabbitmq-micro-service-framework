import RpcClient from "./client/client";
import { MicroService } from "./micro-service";
import { defaultConfiguration } from "./config";
import MicroServiceConfig from "./models/MicroServiceConfig";

const createServer = async (
  serviceName: string,
  config?: MicroServiceConfig
) => {
  const microService = new MicroService(serviceName);
  await microService.connect(config || defaultConfiguration);
  return microService;
};

export default createServer;
