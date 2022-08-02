const optionHeader = (
  method = "GET",
  Accept = "application/json",
  Auth = process.env.NEXT_PUBLIC_FOURQUARE_API_KEY
) => {
  const options = {
    method: method,
    headers: {
      Accept: Accept,
      Authorization: Auth,
    },
  };
  return options;
};

const getUrlForCoffeeStores = (
  lastLong = "40.74856065084089,-73.98471940942368",
  limit = 8
) => {
  return `https://api.foursquare.com/v3/places/search?query=coffee&ll=${lastLong}&limit=${limit}`;
};
const getUrlImage = (width, height, prefix, suffix) => {
  return prefix + `${width}x${height}` + suffix;
};

const getPlacePhoto = async (id) => {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/${id}/photos`,
      optionHeader()
    );
    const result = await response.json();
    const { width, height, prefix, suffix } = result[0];
    const urlImage = getUrlImage(width, height, prefix, suffix);
    return urlImage;
  } catch (error) {
    console.log(error.message);
  }
};

export const fetchCoffeeStores = async (
  lastLong = "40.74856065084089,-73.98471940942368",
  limit = 8
) => {
  const response = await fetch(
    getUrlForCoffeeStores(lastLong, limit),
    optionHeader()
  );
  const data = await response.json();
  return await Promise.all(
    data.results.map(async (result) => {
      return {
        ...result,
        imgUrl: await getPlacePhoto(result.fsq_id),
      };
    })
  );
};
