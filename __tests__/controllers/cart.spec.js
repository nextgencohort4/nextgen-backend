const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} = require("../../controllers/cart");
const Product = require("../../models/product");
const Cart = require("../../models/cart");
const asyncHandler = require("express-async-handler");
const ErrorObject = require("../../utils/error");
const mongoose = require("mongoose");

jest.mock("../../models/product");
jest.mock("../../models/cart");
jest.mock("express-async-handler", () => (fn) => fn);
jest.mock("../../utils/error");


// describe("addToCart Controller", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       user: { userId: "user123" },
//       body: {
//         productId: "product123",
//         quantity: 1,
//         color: "red",
//         size: 41,
//       },
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

//   it("should add a new product to the cart", async () => {
//     const product = { _id: "product123" };
//     Product.findById.mockResolvedValue(product);
//     Cart.findOne.mockResolvedValue(null);

//     const mockCartSave = jest.fn().mockResolvedValue(true);
//     Cart.create.mockResolvedValue({ save: mockCartSave });

//     await addToCart(req, res, next);

//     expect(Product.findById).toHaveBeenCalledWith("product123");
//     expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(Cart.create).toHaveBeenCalledWith({
//       userId: "user123",
//       items: [{ productId: "product123", quantity: 1, color: "red", size: 41 }],
//     });
//     expect(mockCartSave).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ cart: expect.any(Object) });
//   });

//   it("should update the quantity of an existing product in the cart", async () => {
//     const product = { _id: "product123" };
//     Product.findById.mockResolvedValue(product);

//     const existingCart = {
//       userId: "user123",
//       items: [{ productId: "product123", quantity: 1, color: "red", size: 41 }],
//       save: jest.fn().mockResolvedValue(true),
//     };
//     Cart.findOne.mockResolvedValue(existingCart);

//     await addToCart(req, res, next);

//     expect(Product.findById).toHaveBeenCalledWith("product123");
//     expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(existingCart.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ cart: existingCart });
//   });

//   it("should handle product not found", async () => {
//     Product.findById.mockResolvedValue(null);

//     await addToCart(req, res, next);

//     expect(Product.findById).toHaveBeenCalledWith("product123");
//     expect(next).toHaveBeenCalledWith(
//       new ErrorObject("Product not found", 404)
//     );
//   });
// });

describe('getCart Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { userId: new mongoose.Types.ObjectId().toString() }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the cart with populated product details', async () => {
    const populatedCart = {
      items: [
        {
          productId: { _id: new mongoose.Types.ObjectId().toString(), name: 'Product 1', price: 100 },
          quantity: 2,
          color: 'red',
          size: 10
        },
        {
          productId: { _id: new mongoose.Types.ObjectId().toString(), name: 'Product 2', price: 150 },
          quantity: 1,
          color: 'blue',
          size: 12
        }
      ]
    };

    const mockFindOne = {
      populate: jest.fn().mockResolvedValue(populatedCart)
    };

    Cart.findOne.mockReturnValue(mockFindOne);

    await getCart(req, res, next);

    expect(Cart.findOne).toHaveBeenCalledWith({ userId: req.user.userId });
    expect(mockFindOne.populate).toHaveBeenCalledWith('items.productId', 'name price');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ cart: populatedCart });
  });

  it('should return an empty array if the cart is not found', async () => {
    const mockFindOne = {
      populate: jest.fn().mockResolvedValue(null)
    };

    Cart.findOne.mockReturnValue(mockFindOne);

    await getCart(req, res, next);

    expect(Cart.findOne).toHaveBeenCalledWith({ userId: req.user.userId });
    expect(mockFindOne.populate).toHaveBeenCalledWith('items.productId', 'name price');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ cart: [] });
  });

  it('should handle server errors', async () => {
    const errorMessage = 'Internal Server Error';
    const mockFindOne = {
      populate: jest.fn().mockRejectedValue(new ErrorObject(errorMessage))
    };

    Cart.findOne.mockReturnValue(mockFindOne);

    await getCart(req, res, next);

    expect(Cart.findOne).toHaveBeenCalledWith({ userId: req.user.userId });
    expect(mockFindOne.populate).toHaveBeenCalledWith('items.productId', 'name price');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

// describe("updateCart Controller", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       user: { userId: "user123" },
//       params: { productId: "product1" },
//       body: { quantity: 3, color: "red", size: "M" },
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

//   it("should update the cart item and return the updated cart", async () => {
//     const cart = {
//       userId: "user123",
//       items: [
//         {
//           productId: { equals: jest.fn().mockReturnValue(true) },
//           quantity: 2,
//           color: "blue",
//           size: "L",
//         },
//       ],
//       save: jest.fn().mockResolvedValue(true),
//     };
//     Cart.findOne.mockResolvedValue(cart);

//     await updateCart(req, res, next);

//     expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(cart.items[0].quantity).toBe(3);
//     expect(cart.items[0].color).toBe("red");
//     expect(cart.items[0].size).toBe("M");
//     expect(cart.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ cart });
//   });

//   it("should handle cart not found", async () => {
//     Cart.findOne.mockResolvedValue(null);

//     await updateCart(req, res, next);

//     expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(next).toHaveBeenCalledWith(new ErrorObject("Cart not found", 404));
//   });

//   it("should handle product not found in cart", async () => {
//     const cart = {
//       userId: "user123",
//       items: [
//         {
//           productId: { equals: jest.fn().mockReturnValue(false) },
//           quantity: 2,
//           color: "blue",
//           size: "L",
//         },
//       ],
//     };
//     Cart.findOne.mockResolvedValue(cart);

//     await updateCart(req, res, next);

//     expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(next).toHaveBeenCalledWith(
//       new ErrorObject("Product not found in cart", 404)
//     );
//   });
// });

// describe("removeFromCart Controller", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       user: { userId: "user123" },
//       params: { productId: "product1" },
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

//   it("should remove the product from the cart and return the updated cart", async () => {
//     const cart = {
//       userId: "user123",
//       items: [
//         {
//           productId: { equals: jest.fn().mockReturnValue(true) },
//           quantity: 2,
//           color: "blue",
//           size: "L",
//         },
//       ],
//       save: jest.fn().mockResolvedValue(true),
//     };
//     Cart.findOne.mockResolvedValue(cart);

//     await removeFromCart(req, res, next);

//     expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(cart.items.splice).toHaveBeenCalledWith(0, 1);
//     expect(cart.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ cart });
//   });

//   it("should handle cart not found", async () => {
//     Cart.findOne.mockResolvedValue(null);

//     await removeFromCart(req, res, next);

//     expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(next).toHaveBeenCalledWith(new ErrorObject("Cart not found", 404));
//   });

//   it("should handle product not found in cart", async () => {
//     const cart = {
//       userId: "user123",
//       items: [
//         {
//           productId: { equals: jest.fn().mockReturnValue(false) },
//           quantity: 2,
//           color: "blue",
//           size: "L",
//         },
//       ],
//     };
//     Cart.findOne.mockResolvedValue(cart);

//     await removeFromCart(req, res, next);

//     expect(Cart.findOne).toHaveBeenCalledWith({ userId: "user123" });
//     expect(next).toHaveBeenCalledWith(
//       new ErrorObject("Product not found in cart", 404)
//     );
//   });
// });
