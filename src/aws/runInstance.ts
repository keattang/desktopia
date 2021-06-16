import {
  EC2Client,
  RunInstancesCommand,
  RunInstancesCommandInput,
  RunInstancesCommandOutput,
} from "@aws-sdk/client-ec2";

const runInstance = (
  region: string,
  options: RunInstancesCommandInput
): Promise<RunInstancesCommandOutput> => {
  const client = new EC2Client({ region });
  const command = new RunInstancesCommand(options);
  return client.send(command);
};

export default runInstance;
