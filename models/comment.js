var mongoose  = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    
content:{
    type:String,
    required:true
},
author:{
    type:String,
    required:true
},
articleId:{
    type:Schema.Types.ObjectId,
    ref:"article",
    required:true
}
},{timestamps:true})

module.exports = mongoose.model('Comment',commentSchema);

// comment -> commentSchema
