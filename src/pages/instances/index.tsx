import Container from "@material-ui/core/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import prisma from "../../prisma";
import InstanceList from "../../components/InstanceList";
import { Box, Button, styled } from "@material-ui/core";
import {
  ExpandedInstance,
  HandleRequestPassword,
  HandleTerminateInstance,
} from "../../types";
interface IServerSideProps {
  instances: ExpandedInstance[];
}

export const getServerSideProps: GetServerSideProps<IServerSideProps> =
  async () => {
    const instances = await prisma.instance.findMany({
      orderBy: [
        {
          dateCreated: "asc",
        },
      ],
      include: {
        location: true,
        instanceType: true,
      },
    });

    return {
      props: { instances: instances },
    };
  };

const StyledContainer = styled(Container)({
  paddingBottom: "24px",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
});

const handleRequestPassword: HandleRequestPassword = async (instanceId) => {
  const resp = await fetch(`/api/instances/${instanceId}/password`, {
    method: "GET",
  });
  const payload = await resp.json();
  return payload.data.password;
};

const handleTerminateInstance: HandleTerminateInstance = async (instanceId) => {
  const resp = await fetch(`/api/instances/${instanceId}/terminate`, {
    method: "POST",
  });
  return resp.json();
};

const Instances = ({
  instances,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <StyledContainer>
      <h1>Instances</h1>
      <Box flexGrow={1}>
        <InstanceList
          onRequestPassword={handleRequestPassword}
          onTerminateInstance={handleTerminateInstance}
          instances={instances}
        />
      </Box>
      <Link href="/instances/create" passHref>
        <Button>Launch Instance</Button>
      </Link>
    </StyledContainer>
  );
};

export default Instances;
