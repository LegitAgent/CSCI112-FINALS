// PART C: CRUD OPERATIONS FOR SYSTEM FUNCTIONALITY (20%)

// Task: Implement and demonstrate Create, Read, Update, Delete operations necessary for your system.
// Requirements:
//    Create: Insert new documents with complete information (3+ examples)
//    Read: Retrieve documents using various criteria (3+ examples)
//    Update: Modify existing documents and arrays (3+ examples)
//    Delete: Remove documents appropriately (3+ examples)
//    Operations must reflect actual system needs from your problem statement
//    Minimum 12 total CRUD demonstrations
// Deliverable:
//    Screenshots of each CRUD operation showing Compass queries
//    Business context explaining why each operation is necessary
//    Evidence of successful execution

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
