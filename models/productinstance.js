const {  mongoose, SchemaType } = require("mongoose");
const { DateTime } = require("luxon");


var Schema = mongoose.Schema;

var ProductInstanceSchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    status: {type: String, required: true, enum:['Available', 'Out of stock'], default:'Available'},
    check_back: {type:Date, default:Date.now}
});

ProductInstanceSchema.virtual('url')
.get(function() {
    return '/products/productinstance/' + this._id;
});

ProductInstanceSchema.virtual('check_back_formatted')
.get(function() {
    return DateTime.fromJSDate(this.check_back).toFormat("dd LLL yyyy");
}
);


module.exports = mongoose.model('ProductInstance', ProductInstanceSchema);