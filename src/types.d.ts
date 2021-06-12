import { InstanceType, Location } from ".prisma/client";
import { MappedDateToIso } from "./utilities/serialiseDates";

type AutoDateFields = "dateCreated" | "dateUpdated";

type PreSaveInstanceType = Omit<InstanceType, "id" | AutoDateFields>;

type SerialisedInstanceType = MappedDateToIso<InstanceType, AutoDateFields>;

type SerialisedLocation = MappedDateToIso<Location, AutoDateFields>;
