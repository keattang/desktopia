import { InstanceType, Location } from ".prisma/client";
import Container from "@material-ui/core/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";
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
    prisma.instanceType.findMany({
      orderBy: [
        {
          name: "asc",
        },
        {
          vCpus: "asc",
        },
      ],
    }),
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
  const router = useRouter();

  const handleSubmit = async (values: ICreateInstanceData) => {
    await createInstance(values);
    router.push("/instances");
  };

  return (
    <Container>
      <h1>Launch Instance</h1>
      <CreateInstanceForm
        availableLocations={availableLocations}
        availableInstanceTypes={availableInstanceTypes}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default CreateInstance;
