"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
import * as mqtt from "mqtt";

type publishedMessage = {
  text: string;
  isMine: boolean;
  clientId: string;
};

export default function mqttTest() {
  // const [messages, setMessages] = useState<string[]>([]);
  const [messages, setMessages] = useState<publishedMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  // MQTT 클라이언트 생성
  // https://velog.io/@aimzero9303/Mac-MQTT-mosquitto-%EC%84%A4%EC%B9%98-%ED%85%8C%EC%8A%A4%ED%8A%B8
  // /opt/homebrew/etc/mosquitto/mosquitto.conf
  // /opt/homebrew/opt/mosquitto/sbin/mosquitto -c /opt/homebrew/etc/mosquitto/mosquitto.conf
  // https://rubenchoi.tistory.com/22
  //    brew services start mosquitto
  //    brew services stop mosquitto
  // 1) 구독 : mosquitto_sub -h [주소] -p [포트] -t [주제, 방제목]
  // /opt/homebrew/Cellar/mosquitto/2.0.15/bin/mosquitto_sub -h localhost -p 1883 -t every
  // 2) 발행 :mosquitto_pub -h [주소] -p [포트] -t [주제, 방제목] -m [메세지]
  // /opt/homebrew/Cellar/mosquitto/2.0.15/bin/mosquitto_pub -h localhost -p 1883 -t every -m "test message"

  useEffect(() => {
    const mqttClient = mqtt.connect("mqtt://localhost:9001");
    console.log(mqttClient.connected);

    mqttClient.on("error", (error) => {
      console.log("Can't connect" + error);
      mqttClient.end();
    });

    // MQTT 클라이언트 이벤트 핸들러 등록
    mqttClient.on("connect", () => {
      console.log("연결됨");
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("chat");
    });

    mqttClient.on("message", (topic, message) => {
      console.log("Received message:", message.toString());
      console.log(mqttClient.options.clientId);
      console.log(topic);
      console.log(mqttClient);
      // setMessages((prevMessages) => [...prevMessages, message.toString()]);

      const parsedMessage = JSON.parse(message.toString());
      const isMine = parsedMessage.clientId === mqttClient.options.clientId; // 클라이언트 식별자와 일치 여부 판별
      const processedMessage: publishedMessage = {
        text: parsedMessage.text,
        isMine: isMine,
        clientId: mqttClient.options.clientId || "",
      };
      console.log("Received message:", processedMessage);
      console.log(processedMessage.isMine);
      setMessages((prevMessages: publishedMessage[]) => [...prevMessages, processedMessage]);
    });

    setClient(mqttClient);

    return () => {
      // 컴포넌트 언마운트 시 MQTT 클라이언트 연결 해제
      mqttClient.end();
    };
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const input = inputRef.current?.value;
    if (input) {
      // MQTT 브로커로 메시지 발행
      // client?.publish("chat", input);
      const publishedMessage = {
        text: input,
        isMine: true,
        clientId: client!.options.clientId, // 클라이언트 식별자
      };
      client?.publish("chat", JSON.stringify(publishedMessage));
    }
  };

  return (
    <div>
      <h1>MQTT Chat App</h1>
      <ul>
        {messages.map((message, index) => {
          if (message.isMine) {
            <li key={index} className="mine">
              내가~~ {message.text}
            </li>;
          } else {
            return (
              <div key={index} className="other">
                니가~~ {message.text}
              </div>
            );
          }
        })}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={inputRef} className="w-full border" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
