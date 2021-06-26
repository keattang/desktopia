import Container from "@material-ui/core/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { SUPPORTED_REGIONS } from "../../constants";
import CreateLocationForm from "../../components/CreateLocationForm";
import { Subnet, Vpc } from "@aws-sdk/client-ec2";
import { CreateLocationData } from "../../types";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: { availableRegions: SUPPORTED_REGIONS },
  };
};

const createLocation = async (data: CreateLocationData) => {
  const resp = await fetch("/api/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await resp.json();
};

const fetchVpcs = async (region: string): Promise<Vpc[]> => {
  const resp = await fetch(`/api/vpcs?region=${region}`, {
    method: "GET",
  });
  return (await resp.json()).data;
};

const fetchSubnets = async (
  region: string,
  vpcId: string
): Promise<Subnet[]> => {
  const resp = await fetch(`/api/vpcs/${vpcId}/subnets?region=${region}`, {
    method: "GET",
  });
  return (await resp.json()).data;
};

const CreateLocation = ({
  availableRegions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container>
      <h1>Create Location</h1>
      <CreateLocationForm
        availableRegions={availableRegions}
        onSubmit={createLocation}
        onFetchVpcs={fetchVpcs}
        onFetchSubnets={fetchSubnets}
      />
    </Container>
  );
};

export default CreateLocation;
