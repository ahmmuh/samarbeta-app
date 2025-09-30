// import dotenv from "dotenv";
// dotenv.config();
// import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
// const mapboxToken = process.env.MAPBOX_TOKEN;
// // console.log("MAPBOX_TOKEN:", process.env.MAPBOX_TOKEN);
// // console.log("PORT:", process.env.PORT);
// // console.log("DB_CONNECTION_STRING:", process.env.DB_CONNECTION_STRING);

// const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

// export const geocodeAddress = async (address) => {
//   try {
//     const response = await geocodingClient
//       .forwardGeocode({
//         query: address,
//         limit: 1, // bara en träff
//       })
//       .send();

//     const match = response.body.features[0];
//     if (!match) {
//       throw new Error("Adress kunde inte geokodas");
//     }

//     const [lng, lat] = match.center;
//     return [lng, lat];
//   } catch (error) {
//     throw new Error(`Geokodning misslyckades: ${error.message}`);
//   }
// };
