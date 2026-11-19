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
printjson(
  rooms.aggregate([
    // get all rooms greater than 0
    { $match: { room_capacity: { $gt: 0} } },
    
    // group them by their building
    { $group: {
        _id: "$dorm_name",
        total: { $sum: "$room_capacity" }
      }
    },

    // sort by descending
    { $sort: { total: -1 } },

    // hide _id and out bldg name under buildings
    { $project: {
        _id: 0,
        building: "$_id",
        total_capacity: "$total"
      }
    }
  ]).toArray()
)
