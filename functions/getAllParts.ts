import { getDBRef } from "./firebase";

export const onRequest: PagesFunction = async (context) => {
  let dbRef = getDBRef(context);
  let parts = [""];
  let error = false,
      errorMessage = "";

  await get(child(dbRef, `/`))
      .then((snapshot) => {
          if (snapshot.exists()) {
              parts.push(snapshot.val());
          }
      })
      .catch((error) => {
          error = true;
          errorMessage = error;
      });

  if (error) return errorMessage;
  else return parts;
};
