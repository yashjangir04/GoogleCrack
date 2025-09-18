const mongoose = require("mongoose") ;

mongoose.connect("mongodb+srv://yashjangir04:261800dy@cluster0.iifgzlz.mongodb.net/recruitment_portal")
.then(() => {
    console.log("Database Connected Successfully ✅");
})
.catch((err) => {
    console.log("Database didn't connect ❌");
})

module.exports = mongoose.connection ;