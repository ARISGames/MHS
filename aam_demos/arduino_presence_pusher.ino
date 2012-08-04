#include <SPI.h>
#include <Ethernet.h>
#include <PusherClient.h>

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
PusherClient client;

void setup() {
  Serial.begin(9600);
  if (Ethernet.begin(mac) == 0)
    stop("Init Ethernet failed");
  
  if(client.connect("7fe26fe9f55d4b78ea02")) {
    client.bindAll(handleEvents);
    client.subscribe("presence-pusher_room_channel");
  }
  else
    stop("Pusher Connect failed");
}

void stop(String error)
{
  Serial.println(error);
  while(1);
}

void loop() {
  if (client.connected()) {
    client.monitor();
  }
  else
    ;
}

void handleEvents(String data) {
  Serial.println(data);
}
