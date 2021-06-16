import { EC2Client, paginateDescribeSubnets } from "@aws-sdk/client-ec2";
import _getPaginatedObjects from "./_getPaginatedObjects";

const getSubnets = _getPaginatedObjects(
  EC2Client,
  paginateDescribeSubnets,
  "Subnets"
);

export default getSubnets;
