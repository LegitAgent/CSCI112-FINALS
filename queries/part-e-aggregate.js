// Task: Build 5 aggregation pipelines that transform raw data into strategic business intelligence.
// Requirements:
//      Each pipeline must include minimum 3 stages
//      Use $match to filter data before processing
//      Use $group to aggregate data by categories
//      Use $sort to order results meaningfully
//      Use $project to shape output fields
//      Use $limit or other stages as appropriate
//      Pipelines must answer strategic business questions
// Example Aggregation Types (adapt to your domain):
//      Count occurrences by category
//      Calculate totals, averages, or other statistics
//      Identify top/bottom performers
//      Compare metrics across groups
//      Find trends or patterns
//      Rank or segment data
// Deliverable:
//      Screenshots of aggregation pipeline code and results
//      Explanation of business insight each aggregation provides
//      Description of how company would use this insight

// Setup: run before the numbered demonstrations.
load("queries/consts.js");

// 1. dorm buildings that have the greatest total room capacity
console.log("1. dorm buildings that have the greatest total room capacity")
printjson(
  rooms.aggregate([
    // get all rooms greater than 0
    { $match: { room_capacity: { $gt: 0} } },

    // group them by their building and add total cap of each room to dorm total cap
    { $group: {
        _id: "$dorm_name",
        total: { $sum: "$room_capacity" }
      }
    },

    // sort by descending
    { $sort: { total: -1 } },

    // rename _id row name to building and collate total
    { $project: {
        _id: 0, // hide group key
        building: "$_id", // dorm building name
        total_capacity: "$total" // total resident capacity across its rooms
      }
    }
  ]).toArray()
)

// 2. which courses have the most scholar residents
console.log("\n2. which courses have the most scholar residents")
printjson(
  residents.aggregate([
    // get all residents that are scholars
    { $match: { scholar: true } },

    // group all similar courses and inc count of scholar of each
    { $group: {
        _id: "$course",
        total: { $sum: 1 }
      }
    },

    // sort by descending
    { $sort: { total: -1 } },

    // limit to top 5 courses
    { $limit: 5 },

    // rename group key to course and show scholar count
    { $project: {
        _id: 0, // hide group key
        course: "$_id", // resident degree program
        scholar_count: "$total" // number of scholarship residents
      }
    }
  ]).toArray()
)

// 3. which buildings have the highest total unpaid invoice charges
console.log("\n3. which buildings have the highest total unpaid invoice charges")
printjson(
  invoices.aggregate([
    // get all unpaid invoices with a positive cost
    { $match: {
        payment_status: false,
        cost: { $gt: 0 }
      }
    },

    // get the lease connected to each invoice
    { $lookup: {
        from: "leases",
        localField: "lease_id",
        foreignField: "lease_id",
        as: "lease"
      }
    },
    { $unwind: "$lease" }, // flatten joined array

    // get the room connected to each lease
    { $lookup: {
        from: "rooms",
        localField: "lease.room_number",
        foreignField: "room_number",
        as: "room"
      }
    },
    { $unwind: "$room" }, // flatten joined array

    // group by building and add unpaid invoice costs
    { $group: {
        _id: "$room.dorm_name",
        total: { $sum: "$cost" },
        invoice_count: { $sum: 1 }
      }
    },

    // sort highest unpaid charges first, then building name for ties
    { $sort: { total: -1, _id: 1 } },

    // rename fields for output
    { $project: {
        _id: 0, // hide group key
        building: "$_id", // dorm building name
        unpaid_invoice_charges: "$total", // full charges on invoices marked unpaid
        invoice_count: 1 // number of unpaid invoices included
      }
    }
  ]).toArray()
)

// 4. which room types provide the most housing capacity
console.log("\n4. which room types provide the most housing capacity")
printjson(
  rooms.aggregate([
    // get all rooms with a positive capacity
    { $match: { room_capacity: { $gt: 0 } } },

    // group similar room types and calculate capacity stats
    { $group: {
        _id: "$type",
        room_count: { $sum: 1 },
        total: { $sum: "$room_capacity" },
        buildings: { $addToSet: "$dorm_name" }
      }
    },

    // sort by total capacity descending
    { $sort: { total: -1, _id: 1 } },

    // rename fields and count distinct buildings
    { $project: {
        _id: 0, // hide group key
        room_type: "$_id", // room category and facilities
        room_count: 1, // number of rooms of this type
        total_capacity: "$total", // total resident capacity for this room type
        building_count: { $size: "$buildings" } // distinct buildings offering this type
      }
    }
  ]).toArray()
)

// 5. which courses have the most ongoing leases
console.log("\n5. which courses have the most ongoing leases")
printjson(
  leases.aggregate([
    // get all leases marked valid and ongoing
    { $match: {
        validity: true,
        status: "ongoing"
      }
    },

    // get the resident connected to each lease
    { $lookup: {
        from: "residents",
        localField: "student_id",
        foreignField: "student_id",
        as: "resident"
      }
    },
    { $unwind: "$resident" }, // flatten joined array

    // group by course and collect unique students
    { $group: {
        _id: "$resident.course",
        lease_count: { $sum: 1 },
        students: { $addToSet: "$student_id" }
      }
    },

    // count unique residents so multiple leases dont count them twice
    { $project: {
        _id: 0, // hide group key
        course: "$_id", // resident degree program
        lease_count: 1, // number of leases marked valid and ongoing
        resident_count: { $size: "$students" } // unique residents with matching leases
      }
    },

    // sort by resident count descending
    { $sort: { resident_count: -1, course: 1 } },

    // only show top 5 courses
    { $limit: 5 }
  ]).toArray()
)
