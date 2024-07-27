// const {
//   addFavourite,
//   getFavourites,
//   removeFavourite,
// } = require("../../controllers/favourite");
// const Favourite = require("....//models/favourite");
// const asyncHandler = require("express-async-handler");
// const ErrorObject = require("../../utils/error");

// jest.mock("../../models/favourite");
// jest.mock("express-async-handler", () => (fn) => fn);


// describe("addFavourite Controller", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       user: { userId: "user123" },
//       body: { productId: "product1" },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     };

//     next = jest.fn();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should add product to existing favourites and return updated favourite", async () => {
//     const favourite = {
//       userId: "user123",
//       productIds: [],
//       save: jest.fn().mockResolvedValue(true),
//     };
//     Favourite.findOne.mockResolvedValue(favourite);

//     await addFavourite(req, res, next);

//     expect(Favourite.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(favourite.productIds).toContain("product1");
//     expect(favourite.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ favourite });
//   });

//   it("should handle product already in favourites", async () => {
//     const favourite = {
//       userId: "user123",
//       productIds: ["product1"],
//       save: jest.fn(),
//     };
//     Favourite.findOne.mockResolvedValue(favourite);

//     await addFavourite(req, res, next);

//     expect(Favourite.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(next).toHaveBeenCalledWith(
//       new ErrorObject("Product already in favourites", 400)
//     );
//     expect(favourite.save).not.toHaveBeenCalled();
//   });

//   it("should create a new favourite and add product", async () => {
//     Favourite.findOne.mockResolvedValue(null);
//     const newFavourite = {
//       userId: "user123",
//       productIds: ["product1"],
//       save: jest.fn().mockResolvedValue(true),
//     };
//     Favourite.create.mockResolvedValue(newFavourite);

//     await addFavourite(req, res, next);

//     expect(Favourite.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(Favourite.create).toHaveBeenCalledWith({
//       userId: "user123",
//       productIds: ["product1"],
//     });
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ favourite: newFavourite });
//   });
// });

// describe("getFavourites Controller", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       user: { userId: "user123" },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     };

//     next = jest.fn();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should return the favourite list of the user", async () => {
//     const favourite = {
//       userId: "user123",
//       productIds: ["product1", "product2"],
//     };
//     Favourite.findOne.mockResolvedValue(favourite);

//     await getFavourites(req, res, next);

//     expect(Favourite.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(Favourite.findOne().populate).toHaveBeenCalledWith("productIds");
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ favourite });
//   });

//   it("should return an empty list if no favourites are found", async () => {
//     Favourite.findOne.mockResolvedValue(null);

//     await getFavourites(req, res, next);

//     expect(Favourite.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(Favourite.findOne().populate).toHaveBeenCalledWith("productIds");
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ favourite: [] });
//   });
// });

// describe("removeFavourite Controller", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       user: { userId: "user123" },
//       params: { productId: "product123" },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     };

//     next = jest.fn();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should remove a product from favourites", async () => {
//     const favourite = {
//       userId: "user123",
//       productIds: ["product123", "product456"],
//       save: jest.fn(),
//     };
//     Favourite.findOne.mockResolvedValue(favourite);

//     await removeFavourite(req, res, next);

//     expect(Favourite.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(favourite.save).toHaveBeenCalled();
//     expect(favourite.productIds).not.toContain("product123");
//     expect(res.status).toHaveBeenCalledWith(204);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "Product removed from favourites",
//     });
//   });

//   it("should return an error if no favourites found for the user", async () => {
//     Favourite.findOne.mockResolvedValue(null);

//     await removeFavourite(req, res, next);

//     expect(Favourite.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(next).toHaveBeenCalledWith(
//       new ErrorObject("No favourites found for this user", 404)
//     );
//   });

//   it("should return an error if the product is not found in favourites", async () => {
//     const favourite = {
//       userId: "user123",
//       productIds: ["product456"],
//       save: jest.fn(),
//     };
//     Favourite.findOne.mockResolvedValue(favourite);

//     await removeFavourite(req, res, next);

//     expect(Favourite.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(next).toHaveBeenCalledWith(
//       new ErrorObject("Product not found in favourites", 404)
//     );
//   });
// });
