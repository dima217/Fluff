import { baseApi } from "../baseApi";
import type {
  ConfirmProductUploadRequest,
  CreateProductRequest,
  CreateProductWithMediaIdsRequest,
  PaginationQuery,
  PrepareProductUploadRequest,
  PrepareProductUploadResponse,
  ProductResponse,
  SearchProductsQuery,
  UpdateProductRequest,
} from "../types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<
      { data: ProductResponse[]; meta: any } | ProductResponse[],
      PaginationQuery | undefined
    >({
      query: (params) => ({
        url: "/products",
        params: params,
      }),
      providesTags: ["Product"],
    }),

    // Get product by ID
    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Get products by list of IDs
    getProductsByIds: builder.query<ProductResponse[], number[]>({
      query: (ids) => {
        const idsString = ids.join(",");
        return {
          url: "/products/by-ids",
          params: { ids: idsString },
        };
      },
      providesTags: (result) =>
        result
          ? result.map((product) => ({ type: "Product", id: product.id }))
          : ["Product"],
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
      invalidatesTags: ["Product"],
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

    // Search products
    searchProducts: builder.query<ProductResponse[], SearchProductsQuery>({
      query: (params) => ({
        url: "/products/search",
        params: { q: params.q },
      }),
      providesTags: ["Product"],
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
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useGetProductsByIdsQuery,
  useLazyGetProductsByIdsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetFavoriteProductsQuery,
  useLazyGetFavoriteProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  usePrepareProductUploadMutation,
  useMarkProductUploadedMutation,
  useCreateProductWithMediaIdsMutation,
  useConfirmProductUploadMutation,
} = productsApi;
