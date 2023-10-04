// export const statusArray = [
//     {
//         status : "all",
//         name: "All"
//     },
//     {
//         status : "pending",
//         name: "Pending"
//     },
//     {
//         status : "ready",
//         name: "Ready"
//     },
//     {
//         status : "dispatched",
//         name: "Dispatched"
//     },
//     {
//         status : "delivered",
//         name: "Deliverd"
//     },
//     {
//         status : "cancelled",
//         name: "Cancelled"
//     },
//     {
//         status : "reschedule",
//         name: "Reschedule"
//     },
// ]
export const statusArray = [
    {
        id: 1,
        status: "all",
        name: "All",
        admin: false
    },
    {
        id: 2,
        status: "pending",
        name: "Pending",
        admin: true
    },
    {
        id: 3,
        status: "ready",
        name: "Ready",
        admin: false
    },
    {
        id: 4,
        status: "dispatched",
        name: "Dispatched",
        name2 : "Picked up",
        admin: false
    },
    {
        id: 5,
        status: "delivered",
        name: "Delivered",
        admin: false
    },
    {
        id: 6,
        status: "cancelled",
        name: "Cancelled",
        admin: true
    },
    // {
    //     id: 7,
    //     status: "reschedule",
    //     name: "Reschedule",
    //     admin: true
    // },
    {
        id: 8,
        status: "credit",
        name: "Credit",
        admin: false
    },
];

