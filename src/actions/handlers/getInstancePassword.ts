import { Instance } from "@prisma/client";
import decryptPassword from "../../utilities/decryptPassword";

export const GET_INSTANCE_PASSWORD = "GET_INSTANCE_PASSWORD";

export const getInstancePassword = async (
  instance: Instance & { password: NonNullable<Instance["password"]> }
) => {
  return decryptPassword(instance.password);
};
