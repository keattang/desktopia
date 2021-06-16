import { EC2Client, paginateDescribeSubnets } from "@aws-sdk/client-ec2";
import _getPaginatedObjects from "./_getPaginatedObjects";

const getSubnets = _getPaginatedObjects<
  typeof EC2Client,
  typeof paginateDescribeSubnets,
  "Subnets"
>(EC2Client, paginateDescribeSubnets, "Subnets");

export default getSubnets;
