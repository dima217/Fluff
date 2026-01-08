import { baseApi } from "../baseApi";
import type {
  ConfirmProductUploadRequest,
  CreateProductRequest,
  CreateProductWithMediaIdsRequest,
  PrepareProductUploadRequest,
  PrepareProductUploadResponse,
  ProductResponse,
  UpdateProductRequest,
} from "../types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<ProductResponse[], void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),

    // Get product by ID
    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Create product (direct URL method)
    createProduct: builder.mutation<ProductResponse, CreateProductRequest>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update product
    updateProduct: builder.mutation<
      ProductResponse,
      { id: number; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Get favorite products
    getFavoriteProducts: builder.query<ProductResponse[], void>({
      query: () => "/products/favorites",
      providesTags: ["Product", "Favorite"],
    }),

    // Prepare product image upload
    prepareProductUpload: builder.mutation<
      PrepareProductUploadResponse,
      PrepareProductUploadRequest
    >({
      query: (body) => ({
        url: "/products/prepare-upload",
        method: "POST",
        body,
      }),
    }),

    // Mark file as uploaded
    markProductUploaded: builder.mutation<{ success: boolean }, string>({
      query: (mediaId) => ({
        url: `/products/mark-uploaded/${mediaId}`,
        method: "POST",
      }),
    }),

    // Create product with media IDs
    createProductWithMediaIds: builder.mutation<
      ProductResponse,
      CreateProductWithMediaIdsRequest
    >({
      query: (body) => ({
        url: "/products/create-with-media-ids",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    // Confirm upload and finalize product
    confirmProductUpload: builder.mutation<
      ProductResponse,
      ConfirmProductUploadRequest
    >({
      query: ({ productId, mediaIds }) => ({
        url: `/products/confirm-upload/${productId}`,
        method: "POST",
        body: { productId, mediaIds },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetFavoriteProductsQuery,
  useLazyGetFavoriteProductsQuery,
  usePrepareProductUploadMutation,
  useMarkProductUploadedMutation,
  useCreateProductWithMediaIdsMutation,
  useConfirmProductUploadMutation,
} = productsApi;
