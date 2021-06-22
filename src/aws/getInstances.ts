import {
  DescribeInstancesCommandInput,
  EC2Client,
  Instance,
  paginateDescribeInstances,
  Reservation,
} from "@aws-sdk/client-ec2";
import _getPaginatedObjects from "./_getPaginatedObjects";

const getInstances = async (
  region: string,
  options: DescribeInstancesCommandInput
) => {
  const getReservations = _getPaginatedObjects(
    EC2Client,
    paginateDescribeInstances,
    "Reservations"
  );
  const reservations = await getReservations(region, options);
  return reservations.reduce((agg: Instance[], reservation: Reservation) => {
    if (reservation.Instances) {
      agg.push(...reservation.Instances);
    }
    return agg;
  }, []);
};

export default getInstances;
