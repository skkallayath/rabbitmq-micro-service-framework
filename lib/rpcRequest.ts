import RpcClient from './client/client';
import { defaultConfiguration } from './config';

const rpcRequest = async (
  serviceName: string,
  event: string,
  ...params: any[]
) => {
  const rpcClient = new RpcClient();
  await rpcClient.connect(defaultConfiguration);
  return rpcClient.request(serviceName, event, params);
};

export default rpcRequest;
