const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");


const dotEnv = require("dotenv");
dotEnv.config()


//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (enteredPassword, savedPassword, salt) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, process.env.APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    // console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], process.env.APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
}; 


//Message Broker

// Example error handling in CreateChannel
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(process.env.MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    console.error("Error creating channel:", err);
    throw new Error("Error creating channel");
  }
};


module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(process.env.EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};

module.exports.SubscribeMessage = async (channel, service , bind_key) => {
  const appQueue = await channel.assertQueue(process.env.QUEUE_NAME)

  channel.bindQueue(appQueue.queue , process.env.EXCHANGE_NAME , bind_key)

  channel.consume(appQueue.queue , data =>{
    console.log('data recieved');
    console.log(data.content.toString());
    channel.ack(data)
  })
}