const { mongoose } = require("mongoose");

var Schema = mongoose.Schema;

var BrandSchema = new Schema({
    brand_name:{type:String, required:true},
    brand_desc:{type:String, maxLength: 1500}
})

BrandSchema.virtual('url').
get(function () {
    return '/products/brand/' + this._id;
});

module.exports = mongoose.model('Brand', BrandSchema);