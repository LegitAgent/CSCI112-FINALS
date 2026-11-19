// Task: Build 5 aggregation pipelines that transform raw data into strategic business intelligence.
// Requirements:
//      Each pipeline must include minimum 3 stages
//      Use $match to filter data before processing
//      Use $group to aggregate data by categories
//      Use $sort to order results meaningfully
//      Use $project to shape output fields
//      Use $limit or other stages as appropriate
//      Pipelines must answer strategic business questions
//      Example Aggregation Types (adapt to your domain):
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
var dorm = db.getSiblingDB('csci112_finals');

// some sample syntax
// CREATE
db.dorm.insertOne({
  field: value,
  anotherField: value
})

// READ
db.dorm.find({
  field: { $gte: value }
})

// UPDATE a field
db.dorm.updateOne(
  { identifyingField: value },
  { $set: { fieldToChange: newValue } }
)

// UPDATE an array
db.dorm.updateOne(
  { identifyingField: value },
  { $addToSet: { arrayField: newItem } }
)

// DELETE
db.dorm.deleteOne({
  identifyingField: value
})

// for printing to terminal, just do printJson
// simply do a wrapper
