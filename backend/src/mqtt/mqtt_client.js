import mqtt from 'mqtt';
import chalk from 'chalk';
import { query } from '../db/db_manager.js';

const mqttURL = process.env.MQTT_URL || 'mqtt://localhost:1883';
const topic = process.env.MQTT_TOPIC || 'test/topic';

const mqttClient = mqtt.connect(mqttURL);

mqttClient.on('connect', () => {
    console.log(chalk.blue('Connected to MQTT broker'));
    mqttClient.subscribe(topic, (err) => {
        if (err) {
            console.error(chalk.red('Error subscribing to topic:', err));
        } else {
            console.log(chalk.green(`Subscribed to topic: ${topic}`));
        }
    });
});

mqttClient.on('message', async (topic, message) => {
    try {
        const jsonMessage = JSON.parse(message.toString());
        jsonMessage.timestamp = new Date().toISOString();

        if (!jsonMessage.sensor_id || !jsonMessage.value) {
            console.error(chalk.red('Invalid message format:', jsonMessage));
            return;
        }

        // console.log(chalk.yellow(`Received message: ${JSON.stringify(jsonMessage)}`));
        await query('INSERT INTO measurements (sensor_id, value, timestamp) VALUES ($1, $2, $3)', [jsonMessage.sensor_id, jsonMessage.value, jsonMessage.timestamp]);
        // console.log(chalk.green('Measurement inserted into database'));

    } catch (err) {
        console.error(chalk.red('Failed to parse message:', err));
    }
});

mqttClient.on('error', (err) => {
    console.error(chalk.red('MQTT error:', err));
});

export default mqttClient;
