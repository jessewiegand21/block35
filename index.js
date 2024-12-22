const express = require("express");
const app = express();

const {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require("./db");

app.get("api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(ex);
  }
});
app.get("api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (error) {
    next(ex);
  }
});
app.get("api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites());
  } catch (error) {
    next(ex);
  }
});
app.post("api/users/:id/favorites", async (req, res, next) => {
  try {
    res.status(201).send(
      await createFavorite({
        user_id: req.params.user_id,
        product_id: req.body.product_id,
      })
    );
  } catch (error) {
    next(ex);
  }
});
app.delete("api/users/:users_id/favorites/:id", async (req, res, next) => {
  try {
    await destroyFavorite({
      user_id: req.params.user_id,
      id: req.params.id,
    });
    res.sendStatus(204);
  } catch (error) {
    next(ex);
  }
});

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("created tables");
  const [
    Jesse,
    Cheyenne,
    Alicia,
    Jay,
    Alya,
    Slide,
    Rattles,
    Legos,
    Makeup,
    Tools,
  ] = await Promise.all([
    createUser({ name: "Jesse" }),
    createUser({ name: "Cheyenne" }),
    createUser({ name: "Alicia" }),
    createUser({ name: "Jay" }),
    createUser({ name: "Alya" }),
    createProduct({ name: "Legos" }),
    createProduct({ name: "Rattles" }),
    createProduct({ name: "Slide" }),
    createProduct({ name: "Tools" }),
    createProduct({ name: "Makeup" }),
  ]);

  const reservation = await Promise.all([
    createFavorite({
      user_id: Jesse.id,
      favorite_id: Tools.id,
    }),
  ]);

  await destroyFavorite({
    id: favorite.id,
    user_id: favorite.user_id,
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
  await destroyFavorite({
    id: favorite.id,
    user_id: favorite.user_id,
  });
};
init();
