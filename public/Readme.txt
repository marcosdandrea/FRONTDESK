I know it's kind of late now, but I just dealt with this last week. After much fighting with the LG Displays and asking IT if they were blocking WOL packets and such, I finally found out that there is a secret installation menu in the displays we were using, and in the secret menu there was a setting for "Enable WakeOnLan" and after that was enabled I could turn the TVs on via WOL. After the TVs are on, you could control them via TCP port 9761 with the usual LG protocol:
ka 00 00 // power off
xb 00 90 // hdmi 1
xb 00 91 // hdmi 2

The network guy danced a jig around me when we found that menu because he had been racking his brain trying to figure out what in their network switches would be blocking it. I tried both the local broadcast (192.168.0.255) and the global broadcast (255.255.255.255) addresses on UDP port 9 and both worked. 6 bytes of $FF followed by the MAC address 16 times.

"$FF,$FF,$FF,$FF,$FF,$FF,$00,$0C,$7F,$10,$FA,$EB,$00,$0C,$7F,$10,$FA,$EB,$00,$0C,$7F,$10,$FA,$EB..."

LG Installation Menu:
https://www.lg.com/in/support/product-help/CT32003428-20150309396894-others