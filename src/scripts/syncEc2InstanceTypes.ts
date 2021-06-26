import getInstanceTypes from "../aws/getInstanceTypes";
import getProductPricing from "../aws/getProductPricing";

import {
  SUPPORTED_REGIONS,
  PRICING_API_REGION,
  REGIONS,
  SUPPORTED_OPERATING_SYSTEMS,
} from "../constants";
import prisma from "../prisma";
import { PreSaveInstanceType } from "../types";

type IPartialInstanceType = Omit<
  PreSaveInstanceType,
  "pricePerHour" | "operatingSystem"
>;

const getInstancePrices = async (
  region: keyof typeof REGIONS,
  operatingSystem: string
) => {
  const instancePriceList = await getProductPricing(PRICING_API_REGION, {
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
  });

  return instancePriceList.reduce((agg: { [key: string]: number }, result) => {
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

    agg[instanceType] = parseFloat(price);
    return agg;
  }, {});
};

const getInstanceTypesDict = async (region: keyof typeof REGIONS) => {
  const instanceTypesList = await getInstanceTypes(region, {});

  return instanceTypesList.reduce(
    (agg: { [key: string]: IPartialInstanceType }, result) => {
      const { InstanceType, VCpuInfo, MemoryInfo, GpuInfo, NetworkInfo } =
        result;

      if (
        InstanceType === undefined ||
        VCpuInfo === undefined ||
        VCpuInfo.DefaultVCpus === undefined
      ) {
        // We shouldn't ever get here but we need this to satisfy typescript
        return agg;
      }

      agg[InstanceType] = {
        name: InstanceType,
        vCpus: VCpuInfo.DefaultVCpus,
        cores: VCpuInfo.DefaultCores || null,
        memory: MemoryInfo!.SizeInMiB!,
        networkPerformance: NetworkInfo!.NetworkPerformance!,
        region,
      };
      return agg;
    },
    {}
  );
};

const getInstanceTypesWithPrices = async (
  region: keyof typeof REGIONS,
  operatingSystems: string[]
) => {
  const instanceTypes = await getInstanceTypesDict(region);
  const instanceTypesWithPrices: { [key: string]: PreSaveInstanceType } = {};

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
