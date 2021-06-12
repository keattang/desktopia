import Container from "@material-ui/core/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import prisma from "../../prisma";
import InstanceList from "../../components/InstanceTypeList";
import { Box, styled } from "@material-ui/core";
import serialiseDates from "../../utilities/serialiseDates";
import { SerialisedInstanceType } from "../../types";

interface IServerSideProps {
  instanceTypes: SerialisedInstanceType[];
}

export const getServerSideProps: GetServerSideProps<IServerSideProps> =
  async () => {
    const instanceTypes = await prisma.instanceType.findMany({
      orderBy: [
        {
          name: "asc",
        },
        {
          vCpus: "asc",
        },
      ],
    });

    const serialisableInstanceTypes = instanceTypes.map((i) =>
      serialiseDates(i, ["dateCreated", "dateUpdated"])
    );

    return {
      props: { instanceTypes: serialisableInstanceTypes },
    };
  };

const StyledContainer = styled(Container)({
  paddingBottom: "24px",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
});

export default function InstanceTypes({
  instanceTypes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <StyledContainer>
      <h1>Instance Types</h1>
      <Box flexGrow={1}>
        <InstanceList instances={instanceTypes} />
      </Box>
    </StyledContainer>
  );
}
