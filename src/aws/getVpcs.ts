import { EC2Client, paginateDescribeVpcs } from "@aws-sdk/client-ec2";
import _getPaginatedObjects from "./_getPaginatedObjects";

const getVpcs = _getPaginatedObjects(EC2Client, paginateDescribeVpcs, "Vpcs");

export default getVpcs;
