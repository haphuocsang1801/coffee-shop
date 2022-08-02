import {
  findRecordByFilter,
  getMiniFiedRecords,
  table,
} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      const records = await findRecordByFilter(id);
      if (records.length !== 0) {
        res.json({
          message: true,
          records,
        });
      } else {
        res.status(400).json({
          message: `id count not be found`,
        });
      }
    } else {
      res.status(400).json({
        message: "Name is missing",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Somgthing went wrong ", error });
  }
};
export default getCoffeeStoreById;
