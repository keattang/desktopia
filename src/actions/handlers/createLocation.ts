import { Location } from "@prisma/client";
import prisma from "../../prisma";

export const CREATE_LOCATION = "CREATE_LOCATION";

export const createLocation = async (data: Location) => {
  return prisma.location.create({
    data: {
      name: data.name,
      region: data.region,
      vpcId: data.vpcId,
      subnetIds: data.subnetIds,
    },
  });
};
