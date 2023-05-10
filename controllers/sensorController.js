import mqtt from "mqtt";
import Booking from '../models/booking.js';

const mqtt_server = "broker.hivemq.com";
const mqtt_port = 1883;
const mqtt_topic = "PARKING_SYSTEM_DATA";

const mqttClient = mqtt.connect(`mqtt://${mqtt_server}:${mqtt_port}`);

export const getIndex = (io) => (req, res) => {
  try {
    io.on("connection", (socket) => {
      console.log("WebSocket connected");

      mqttClient.subscribe(mqtt_topic, (err) => {
        if (err) {
          console.log("MQTT subscription failed: " + err);
        } else {
          console.log("MQTT subscription successful");
        }
      });

      // listen for MQTT messages and send payload via WebSocket
      mqttClient.on("message", async function (topic, message) {
        if (topic === mqtt_topic) {
          const payload = message.toString();
          var sensorData = payload.split(",");
          await Booking.find({ status: "Booked" }, { slotId: 1, _id: 0 }, function (err, bookings) {
            if (err) {
              res.status(500).send(err.message);
            } else {
              const bookedSlotIds = bookings.map((booking) => booking.slotId);
              for (let i = 0; i < bookedSlotIds.length; i++) {
                sensorData[bookedSlotIds[i] - 1] = 3;
              }
            }
          });
          socket.emit("sensorData", sensorData);
          socket.emit("sensorData", payload);
        }
      });

      // handle WebSocket disconnections
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    });

    res.render("sensor");
  } catch (error) {
    res.status(500).send(error);
  }
};