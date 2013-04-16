#include <PusherClient.h>
#include <Ethernet.h>
#include <SPI.h>

char subscribe[] = "Serial_Data";
char receive_channel[] = "Serial_Data";
String pusher_channel = "Serial_Data";
String pusher_event_register = "arduino_event_register";

EthernetClient arisClient;
PusherClient pusherClient;

byte mac[] = { 
  0x90, 0xA2, 0xDA, 0x0C, 0x00, 0x83 };
byte aris[] = { 
  50, 56, 80, 147 };
  
String data;
char dataArray[100];

void setup() {
  Serial.begin(9600);
  //Serial.println("Setup...");
  Ethernet.begin(mac); //,ip
  delay(1000); //Give time to initialize before connecting
  
  while(!pusherClient.connect("7fe26fe9f55d4b78ea02")){}
  while(!pushMessage(pusher_channel, pusher_event_register, "success")) {}
  pusherClient.bind("Serial_Data_Event", eventHandler);
  pusherClient.subscribe(receive_channel);
} 


void loop() {
  pusherClient.monitor();
  if(Serial.available() > 0) { 
     //data = Serial.read();
     Serial.readBytesUntil('#', dataArray, 5000);
  }
  int i = 0;
  while(dataArray[i] != '#'){
    data += dataArray[i]; 
  }
  while(!pushMessage(pusher_channel, "Serial_Data_Received", data)) { }
}

void eventHandler(String data) {
    Serial.print(data);
}

boolean pushMessage(String channel, String event, String data){
  if(arisClient.connect(aris, 80)){
    String request = "GET /server/pusher/public_send.php?channel="; //change when updated
    request += channel;
    request += "&event=";
    request += event;
    request += "&data=";
    request += data;
    request += " HTTP/1.0";
    arisClient.println(request);
    arisClient.println();
    arisClient.stop();
    return true;
  }
  return false;
}

