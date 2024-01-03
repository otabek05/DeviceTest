import React, { createContext, useContext, useEffect, useReducer, useState }  from "react";
import * as mqtt from 'mqtt/dist/mqtt.min';
import mqtt from "mqtt"

const MqttContext = createContext()
export const useMqtt = ()=> useContext(MqttContext)

export const MqttProvider = ({children}) =>{
    const [mqttClient, setMqttClient] = useState(null)
    const [alerts, setAlerts] = useState([])
    const info = JSON.parse(localStorage.getItem('companyInfo'))

    const MqttConnection = (info) =>{
      let brokerURL = "ws://175.210.42.26:8083/mqtt"
      let AlertTopic = "dashboard/alert/"+info?.id
      let SensorTopic = 'device/info/sensor/#'
      let options = {
          keepalive: 30,
          protocolId: 'MQTT',
          protocolVersion: 4,
          clean: true,
          reconnectPeriod: 1000,
          connectTimeout: 30 * 1000,
          username: "DashboardUser"+info?.email,
          password: "A123vvvv@@@!1112@@"+info?.id,
      }
      const client = mqtt.connect(brokerURL, options)
      client.on('connect',()=>{
          console.log("Connected to MQTT")
          setMqttClient(client)
      })
      client.subscribe(AlertTopic)
      client.subscribe(SensorTopic)
      client.on('message', (topic, message) => {
          if (topic === AlertTopic) {
            try {
              const data = JSON.parse(message.toString());
              console.log(data)
              // Check if data already exists in alerts
              const isDataExists = alerts.some(existingData => (
                existingData.device_mac_address === data.device_mac_address && existingData.port === data.port
              ));
    
              if (!isDataExists) {
                setAlerts(prev => [...prev, data]);
              }
              
              if (data.status === "finished") {
                setAlerts(prev => prev.filter(existingData => (
                  existingData.device_mac_address !== data.device_mac_address || existingData.port !== data.port
                )));
              }
            } catch (e) {
              console.error("Error parsing MQTT message:", e);
            }
          
          }
          });
        
  }
    const PublishMessage = (topic, msg) =>{
        if(mqttClient){
            mqttClient.publish(topic, msg)
            console.log(`Published Message ${topic} : ${msg}`)
        }
    }

   const connectToMqtt = ()=>{
    if(info){
      MqttConnection(info)
    }
   }
   useEffect(()=>{
    connectToMqtt()
   },[])
    return (
        <MqttContext.Provider value={{mqttClient, alerts, PublishMessage }}> 
           {children}
        </MqttContext.Provider>
    )
}
