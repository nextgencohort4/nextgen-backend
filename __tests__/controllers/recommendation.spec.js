const { recommendProducts } = require("../../controllers/recommendation");
const Product = require("../../models/product");
const mongoose = require("mongoose");

jest.mock("../../models/product");



describe("recommendProducts Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { productId: new mongoose.Types.ObjectId().toString() },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should recommend products based on same size or price", async () => {
    const product = {
      _id: req.params.productId,
      sizes: [10, 12],
      price: 100,
    };

    const recommendedProducts = [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "Product 1",
        sizes: [10],
        price: 120,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: "Product 2",
        sizes: [14],
        price: 100,
      },
    ];

    Product.findById.mockResolvedValue(product);
    Product.find.mockResolvedValue(recommendedProducts);

    await recommendProducts(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith(req.params.productId);
    expect(Product.find).toHaveBeenCalledWith({
      $or: [{ sizes: { $in: product.sizes } }, { price: product.price }],
      _id: { $ne: req.params.productId },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(recommendedProducts);
  });

  it("should return 404 if product is not found", async () => {
    Product.findById.mockResolvedValue(null);

    await recommendProducts(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith(req.params.productId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
  });

  it("should handle server errors", async () => {
    const errorMessage = "Internal Server Error";
    Product.findById.mockRejectedValue(new Error(errorMessage));

    await recommendProducts(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith(req.params.productId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});
