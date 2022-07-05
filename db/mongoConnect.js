const mongoose = require('mongoose');

// אם יש טעות /אירור בשרת ידפיס בקונסול
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://natan:148148148na@cluster0.lteck.mongodb.net/deds');
  // אם הצליח להתחבר יציג מונגו קוניקט
  console.log("mongo connect 11!")
}