import {
  findRecordByFilter,
  getMiniFiedRecords,
  table,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, location, voting, related_places, imgUrl } = req.body;
    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          res.json({
            message: "record already exits",
            records: records,
          });
        } else {
          if (name) {
            try {
              const createdRecords = await table.create([
                {
                  fields: {
                    id,
                    name,
                    location: location.address || location.country || "",
                    related_places: related_places.children
                      ? related_places.children[0].name
                      : "",
                    imgUrl,
                    voting,
                  },
                },
              ]);
              console.log("createCoffeeStore ~ createdRecords", createdRecords);
              res.status(200).json({
                message: "create a record",
                records: getMiniFiedRecords(createdRecords),
              });
            } catch (error) {
              console.log(error.message);
              res.status(400).json({
                message: error.message,
              });
            }
          } else {
            res.status(400).json({
              message: "Name is missing",
            });
          }
        }
      } else {
        res.status(400).json({
          message: "ID is missing ",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Error creating or finding a store" });
    }
  } else {
    return res.json({ message: "GET" });
  }
};
export default createCoffeeStore;
