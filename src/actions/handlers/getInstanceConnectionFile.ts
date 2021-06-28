import { Instance } from "@prisma/client";

export const GET_INSTANCE_CONNECTION_FILE = "GET_INSTANCE_CONNECTION_FILE";

export const getInstanceConnectionFile = async (
  instance: Instance & { publicDnsName: NonNullable<Instance["publicDnsName"]> }
) => {
  return `auto connect:i:1
full address:s:${instance.publicDnsName}
username:s:Administrator`;
};
