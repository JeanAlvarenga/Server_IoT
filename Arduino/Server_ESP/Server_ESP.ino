#include <ArduinoJson.h>
#include <WiFi.h>
#include <WebServer.h>

// Defina os 8 pinos do atuador
#define pino1 2 // Ajuste para o pino correto do ESP8266
#define pino2 4 // Ajuste para o pino correto do ESP8266

//#include <ESP8266WiFi.h>
//#include <ESP8266WebServer.h>

//const char *ssid = "KGB";
//const char *password = "servicosecreto";

IPAddress ip(192, 168, 2, 108); // definicao IP estatico ESP32
IPAddress gateway(192, 168, 2, 1); // Gatwei padrão
IPAddress subnet(255, 255, 255, 0); // Máscara de sub-rede

WebServer server(80);
//ESP8266WebServer server(80);

float sensorValue = 25.5; // Valor do sensor simulado
uint8_t pinState_sala = 0; // Estado do pino 1
uint8_t pinState_q_1 = 0; // Estado do pino 1

void handleRequest() {
    // Cria um objeto JSON
  StaticJsonDocument<200> jsonDoc;
  server.sendHeader("Access-Control-Allow-Origin", "*");

   // Adiciona os valores ao objeto JSON
  jsonDoc["temperature"] = sensorValue;
  jsonDoc["sala"] = pinState_sala;
  jsonDoc["quarto_1"] = pinState_q_1;

   // Serializa o objeto JSON em uma string
  String jsonString;
  serializeJson(jsonDoc, jsonString);

    // Define o tipo de conteúdo da resposta como JSON
  server.send(200, "application/json", jsonString);
}

void handleSensor() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", String(sensorValue));
}

void handleActuator() {
  server.sendHeader("Access-Control-Allow-Origin", "*");

  String pin = server.arg("pin");
  String val = server.arg("val");
  Serial.println("pin = "+pin);
  Serial.println("val = "+val);
  switch (pin.toInt()){
  case 0:
    digitalWrite(pino1, val.toInt());
    pinState_sala = val.toInt();
    break;
  case 1:
    digitalWrite(pino2, val.toInt());
    pinState_q_1 = val.toInt();
    break;
  
  default:
    break;
  }

  server.send(200, "text/plain", "enviado");
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

  Serial.print("Endereço IP atribuído: ");
  Serial.println(WiFi.localIP());

  if (!WiFi.config(ip, gateway, subnet)) {
    Serial.println("Falha ao configurar IP estático");
  }
  Serial.print("Endereço IP estático configurado: ");
  Serial.println(WiFi.localIP());

  

  server.on("/request", HTTP_GET, handleRequest);
  server.on("/sensor", HTTP_GET, handleSensor);
  server.on("/actuator", HTTP_GET, handleActuator);
  server.on("/", HTTP_GET, handleActuator);

  server.begin();
  Serial.println("Servidor HTTP iniciado");
}

void loop() {
  server.handleClient();
}

