import RpcClient from './client/client';
import { MicroService } from './micro-service';
import { defaultConfiguration } from './config';

const createServer = async (serviceName: string) => {
  const microService = new MicroService(serviceName);
  await microService.connect(defaultConfiguration);
  return microService;
};

export default createServer;
