// main db
var dorm = db.getSiblingDB("csci112_finals");

// collections
var buildings = dorm.getCollection("buildings");
var rooms = dorm.getCollection("rooms");
var beds = dorm.getCollection("beds");
var residents = dorm.getCollection("residents");
var leases = dorm.getCollection("leases");
var invoices = dorm.getCollection("invoices");
var payments = dorm.getCollection("payments"); 
