// const bcrypt = require("bcrypt");

// const User = require("../../models/user");
// const { createUser, loginUser } = require("../../controllers/user");
// const {
//   generateToken,
//   constructUserResponse,
// } = require("../../utils/helper-functions");
// const ErrorObject = require("../../utils/error");

// jest.mock("bcrypt");
// jest.mock("../../models/user");
// jest.mock("../../utils/helper-functions");
// jest.mock("../../utils/error");


// describe("createUser Controller", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       body: {
//         firstName: "John",
//         lastName: "Doe",
//         email: "johndoe@example.com",
//         phoneNumber: "1234567890",
//         password: "password123",
//         role: "user",
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

//   it("should create a new user successfully", async () => {
//     const fakeUser = {
//       _id: "123",
//       firstName: "John",
//       lastName: "Doe",
//       email: "johndoe@example.com",
//       phoneNumber: "1234567890",
//       password: "hashedPassword",
//       role: "user",
//     };

//     User.findOne.mockResolvedValue(null);
//     User.create.mockResolvedValue(fakeUser);
//     generateToken.mockReturnValue("fakeToken");
//     constructUserResponse.mockReturnValue({
//       firstName: "John",
//       lastName: "Doe",
//       email: "johndoe@example.com",
//       phoneNumber: "1234567890",
//       role: "user",
//       token: "fakeToken",
//     });

//     await createUser(req, res, next);

//     expect(User.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
//     expect(User.create).toHaveBeenCalledWith({
//       firstName: "John",
//       lastName: "Doe",
//       email: "johndoe@example.com",
//       phoneNumber: "1234567890",
//       password: "password123",
//       role: "user",
//     });
//     expect(generateToken).toHaveBeenCalledWith("123");
//     expect(constructUserResponse).toHaveBeenCalledWith(fakeUser, "fakeToken");
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({
//       user: {
//         firstName: "John",
//         lastName: "Doe",
//         email: "johndoe@example.com",
//         phoneNumber: "1234567890",
//         role: "user",
//         token: "fakeToken",
//       },
//     });
//   });

//   it("should return 400 if email already exists", async () => {
//     User.findOne.mockResolvedValue({
//       email: "johndoe@example.com",
//     });

//     await createUser(req, res, next);

//     expect(User.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
//     expect(next).toHaveBeenCalledWith(expect.any(ErrorObject));
//     const error = next.mock.calls[0][0];
//     expect(error.message).toBe("A user with this email already exists");
//     expect(error.statusCode).toBe(400);
//   });
// });

// describe("loginUser Controller", () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = {
//       body: {
//         email: "johndoe@example.com",
//         password: "password123",
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

//   it("should login a user successfully", async () => {
//     const fakeUser = {
//       _id: "123",
//       email: "johndoe@example.com",
//       password: "hashedPassword",
//     };

//     User.findOne.mockResolvedValue(fakeUser);
//     bcrypt.compare.mockResolvedValue(true);
//     generateToken.mockReturnValue("fakeToken");
//     constructUserResponse.mockReturnValue({
//       email: "johndoe@example.com",
//       token: "fakeToken",
//     });

//     // Adding logs
//     console.log("Running test: should login a user successfully");
//     console.log("User mock before loginUser call:", User.findOne.mock.calls);
//     console.log(
//       "Bcrypt mock before loginUser call:",
//       bcrypt.compare.mock.calls
//     );

//     await loginUser(req, res, next);

//     console.log("User mock after loginUser call:", User.findOne.mock.calls);
//     console.log("Bcrypt mock after loginUser call:", bcrypt.compare.mock.calls);

//     expect(User.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
//     expect(bcrypt.compare).toHaveBeenCalledWith(
//       "password123",
//       "hashedPassword"
//     );
//     expect(generateToken).toHaveBeenCalledWith("123");
//     expect(constructUserResponse).toHaveBeenCalledWith(fakeUser, "fakeToken");
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       user: {
//         email: "johndoe@example.com",
//         token: "fakeToken",
//       },
//     });
//   });

//   it("should return 400 if email is invalid", async () => {
//     User.findOne.mockResolvedValue(null);

//     await loginUser(req, res, next);

//     expect(User.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
//     expect(next).toHaveBeenCalledWith(expect.any(ErrorObject));
//     const error = next.mock.calls[0][0];
//     expect(error.message).toBe("Invalid Credentials");
//     expect(error.statusCode).toBe(400);
//   });

//   it("should return 400 if password is invalid", async () => {
//     const fakeUser = {
//       _id: "123",
//       email: "johndoe@example.com",
//       password: "hashedPassword",
//     };

//     User.findOne.mockResolvedValue(fakeUser);
//     bcrypt.compare.mockResolvedValue(false);

//     await loginUser(req, res, next);

//     expect(User.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
//     expect(bcrypt.compare).toHaveBeenCalledWith(
//       "password123",
//       "hashedPassword"
//     );
//     expect(next).toHaveBeenCalledWith(expect.any(ErrorObject));
//     const error = next.mock.calls[0][0];
//     expect(error.message).toBe("Invalid Credentials");
//     expect(error.statusCode).toBe(400);
//   });
// });
