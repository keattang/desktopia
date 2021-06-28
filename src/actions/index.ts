import { Dispatcher } from "./Dispatcher";
import {
  getInstanceConnectionFile,
  GET_INSTANCE_CONNECTION_FILE,
} from "./handlers/getInstanceConnectionFile";
import {
  getInstancePassword,
  GET_INSTANCE_PASSWORD,
} from "./handlers/getInstancePassword";
import { createInstance, CREATE_INSTANCE } from "./handlers/createInstance";
import { createLocation, CREATE_LOCATION } from "./handlers/createLocation";
import {
  terminateInstance,
  TERMINATE_INSTANCE,
} from "./handlers/terminateInstance";
import logActionMiddleware from "./middleware/logActionMiddleware";

export const dispatcher = new Dispatcher();

dispatcher.registerMiddleware(logActionMiddleware);

dispatcher.registerAction(CREATE_INSTANCE, createInstance);
dispatcher.registerAction(CREATE_LOCATION, createLocation);
dispatcher.registerAction(TERMINATE_INSTANCE, terminateInstance);
dispatcher.registerAction(GET_INSTANCE_PASSWORD, getInstancePassword);
dispatcher.registerAction(
  GET_INSTANCE_CONNECTION_FILE,
  getInstanceConnectionFile
);
