// Task: Build 10 queries using MongoDB query operators that answer real dorm-management questions.
// Requirements:
//      Use comparison operators ($gt, $lt, $gte, $lte, $ne, $eq)
//      Use array operators ($in, $nin, $elemMatch)
//      Use logical operators ($or, $and)
//      Combine multiple conditions in single queries
//      Sort and limit results appropriately
//      Queries must answer real business questions
// Deliverable:
//      Screenshots of the queries showing filter syntax and results
//      Explanation of the business question each query answers
//      Brief description of the expected use case
//
// Note on $elemMatch: none of the 7 collections has an array field, so there
// is nothing for $elemMatch to match against. Array operators are covered by $nin (query 4).

// Setup: run before the numbered demonstrations.
load("queries/consts.js");

// ------------------------------------------------------------
// COLLECTIONS AND BILLING
// ------------------------------------------------------------

// 1. unpaid invoices, biggest to lowest
console.log("1. unpaid invoices, biggest to lowest")
printjson(
  invoices.find(
    // only invoices not yet marked as paid
    { payment_status: false }
  )
  .sort({ cost: -1 }) // largest balances first
  .limit(20)          // keep the list short enough to work through in one sitting
  .toArray()
)
// Business question: who has not paid their invoices yet?
// Insight/use case: a quick list of who needs to be contacted for payment. It saves billing
// staff from looking through every ledger by hand and reduces the chance of a missed unpaid invoice.

// 2. failed payment attempts
console.log("\n2. failed payment attempts")
printjson(
  payments.find({
    // failed transactions only (nothing was actually collected)
    payment_status: false,
    amount_paid: { $eq: 0 }
  })
  .sort({ invoice_id: 1 }) // group each failure by invoice for easy lookup
  .toArray()
)
// Business question: which payment transactions failed, so the cashier can reconcile them?
// Insight/use case: failed attempts are easy to miss in paper ledgers and can make an invoice look
// paid or unpaid incorrectly. 
//
// ------------------------------------------------------------
// LEASE MANAGEMENT
// ------------------------------------------------------------

// 3. leases ending this December
console.log("\n3. leases ending this December")
printjson(
  leases.find({
    $and: [
      // lease is still running
      { status: "ongoing" },
      // and ends within the month (change both dates for any other semester-end month)
      { lease_end: { $gte: ISODate("2026-12-01"), $lte: ISODate("2026-12-31") } }
    ]
  })
  .sort({ lease_end: 1 }) // soonest end date first
  .limit(50)
  .toArray()
)
// Business question: whose lease is ending soon?
// Insight/use case: every lease ending in December is a one-semester lease. Per the URH FAQ,
// one-semester residents must fully vacate and submit a new application to stay, while two-semester
// residents continue without reapplying. This tells staff who needs a check-out/reapplication
// reminder and which rooms will have open slots next semester.

// 4. current residents (not completed or cancelled)
console.log("\n4. current residents (not completed or cancelled)")
// headcount
console.log("current resident count:", leases.countDocuments({ status: { $nin: ["completed", "cancelled"] } }))
printjson(
  leases.find(
    // exclude leases that are no longer active
    { status: { $nin: ["completed", "cancelled"] } }
  )
  .sort({ room_number: 1 }) // list by room
  .limit(50)
  .toArray()
)
// Business question: how many residents are currently residing in the dorms?
// Insight/use case: a live headcount for safety and emergency purposes, such as evacuation counts.
// $nin keeps only active leases, so the number reflects the current population without hand counting.

// 5. intersession occupants
console.log("\n5. intersession occupants")
printjson(
  leases.find(
    // leases that started before the August semester began
    { lease_start: { $lt: ISODate("2026-08-03") } }
  )
  .sort({ lease_start: 1 }) // earliest first
  .limit(20)
  .toArray()
)
// Business question: how many students used the dorm during intersession, and who were they?
// Insight/use case: intersession is a separate, shorter period (June to July). Management can compare
// summer demand against semester demand to decide which and how many dorms to open for intersession
// again, and reconcile intersession billing separately from semester billing.

// 6. cancelled or invalidated leases
console.log("\n6. cancelled or invalidated leases")
printjson(
  leases.find({
    $or: [
      // lease was cancelled
      { status: "cancelled" },
      // or lease is marked invalid
      { validity: false }
    ]
  })
  .sort({ lease_start: 1 })
  .toArray()
)
// Business question: which beds were released by cancellations, so they can be reassigned?
// Insight/use case: per the URH FAQ, a cancelled application forfeits all fees, so the office has to
// record each cancellation. The list also keeps the waitlist moving: without it, a cancelled bed
// can sit empty because nobody noticed.

// ------------------------------------------------------------
// VACANCY
// ------------------------------------------------------------

// 7. available beds this semester
console.log("\n7. available beds this semester")
printjson(
  beds.find({
    // beds holds two snapshots; 2026-08-03 is the current semester
    lease_start: ISODate("2026-08-03"),
    // at least one free bed in the room
    available_beds: { $gt: 0 }
  })
  .sort({ available_beds: -1, room_number: 1 }) // most free beds first, then by room
  .toArray()
)
// Business question: which beds are still available this semester?
// Insight/use case: when placing students who applied for residency, especially at the start of a
// semester, staff need an instant bed list instead of checking rooms by hand. The URH FAQ promises
// applicants a result (approval, room assignment or waitlist) within 3 to 5 working days. It also
// helps avoid assigning two residents to the same bed, and rooms with the most free beds
// help when placing groups together.

// 8. rooms without aircon
console.log("\n8. rooms without aircon")
printjson(
  rooms.find(
    // room type text contains "w/out Aircon"
    { type: { $regex: "w/out Aircon", $options: "i" } }
  )
  .sort({ dorm_name: 1, floor: -1 }) // by building, then highest floor first
  .limit(20)
  .toArray()
)
// Business question: which rooms are candidates for a downgrade, or for an upgrade request?
// Insight/use case: the URH FAQ allows room upgrade and downgrade requests, subject to
// availability and fee adjustments. Staff can see at a glance which rooms lack aircon, handle those
// requests quickly, and give extra attention to complaints such as heat.

// ------------------------------------------------------------
// RESIDENT PROFILING
// ------------------------------------------------------------

// 9. scholars
console.log("\n9. scholars")
printjson(
  residents.find(
    // scholarship residents only
    { scholar: true }
  )
  .sort({ year_level: -1, resident_name: 1 }) // upper years first, then alphabetical
  .limit(20)
  .toArray()
)
// Business question: which residents may be prioritized for lease approval? (assumption)
// Insight/use case: the URH FAQ says certain student groups may be given priority, as determined
// by the University. This assumes scholars may be one such group. It also gives staff a ready list
// for scholar-specific requirements and communications.

// 10. incoming (first-year) students
console.log("\n10. incoming (first-year) students")
printjson(
  residents.find(
    // first-year residents only
    { year_level: 1 }
  )
  .sort({ resident_name: 1 }) // alphabetical for easy roll call
  .limit(20)
  .toArray()
)
// Business question: who needs the check-in briefing on House Rules and damage reporting?
// Insight/use case: the URH FAQ expects residents to follow the House Rules and to report any existing
// damage immediately on check-in. First-year residents are the most likely to be new to dorm life,
// so staff can use this list to schedule a briefing and a room-condition walkthrough at move-in.