import { InstanceType, Location } from ".prisma/client";
import Container from "@material-ui/core/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import CreateInstanceForm from "../../components/CreateInstanceForm";
import prisma from "../../prisma";

interface IServerSideProps {
  availableLocations: Location[];
  availableInstanceTypes: InstanceType[];
}

export const getServerSideProps: GetServerSideProps<IServerSideProps> = async ({
  params,
}) => {
  const [locations, instanceTypes] = await Promise.all([
    prisma.location.findMany(),
    prisma.instanceType.findMany(),
  ]);

  return {
    props: {
      availableLocations: locations,
      availableInstanceTypes: instanceTypes,
    },
  };
};

interface ICreateInstanceData {
  locationId: string;
  instanceTypeId: string;
}

const createInstance = async (data: ICreateInstanceData) => {
  const resp = await fetch("/api/instances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await resp.json();
};

const CreateInstance = ({
  availableLocations,
  availableInstanceTypes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container>
      <h1>Start Instance</h1>
      <CreateInstanceForm
        availableLocations={availableLocations}
        availableInstanceTypes={availableInstanceTypes}
        onSubmit={createInstance}
      />
    </Container>
  );
};

export default CreateInstance;
