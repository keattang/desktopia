import {
  EC2Client,
  TerminateInstancesCommand,
  TerminateInstancesCommandInput,
  TerminateInstancesCommandOutput,
} from "@aws-sdk/client-ec2";

const terminateInstances = (
  region: string,
  options: TerminateInstancesCommandInput
): Promise<TerminateInstancesCommandOutput> => {
  const client = new EC2Client({ region });
  const command = new TerminateInstancesCommand(options);
  return client.send(command);
};

export default terminateInstances;
