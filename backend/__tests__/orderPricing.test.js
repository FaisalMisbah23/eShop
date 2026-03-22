process.env.NODE_ENV = "test";

jest.mock("../model/product", () => ({
  findById: jest.fn(),
}));

jest.mock("../model/couponCode", () => ({
  findOne: jest.fn(),
}));

const Product = require("../model/product");
const CouponCode = require("../model/couponCode");
const {
  buildOrderFromCartLines,
  stripeAmountFromTotal,
} = require("../utils/orderPricing");

describe("orderPricing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    CouponCode.findOne.mockResolvedValue(null);
  });

  it("rejects empty cart", async () => {
    await expect(buildOrderFromCartLines([])).rejects.toMatchObject({
      message: "Cart is empty",
    });
  });

  it("builds cart from DB prices", async () => {
    Product.findById.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      name: "Test",
      category: "x",
      discountPrice: 100,
      stock: 5,
      shopId: "shop1",
      shop: { name: "S" },
      images: [],
    });

    const result = await buildOrderFromCartLines([
      { _id: "507f1f77bcf86cd799439011", qty: 2, shopId: "shop1" },
    ]);

    expect(result.subTotalPrice).toBe(200);
    expect(result.shipping).toBe(2);
    expect(result.totalPrice).toBe(202);
    expect(result.cart).toHaveLength(1);
    expect(result.cart[0].qty).toBe(2);
  });

  it("stripeAmountFromTotal uses minor units", () => {
    expect(stripeAmountFromTotal(10.5)).toBe(1050);
  });
});
