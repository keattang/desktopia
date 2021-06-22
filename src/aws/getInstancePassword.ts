import { EC2Client, GetPasswordDataCommand } from "@aws-sdk/client-ec2";

const getInstancePassword = async (region: string, instanceId: string) => {
  const client = new EC2Client({ region });
  const command = new GetPasswordDataCommand({ InstanceId: instanceId });
  const resp = await client.send(command);
  return resp.PasswordData;
};

export default getInstancePassword;
