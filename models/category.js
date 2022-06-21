const { mongoose } = require("mongoose");

var Schema =  mongoose.Schema

var CategorySchema = new Schema({
    category_name: {type: String, required: true, maxLength:150},
    category_desc: {type: String, maxLength:200}
});

CategorySchema.virtual('url').get(function () {
    return '/products/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);