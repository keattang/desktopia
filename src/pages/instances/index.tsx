import Container from "@material-ui/core/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import prisma from "../../prisma";
import InstanceList from "../../components/InstanceList";
import { Box, styled } from "@material-ui/core";
import { ExpandedInstance } from "../../types";

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

const Instances = ({
  instances,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <StyledContainer>
      <h1>Instances</h1>
      <Box flexGrow={1}>
        <InstanceList instances={instances} />
      </Box>
    </StyledContainer>
  );
};

export default Instances;
