import { paginateGetProducts, PricingClient } from "@aws-sdk/client-pricing";
import _getPaginatedObjects from "./_getPaginatedObjects";

const getProductPricing = _getPaginatedObjects(
  PricingClient,
  paginateGetProducts,
  "PriceList"
);

export default getProductPricing;
