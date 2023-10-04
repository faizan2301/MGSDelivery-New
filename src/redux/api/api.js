import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// const baseUrl = "http://192.168.1.20:4000";
const baseUrl = "https://mahaveer.vercel.app/";
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),

  endpoints: (build) => ({
    loginApi: build.mutation({
      query: (args) => {
        console.log("login", args);
        return {
          url: "login",
          method: "POST",
          body: args,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    me: build.mutation({
      query: (token) => {
        console.log("me");
        return {
          url: "me",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //  <================================> orders Apis for admin <================================>
    getOrders: build.mutation({
      query: (args) => {
        console.log("admin-orders", args.body);
        return {
          url: "admin-orders",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    getMyOrder: build.mutation({
      query: (args) => {
        console.log("my-orders", args.body);
        return {
          url: "my-orders",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    scanOrder: build.mutation({
      query: (args, token) => {
        console.log("order", args.body);
        return {
          url: "order",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    getAllDeliveryBoys: build.mutation({
      query: (token) => {
        console.log("delivery-boys", token);
        return {
          url: "delivery-boys",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    assignOrderApi: build.mutation({
      query: (args) => {
        console.log("assign", args.body);
        return {
          url: "assign",
          method: "PUT",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    editOrderInfo: build.mutation({
      query: (args) => {
        console.log("edit", args.body);
        return {
          url: "edit",
          method: "PUT",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    payDeliveryCost: build.mutation({
      query: (args) => {
        console.log("edit", args.body);
        return {
          url: "pay-deliveryCost",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    collectMonyFromDelivery: build.mutation({
      query: (args) => {
        console.log("collection", args.body);
        return {
          url: "collection",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    //  <================================> orders Apis <================================>
    // getOrders: build.query({
    // query: () => "admin-orders",
    // }),
    //  <================================> orders Apis <================================>

    //  <================================> delivery boys Apis <================================>
    pikedup: build.mutation({
      query: (args) => {
        console.log("picked-up", args.body);
        return {
          url: "picked-up",
          method: "PUT",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    //TODO
    cancelMyOrder: build.mutation({
      query: (args) => {
        return {
          url: "/cancel-my-order",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    deliverOrder: build.mutation({
      query: (args) => {
        console.log("deliverd", args.body);
        return {
          url: "deliverd",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    refusedToAccept: build.mutation({
      query: (args) => {
        console.log("refused-to-accept", args.body);
        return {
          url: "refused-to-accept",
          method: "PUT",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    creditOrder: build.mutation({
      query: (args) => {
        console.log("credit", args.body);
        return {
          url: "credit",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    // <====================================  Transacton =======================>
    transaction: build.mutation({
      query: (token) => {
        console.log("transactions");
        return {
          url: "transactions",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    googledistance: build.mutation({
      query: (args) => {
        console.log("computeRoutes", args);
        return {
          url: `https://routes.googleapis.com/directions/v2:computeRoutes`,
          method: "POST",
          body: {
            origin: {
              location: {
                latLng: {
                  latitude: args.pickupCords.latitude,
                  longitude: args.pickupCords.longitude,
                },
              },
            },
            destination: {
              location: {
                latLng: {
                  latitude: args.dropCords.latitude,
                  longitude: args.dropCords.longitude,
                },
              },
            },
            travelMode: "DRIVE",
            units: "METRIC",
          },
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "X-Goog-Api-Key": "AIzaSyDs4xGW-ewXwerL2yz464noy0_p1b7oxFU",
            "X-Goog-FieldMask": "routes.distanceMeters",
          },
        };
      },
    }),
  }),
});
export const {
  useLoginApiMutation,
  useMeMutation,
  useScanOrderMutation,
  useGetOrdersMutation,
  useEditOrderInfoMutation,
  useCollectMonyFromDeliveryMutation,
  usePayDeliveryCostMutation,
  useGetMyOrderMutation,
  useCancelMyOrderMutation,
  usePikedupMutation,
  useCreditOrderMutation,
  useGetAllDeliveryBoysMutation,
  useAssignOrderApiMutation,
  useDeliverOrderMutation,
  useRefusedToAcceptMutation,
  useTransactionMutation,
  useGoogledistanceMutation,
} = api;
