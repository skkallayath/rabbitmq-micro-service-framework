import RpcClient from "./client/client";
import { defaultConfiguration } from "./config";
import MicroServiceConfig from "./models/MicroServiceConfig";

const rpcRequest = async (
  serviceName: string,
  event: string,
  ...params: any[]
) => {
  const rpcClient = new RpcClient();
  await rpcClient.connect(defaultConfiguration);
  return rpcClient.request(serviceName, event, params);
};

const rpcRequestWihConfig = async (
  config: MicroServiceConfig,
  serviceName: string,
  event: string,
  ...params: any[]
) => {
  const rpcClient = new RpcClient();
  await rpcClient.connect(config || defaultConfiguration);
  return rpcClient.request(serviceName, event, params);
};

export { rpcRequest, rpcRequestWihConfig };
export default { rpcRequest, rpcRequestWihConfig };
