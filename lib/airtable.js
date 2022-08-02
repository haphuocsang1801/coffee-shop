import Airtable from "airtable";
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);
const table = base("coffee-stores");

const getMiniFiedRecords = (value) => {
  return value.map((record) => {
    return {
      recordId: record.id,
      ...record.fields,
    };
  });
};
const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
  return getMiniFiedRecords(findCoffeeStoreRecords);
};

export { table, getMiniFiedRecords, findRecordByFilter };
