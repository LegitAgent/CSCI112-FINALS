// PART D: QUERYING WITH OPERATORS AND FILTERS (20%)

// Task: Create 10 different queries using MongoDB query operators to answer business questions.
// Requirements:
//      Use comparison operators: $gt, $lt, $gte, $lte, $ne, $eq
//      Use array operators: $in, $nin, $elemMatch
//      Use logical operators: $or, $and
//      Combine multiple conditions in single queries
//      Sort and limit results appropriately
//      Queries must answer real business questions from your problem domain
//      Example Query Types (adapt to your domain):
//      Filter by exact values
//      Filter by numeric ranges (greater than, less than)
//      Filter by date ranges
//      Find records matching multiple criteria
//      Find records NOT matching criteria
//      Find items in arrays
//      Sort results by relevance
//      Paginate large result sets
// Deliverable:
//      Screenshots of all 10 queries showing filter syntax and results
//      Explanation of what business question each query answers
//      Brief description of expected use case

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
