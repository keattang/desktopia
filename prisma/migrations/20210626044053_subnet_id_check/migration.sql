-- Custom migration to add a cardinality check to Location.subnetIds. This check ensures that there
-- is at least one item in the array.
ALTER TABLE "Location"
  ADD CONSTRAINT "at_least_one_subnet_id" CHECK (cardinality("subnetIds") > 0);