const { DateTime } = require("luxon");
const { mongoose } = require("mongoose");
DateTime

var Schema = mongoose.Schema;

var ProductSchema =  new Schema({
    product_name : {type: String, required: true, maxLength: 50},
    product_price : {type: Number, required: true, min: 1, max:10000},
    date_added: {type: Date},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    brand: {type: Schema.Types.ObjectId, ref: 'Brand'}
})

//Virtual for Product
ProductSchema.virtual('url')
.get(function () {
    return '/products/product/' + this._id;
});

ProductSchema.virtual('formatted_date_added')
.get(function () {
    return DateTime.fromJSDate(this.date_added).toFormat("dd LLL yyyy");
}
);

module.exports = mongoose.model('Product', ProductSchema);