from threading import Thread
from queue import Queue
import serial
import time
import re
from datetime import datetime
from django.utils import timezone
from dashboard.models import *

SERIAL_PORT = "/dev/ttyACM0"


class EnergieMsg:
    regex = re.compile(r"S;(\d+;){12}F")
    lastValue = 0

    def __new__(cls, tram):
        if cls.regex.search(tram) is None:
            return None
        else:
            return super().__new__(cls)

    def __init__(self, msg):
        self.msg = msg
        self.date = datetime.now(tz=timezone.utc)
        self.values = msg.rstrip('F;').lstrip(';S').split(';')
        self.values = [float(i)/100 for i in self.values]
        self.values = [{'tension':self.values[i*4],
                         'courant':self.values[i*4+1],
                         'puissance':self.values[i*4+2],
                         'energie':self.values[i*4+3]}
                       for i in range(3)]
        self.save()
        # self.date = obj.created_at

    def save(self):
        for i in range(len(self.values)):
            phase = Phase.objects.create(phase=i+1, created_at=self.date)
            Tension.objects.create(value=self.values[i].get('tension'), phase=phase)
            Courant.objects.create(value=self.values[i].get('courant'), phase=phase)
            Puissance.objects.create(value=self.values[i].get('puissance'), phase=phase)
            Energie.objects.create(value=self.values[i].get('energie'), phase=phase)

    def get(self):
        return self.values+ [self.date]


class SerialThread(Thread):
    def __init__(self):
        super().__init__(name="serialThread")
        self.q = Queue(maxsize=5)
        self.count = 0

    def run(self):
        ser = None
        while True:
            try:
                if ser is None:
                    ser = serial.Serial(SERIAL_PORT, 9600, timeout=2)
                    time.sleep(2)
                if ser is not None:
                    tram = ser.readline().decode().strip()
                    t = EnergieMsg(tram)
                    if t is not None:
                        if self.q.full():
                            with self.q.mutex:
                                self.q.queue.clear()
                        self.q.put(t.get())
            except Exception as e:
                ser = None
                print(e)
                time.sleep(1)


if __name__ == '__main__':
    datetime.now(tz=timezone.utc)
    # SerialThread().start()
