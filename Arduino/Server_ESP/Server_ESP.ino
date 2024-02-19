#include <WiFi.h>
#include <WebServer.h>

//#include <ESP8266WiFi.h>
//#include <ESP8266WebServer.h>

#define pino1 12
#define pino2 13

//const char *ssid = "KGB";
//const char *password = "servicosecreto";

WebServer server(80);
//ESP8266WebServer server(80);

float sensorValue = 25.5; // Valor do sensor simulado
int pinState = 0; // Estado do pino do atuador

void handleSensor() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", String(sensorValue));
}

void handleActuator() {
  server.sendHeader("Access-Control-Allow-Origin", "*");

  String pin = server.arg("pin");
  String val = server.arg("val");


  if (pin == "pin1") {
    digitalWrite(pino1, val.toInt()); // Ajuste para o pino correto do ESP8266
    pinState = val.toInt();
  } else if (pin == "pin2") {
    digitalWrite(pino2, val.toInt()); // Ajuste para o pino correto do ESP8266
    pinState = val.toInt();
  }

  server.send(200, "text/plain", String(pinState));
}

void setup() {
  Serial.begin(115200);

  pinMode(pino1, OUTPUT); // Ajuste para o pino correto do ESP8266
  pinMode(pino2, OUTPUT); // Ajuste para o pino correto do ESP8266

  digitalWrite(pino1, LOW); // Certifique-se de que os pinos do atuador estão desligados inicialmente
  digitalWrite(pino2, LOW);


  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Conectado ao WiFi!");

  server.on("/sensor", HTTP_GET, handleSensor);
  server.on("/actuator", HTTP_GET, handleActuator);
  server.on("/", HTTP_GET, handleActuator);

  server.begin();
  Serial.println("Servidor HTTP iniciado");
}

void loop() {
  server.handleClient();
}

