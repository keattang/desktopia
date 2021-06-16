import { EC2Client, paginateDescribeInstanceTypes } from "@aws-sdk/client-ec2";
import _getPaginatedObjects from "./_getPaginatedObjects";

const getInstanceTypes = _getPaginatedObjects(
  EC2Client,
  paginateDescribeInstanceTypes,
  "InstanceTypes"
);

export default getInstanceTypes;
