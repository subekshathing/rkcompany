import Yup from "yup";

export const addProductValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .trim()
    .max(60, "Name must be at max 60 characters."),
  brand: Yup.string()
    .required("Brand is required.")
    .trim()
    .max(60, "Brand must be at max 60 characters."),
  price: Yup.number()
    .min(0, "Price cannot be negative number.")
    .required("Price is required."),
  category: Yup.string()
    .trim()
    .required("Category is required.")
    .oneOf([
      "grocery",
      "electronics",
      "furniture",
      "electrical",
      "kitchen",
      "kids",
      "sports",
      "auto",
      "clothes",
      "shoes",
      "pharmaceuticals",
      "stationery",
      "cosmetics"
    ]),
  freeShipping: Yup.boolean(),
  availableQuantity: Yup.number()
    .min(1, "Available quantity must be at least 1.")
    .integer("Available quantity cannot be float number."),
  description: Yup.string()
    .required("Description is required.")
    .min(200, "Description must be at least 200 characters.")
    .max(1000, "Description must be at max 1000 characters."),

  image: Yup.string().nullable()
});

export const paginationValidationSchema = Yup.object({
  page: Yup.number()
    .min(1, "Page must be at least 1.")
    .required("Page is required."),
  limit: Yup.number()
    .min(1, "Limit must be at least 1.")
    .required("Limit is required.")
    .max(100, "Limit must be at max 100."),

  searchText: Yup.string().nullable()
});

export const listProductByBuyerValidationSchema = Yup.object({
  page: Yup.number()
    .min(1, "Page must be at least 1.")
    .required("Page is required."),
  limit: Yup.number()
    .min(1, "Limit must be at least 1.")
    .required("Limit is required.")
    .max(100, "Limit must be at max 100."),

  searchText: Yup.string().nullable(),
  category: Yup.string()
    .oneOf([
      "grocery",
      "electronics",
      "furniture",
      "electrical",
      "kitchen",
      "kids",
      "sports",
      "auto",
      "clothes",
      "shoes",
      "pharmaceuticals",
      "stationery",
      "cosmetics"
    ])
    .nullable(),
  minPrice: Yup.number().min(0).nullable(),
  maxPrice: Yup.number().min(0).nullable()
});
