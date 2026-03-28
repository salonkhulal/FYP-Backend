import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messageType: {
        type: String,
        enum: ["text", "image"],
        required: true
    },
    content: {
        type: String,
        required: function() {
            return this.messageType === "text"
        }
    },
    imageUrl: {
        type: String,
        required: function() {
            return this.messageType === "image" 
        }
    },
    room: {  
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
}, {timestamps: true});

const Message = models.Message || model('Message', messageSchema);
export default Message;