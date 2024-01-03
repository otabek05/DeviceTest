import mqtt from "mqtt"
import { useEffect, useState } from "react"
import DigitalOutPut from "./DigitalOutput";
import DigitalComponent from "./DigitalInput";
import AnalogInput from "./AnalogInout";
import {Typography , Grid, CircularProgress} from "@mui/material";

const Main = ()=>{
  const [analog, setAnalog] = useState([]);
  const [digitalInput, setDigitalInput] = useState([]);
  const [digitalOutput, setDigitalOutput] = useState([]);
  const [mqttClient, setMqttClient] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    let brokerURL = "ws://175.210.42.26:8083/mqtt";
    let SensorTopic = "daeRyuk/devices/00:08:DC:77:C9:DF";
    let options = {
      keepalive: 30,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      username: "DashboardUser",
      password: "A123vvvv@@@!1112@@"
    };

    const client = mqtt.connect(brokerURL, options);

    client.on('connect', () => {
      console.log("Connected to MQTT");
      setMqttClient(client);
    });

    client.subscribe(SensorTopic);

    client.on('message', (topic, message) => {
      if (topic === SensorTopic) {
        try {
          const data = message.toString();
          const components = data.split(";");

          // Check the message type
          const messageType = components[1];

          if (messageType === "1") {
            // Message1: Analog values
            const dcVolt = parseFloat(components[2]);
            const battVolt = parseFloat(components[3]);
           // const aiValues = components[4].split(',').map(Number);
           setDeviceInfo({
            dcVolt: dcVolt,
            battVolt: battVolt
           })
           // setAnalog(aiValues);
          } else if (messageType === "2") {
            // Message2: Analog values only
            const aiValues = components[2].split(',').map(Number);
            
            setAnalog(aiValues);
          } else if (messageType === "3") {
            // Message3: Digital Input and Digital Output values
            const diValues = components[2].split(',').map(Number);
            const doValues = components[3].split(',').map(Number);

            setDigitalInput(diValues);
            setDigitalOutput(doValues);
          }
        } catch (e) {
          console.error("Error parsing MQTT message:", e);
        }
      }
    });

    return () => {
      // Clean up the subscription and disconnect the client on component unmount
      client.unsubscribe(SensorTopic);
      client.end();
    };

  }, []);

 console.log(analog);

const toggle = (index, relayStatus) => {
    const consent = window.confirm('Are you sure you want to turn off the alarm?');
    if (consent) {
      const relayData = {
      
          Relay: index,
          Status: relayStatus === 0 ? 1 : 0,
       
      };
      mqttClient?.publish('daeRyuk/devices/relaydata/00:08:DC:77:C9:DF', JSON.stringify(relayData));
      console.log(relayData);
    }
}

    return (
        <>
         <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
             
              <Typography variant="h5" align="center" gutterBottom>
                AC: {deviceInfo?.dcVolt?.toFixed(2)} V
              </Typography>
              <Typography variant="h5" align="center" gutterBottom>
                Battery: {deviceInfo?.battVolt?.toFixed(2)} V
              </Typography>
            </Grid>
     
         <Grid item xs={12}>
        <Typography variant="h5" align="center" gutterBottom>
          Digital Input
        </Typography>
        <DigitalComponent type="input" values={digitalInput} />
      </Grid>
      <Grid item xs={2}>
        <Typography variant="h5" align="center" gutterBottom>
          Digital Output
        </Typography>
        <DigitalOutPut digitalOutput={digitalOutput} toggle={toggle} />
      </Grid>

     

      <Grid item xs={8}>
        
       
        {analog.length > 0 ? (
          <AnalogInput analogInput={analog} setAnalogInput={setAnalog} />
        ) : (
          <CircularProgress color="primary" />
        )}
      </Grid>
    </Grid>
        </>
    )
}

export default Main;