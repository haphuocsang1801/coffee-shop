import {
  findRecordByFilter,
  getMiniFiedRecords,
  table,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    const { id } = req.body;
    try {
      const records = await findRecordByFilter(id);
      if (records.length !== 0) {
        const record = records[0];
        const calculateVoting = Number(record.voting) + 1;
        //update voting
        const updateRecord = await table.update([
          {
            id: `${record.recordId}`,
            fields: {
              voting: calculateVoting,
            },
          },
        ]);
        if (updateRecord) {
          const miniFieldRecord = getMiniFiedRecords(updateRecord);
          res.json({
            records: miniFieldRecord,
          });
        }
      } else res.json({ message: "Coffee Store doesn't exits", id });
    } catch (error) {
      res.json({ message: "Error upvoting coffee store" });
    }

    res.json({ message: "It work", id });
  }
};
export default favouriteCoffeeStoreById;
