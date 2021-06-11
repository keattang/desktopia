import {
  EC2Client,
  DescribeInstanceTypesCommand,
  paginateDescribeInstanceTypes,
} from "@aws-sdk/client-ec2";
import {
  GetProductsCommand,
  paginateGetProducts,
  PricingClient,
} from "@aws-sdk/client-pricing";

import {
  SUPPORTED_REGIONS,
  PRICING_API_REGION,
  REGIONS,
  SUPPORTED_OPERATING_SYSTEMS,
} from "../lib/constants";
import prisma from "../lib/prisma";

interface IInstanceType {
  name: string;
  vCpus: number;
  cores?: number;
  memory: number;
  networkPerformance: string;
  pricePerHour: number;
  region: string;
  operatingSystem: string;
}

type IPartialInstanceType = Omit<
  IInstanceType,
  "pricePerHour" | "operatingSystem"
>;

const getInstancePrices = async (
  region: keyof typeof REGIONS,
  operatingSystem: string
) => {
  const pricingClient = new PricingClient({ region: PRICING_API_REGION });
  const paginator = paginateGetProducts(
    { client: pricingClient },
    {
      Filters: [
        { Type: "TERM_MATCH", Field: "location", Value: REGIONS[region] },
        {
          Type: "TERM_MATCH",
          Field: "productFamily",
          Value: "Compute Instance",
        },
        {
          Type: "TERM_MATCH",
          Field: "operatingSystem",
          Value: operatingSystem,
        },
        {
          Type: "TERM_MATCH",
          Field: "capacitystatus",
          Value: "Used",
        },
        {
          Type: "TERM_MATCH",
          Field: "licenseModel",
          Value: "No License required",
        },
        {
          Type: "TERM_MATCH",
          Field: "tenancy",
          Value: "Shared",
        },
      ],
      ServiceCode: "AmazonEC2",
      FormatVersion: "aws_v1",
    }
  );

  const instancePrices: { [key: string]: number } = {};

  for await (const page of paginator) {
    // page contains a single paginated output.
    page.PriceList?.forEach((result) => {
      let resultObj;

      if (typeof result === "string") {
        resultObj = JSON.parse(result);
      } else {
        resultObj = result.deserializeJSON();
      }

      const { terms, product } = resultObj;
      const { instanceType } = product.attributes;

      const onDemand = terms.OnDemand[Object.keys(terms.OnDemand)[0]];
      const priceDimension =
        onDemand.priceDimensions[Object.keys(onDemand.priceDimensions)[0]];
      const price = priceDimension.pricePerUnit.USD;

      // if (instanceType === "p3.16xlarge") {
      //   console.log(onDemand);
      // }

      instancePrices[instanceType] = parseFloat(price);
    });
  }

  return instancePrices;
};

const getInstanceTypes = async (region: keyof typeof REGIONS) => {
  const ec2Client = new EC2Client({ region });

  const paginator = paginateDescribeInstanceTypes({ client: ec2Client }, {});

  const instanceTypes: { [key: string]: IPartialInstanceType } = {};

  for await (const page of paginator) {
    // page contains a single paginated output.
    page.InstanceTypes?.forEach((result) => {
      const { InstanceType, VCpuInfo, MemoryInfo, GpuInfo, NetworkInfo } =
        result;

      if (InstanceType === undefined) {
        return;
      }

      instanceTypes[InstanceType] = {
        name: InstanceType,
        vCpus: VCpuInfo!.DefaultVCpus!,
        cores: VCpuInfo!.DefaultCores,
        memory: MemoryInfo!.SizeInMiB!,
        networkPerformance: NetworkInfo!.NetworkPerformance!,
        region,
      };
    });
  }

  return instanceTypes;
};

const getInstanceTypesWithPrices = async (
  region: keyof typeof REGIONS,
  operatingSystems: string[]
) => {
  const instanceTypes = await getInstanceTypes(region);
  const instanceTypesWithPrices: { [key: string]: IInstanceType } = {};

  await Promise.all(
    operatingSystems.map(async (operatingSystem) => {
      const instancePrices = await getInstancePrices(region, operatingSystem);

      Object.entries(instancePrices).forEach(([instanceType, pricePerHour]) => {
        const instanceAttributes = instanceTypes[instanceType];
        if (instanceAttributes) {
          instanceTypesWithPrices[instanceType] = {
            ...instanceAttributes,
            operatingSystem,
            pricePerHour,
          };
        }
      });
    })
  );
  return instanceTypesWithPrices;
};

const syncTypesForRegion = async (
  region: keyof typeof REGIONS,
  operatingSystems: string[]
) => {
  const instanceTypes = await getInstanceTypesWithPrices(
    region,
    operatingSystems
  );

  // TODO: Only create objects that don't already exists
  await prisma.instanceType.createMany({
    data: Object.values(instanceTypes),
  });
  console.log("Inserted rows into database.");
};

const main = () => {
  SUPPORTED_REGIONS.forEach(async (region) => {
    await syncTypesForRegion(region, SUPPORTED_OPERATING_SYSTEMS);
  });
};

main();
