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
load("queries/consts.js");

// CREATE
// C1. register a new resident
console.log("C1. register a new resident");
printjson(
    residents.insertOne({
        student_id: 290001,
        resident_name: "Isabel Dizon",
        sex: "Female",
        course: "BS Computer Science",
        year_level: 1,
        scholar: true
    })
)
// Business context: once an applicant is accepted, the office needs one profile per student.
// This replaces re-typing/importing the same details into separate Google Sheets.

// C2. create a semester lease for that resident
console.log("\nC2. create a semester lease");
printjson(
    leases.insertMany([
        {
            lease_id: 9001,
            student_id: 290001,
            room_number: "C323",
            lease_start: new Date("2026-08-01"),
            lease_end: new Date("2026-12-15"),
            validity: true,
            cost: 88800,
            status: "ongoing"
        },
        // past summer leases for U4
        {
            lease_id: 9002,
            student_id: 290001,
            room_number: "C323",
            lease_start: new Date("2026-06-08"),
            lease_end: new Date("2026-06-19"),
            validity: true,
            cost: 8000,
            status: "ongoing"
        },
        {
            lease_id: 9003,
            student_id: 290001,
            room_number: "C324",
            lease_start: new Date("2026-06-22"),
            lease_end: new Date("2026-06-26"),
            validity: true,
            cost: 4000,
            status: "ongoing"
        }
    ])
)
// Business context: a lease ties a resident to a room for one period and records its cost and
// status. Every semester gets a new lease, so old stays are never overwritten.

// C3. issue an invoice for the lease
console.log("\nC3. issue an invoice for the lease");
printjson(
    invoices.insertOne({
        invoice_id: 900001,
        lease_id: 9001,
        cost: 88800.0,
        payment_status: false
    })
)
// Business context: billing staff need one invoice per lease to track what is owed.

// C4. record a payment against the invoice
console.log("\nC4. record a payment against the invoice");
printjson(
    payments.insertMany([
        // sample failed payment attempt for the other operations below
        { invoice_id: 900001, payment_status: false, amount_paid: 0 },
        { invoice_id: 900001, payment_status: true, amount_paid: 88800 }
    ])
)
// Business context: each payment is logged against its invoice, which leaves an
// auditable trail instead of a paper ledger.

// C5. add new rooms to Cervini Hall
console.log("\nC5. add new rooms to Cervini Hall");
printjson(
    rooms.insertMany([
        {
            room_number: "C323",
            dorm_name: "Cervini Hall",
            room_capacity: 4,
            type: "Quadruple sharing room w/out Aircon, communal T&B",
            floor: 3
        },
        {
            room_number: "C324",
            dorm_name: "Cervini Hall",
            room_capacity: 4,
            type: "Quadruple sharing room w/out Aircon, communal T&B",
            floor: 3
        }
    ])
)
printjson(
    beds.insertMany([
        {
            room_number: "C323",
            room_capacity: 4,
            available_beds: 3,
            lease_start: new Date("2026-08-01")
        },
        {
            room_number: "C324",
            room_capacity: 4,
            available_beds: 4,
            lease_start: new Date("2026-08-01")
        }
    ])
)
// Business context: new rooms need a room record and a bed-availability record.


// READ
// R1. unpaid invoices, largest balance first
console.log("\nR1. unpaid invoices, largest balance first");
printjson(
    invoices.find({ payment_status: false })
        .sort({ cost: -1 })
        .limit(5)
        .toArray()
)
// Business context: shows billing staff who to contact first so the biggest balances are not missed.

// R2. headcount of current residents
console.log("\nR2. headcount of current residents");
printjson(
    leases.countDocuments({ status: { $nin: ["completed", "cancelled"] } })
)
// Business context: a live count for safety and evacuation. $nin excludes leases that are no
// longer active.

// R3. rooms with free beds, most free first
console.log("\nR3. rooms with free beds, most free first");
printjson(
    beds.find({
        available_beds: { $gt: 0 },
        lease_start: new Date("2026-08-03")
    })
        .sort({ available_beds: -1 })
        .limit(5)
        .toArray()
)
// Business context: staff see where applicants can go right now, which avoids
// double-assigning a bed.

// R4. first- and second-year scholars
console.log("\nR4. first- and second-year scholars");
printjson(
    residents.find({ scholar: true, year_level: { $lte: 2 } })
        .sort({ student_id: 1 })
        .limit(5)
        .toArray()
)
// Business context: collects list of scholars to be contacted for service hours.


// UPDATE a field
// U1. confirm payment on an invoice
console.log("\nU1. confirm payment on an invoice");
printjson(
    invoices.updateOne(
        { invoice_id: 900001 },
        { $set: { payment_status: true } }
    )
)
// Business context: once the cashier confirms the payment from C4, the invoice must stop
// appearing in the unpaid list (R1).

// U2. transfer a resident to another room
console.log("\nU2. transfer a resident to another room");
printjson(
    leases.updateOne(
        { lease_id: 9001 },
        { $set: { room_number: "C324" } }
    )
)
printjson(beds.updateOne({ room_number: "C323" }, { $inc: { available_beds: 1 } }))
printjson(beds.updateOne({ room_number: "C324" }, { $inc: { available_beds: -1 } }))
// Business context: in a transfer, it should be ensured that one bed is
// released and one is taken.

// U3. cancel a lease and free the bed
console.log("\nU3. cancel a lease and free the bed");
printjson(
    leases.updateOne(
        { lease_id: 9001 },
        { $set: { status: "cancelled", validity: false } }
    )
)
printjson(
    beds.updateOne(
        { room_number: "C324", lease_start: new Date("2026-08-01") },
        { $inc: { available_beds: 1 } }
    )
)
// Business context: cancellations are recorded, not deleted, so history stays intact. The
// cancelled lease feeds the cancelled-lease report and the freed bed can go to the waitlist.

// U4. close out every ended lease in one step
console.log("\nU4. close out every ended lease in one step");
printjson(
    leases.updateMany(
        {
            lease_id: { $in: [9002, 9003] },
            status: "ongoing",
            lease_end: { $lt: new Date("2026-06-30") }
        },
        { $set: { status: "completed" } }
    )
)
// Business context: at semester end, every ongoing lease past its end date should be marked
// completed together instead of one by one.

// U5. add an item to an array field
console.log("\nU5. add an amenity to a room");
printjson(
    rooms.updateOne(
        { room_number: "C323" },
        [{ $set: { type: { $concat: ["$type", "; Study lounge"] } } }]
    )
)
// Business context: rooms gain facilities over time.


// DELETE
// D1. remove a failed payment
console.log("\nD1. remove a failed payment");
printjson(
    payments.deleteOne({ invoice_id: 900001, payment_status: false })
)
// Business context: a failed payment does not need to be stored on the database.

// D2. retire decommissioned rooms
console.log("\nD2. retire decommissioned rooms");
printjson(rooms.deleteMany({ room_number: { $in: ["C323", "C324"] } }))
printjson(beds.deleteMany({ room_number: { $in: ["C323", "C324"] } }))
// Business context: a room closed for renovation should not appear in availability lists.

// D3. purge a withdrawn student's records
console.log("\nD3. purge a withdrawn student's records");
printjson(
    payments.deleteMany({
        invoice_id: {
            $in: invoices.distinct("invoice_id", { lease_id: { $in: [9001, 9002, 9003] } })
        }
    })
)
printjson(invoices.deleteMany({ lease_id: { $in: [9001, 9002, 9003] } }))
printjson(leases.deleteMany({ student_id: 290001 }))
printjson(residents.deleteOne({ student_id: 290001 }))
// Business context: when a student leaves the university and asks for their data to be
// removed, their payments, invoices, leases and profile are deleted together.
