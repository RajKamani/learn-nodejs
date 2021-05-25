const mongoose =  require("mongoose")

const commentSchema = new mongoose.Schema({

    commentText :{
        type:String,
        required : true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});


module.exports = mongoose.model('Comment',commentSchema);