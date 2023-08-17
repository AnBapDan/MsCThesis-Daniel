import pyshark
import sqlite3
from datetime import datetime

conn = sqlite3.connect('/home/es-admin/metrics.sqlite')
cursor = conn.cursor()

def main():
    print("Initiating...")
    capture_live_packets()


def capture_live_packets():

    cursor.execute('''CREATE TABLE IF NOT EXISTS measurements (id INTEGER PRIMARY KEY, protocol TEXT, source TEXT, port_src INTEGER, dest TEXT, port_dest INTEGER, bytes INTEGER, timestamp TEXT)''')
    
    print('['+str(datetime.now())+'] Started capture ...')

    capture = pyshark.LiveCapture(interface=['eth0','tun0', 'usb0'], bpf_filter='port 3000 or ip host 10.255.33.18')
    for raw_packet in capture.sniff_continuously():
        get_packet_details(raw_packet)

def get_packet_details(packet):
    protocol = packet.transport_layer
    length = int(packet.length)
    source_address = packet.ip.src
    source_port = packet[packet.transport_layer].srcport
    dest_address = packet.ip.dst
    dest_port = packet[packet.transport_layer].dstport
    packet_time = packet.sniff_time
    cursor.execute('''INSERT INTO measurements (protocol, source, port_src, dest, port_dest, bytes, timestamp) VALUES (?,?,?,?,?,?,?)''',
    (str(protocol),str(source_address),int(source_port),str(dest_address),int(dest_port),float(length),str(packet_time))
    )
    conn.commit()
    print('['+str(datetime.now())+'] '+source_address+' -> '+dest_address+' ...')
    return f'Packet Timestamp: {packet_time}' \
           f'\nPacket Length: {length} Bytes' \
           f'\nProtocol type: {protocol}' \
           f'\nSource address: {source_address}' \
           f'\nSource port: {source_port}' \
           f'\nDestination address: {dest_address}' \
           f'\nDestination port: {dest_port}\n'


main()