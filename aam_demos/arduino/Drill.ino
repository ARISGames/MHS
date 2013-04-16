#include <Ethernet.h>
#include <SPI.h>

byte mac[] = { 0x90, 0xA2, 0xDA, 0x00, 0x49, 0xDE };
byte ip[] = { 192, 168, 2, 2 };
byte gateway[] = { 192, 168, 2, 1 };
byte subnet[] = { 255, 255, 255, 0 };
byte aris[] = { 50, 57, 138, 30 };

String pusher_channel = "arduino-pusher_room_channel";
String pusher_event_register = "arduino_event_register";
String pusher_event_num[] = {"Drill_On", "Drill_Off"};

const int drillPin = 17;
boolean drillState = false;
boolean previousDrillState = false;

EthernetClient arisClient;

void setup() {
  Ethernet.begin(mac); //,ip
  delay(1000); //Give time to initialize before connecting
  while(!pushMessage(pusher_channel, "arduino_event_register", "success")) { }
  
  pinMode(drillPin, INPUT);  
    
}

void loop() {
  boolean datareturned = false;
  if(arisClient.available()) datareturned = true;
  while(arisClient.available()) 
    Serial.print((char)arisClient.read());
  if(datareturned)
    Serial.println();
    
  readInputDrill();
  actInputDrill();
}

void readInputDrill(){
  drillState = digitalRead(drillPin);
}

void actInputDrill(){
    if(drillState != previousDrillState){
      int offset = 0;
      if(!drillState){
          offset = 1;
      }
      if(pushMessage(pusher_channel, pusher_event_num[offset], "")){ }
    previousDrillState = drillState;
  }
}

boolean pushMessage(String channel, String event, String data){
  if(arisClient.connect(aris, 80)){
    String request = "GET /devserver/pusher/public_send.php?public_channel=";
    request += channel;
    request += "&public_event=";
    request += event;
    request += "&public_data=";
    request += data;
    request += " HTTP/1.0";
    arisClient.println(request);
    arisClient.println();
    arisClient.stop();
    return true;
  }
  return false;
}

