import { fetchCoffeeStores } from "../../lib/coffee-store";

const getCoffeStoreByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default getCoffeStoreByLocation;
