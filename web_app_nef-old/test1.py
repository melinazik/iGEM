from flask import Flask
from flask import Markup
from flask import render_template
from flask import request
#---
####import RPi.GPIO as io
import cv2
import sqlite3
#-----
import time
from time import gmtime, strftime
import datetime
from datetime import timedelta
from datetime import datetime
#----
from threading import Timer
from threading import Event
from threading import Thread, current_thread
#-----
import os

#initialize application

app = Flask(__name__)


#keep last time pin_button press
###time_press = datetime.now()

#keep last time ir detected movement 
##time_ir_detect = datetime.now()

#keep last time light opened/closed
###li_start= datetime.now()
###li_end= datetime.now()
###seconds = datetime.now()

#global vars

# keep state of light
###light = False

#IR state
###stateR = False

###ir_wait = 20
###cam_wait = 10 
###watt_count = 10
###kwh_COST = 0.3

###presence = False

# 0 = None
# 1 = Manual On/Off
# 2 = On/Off with IR 
# 3 = Security Mode 
mode_operation = 0

#pins setup
###pin_relay = 6
###pin_button = 12
###pin_ir = 18

#camera
#####def get_image(cam): 
  ###  retval, im = cam.read()
   ### return im


###photo_dir = "/home/pi/Desktop/programms/ACSTAC/bear1/static/"

database_name = "/home/pi/bear/bear.db" ##TODO !! change

# calculate wasted elecricity in seconds
# # #####def calculate(prev_day):
#     global database_name

#     today = datetime.now()
#     today = datetime(int(today.year), int(today.month), int(today.day), 0, 0, 0)
#     start_day = today - timedelta(days=prev_day)
#     end_day = today - timedelta(days=prev_day+1)

#     print(start_day, end_day)

#     conn=sqlite3.connect(database_name)

#     query = "SELECT  datetime, source, state, presence from actions WHERE source =1 AND datetime BETWEEN  datetime('{start}','-1 days') AND  datetime('{start}','0 days') ORDER BY datetime DESC LIMIT 30".format(start=start_day.strftime("%Y-%m-%d"))
#     #print (query)

#     conn=sqlite3.connect(database_name)
#     curs=conn.cursor()
#     curs= conn.execute(query)

#     eco = curs.fetchone()

#     date_col = 0
#     source_col = 1
#     state_col = 2
#     presence_col = 3

#     dt_light_start = None
#     dt_light_end = None

#     seconds_on = 0
    
#     if (eco == None):
#         return 0

#     date_start = datetime.strptime(eco[date_col], "%Y-%m-%d %H:%M:%S")

#     while eco != None:

#         dt = datetime.strptime(eco[date_col], "%Y-%m-%d %H:%M:%S")

#         # light is on and we are in manual mode
#         if(eco[source_col] == 1):
            
#             if (eco[state_col] == 1):

#                 if(eco[presence_col] == 0):
#                     if (dt_light_start == None):
#                         dt_light_start = dt
                
#                 else:
                    
#                     if (dt_light_start != None):
#                         dt_light_end = dt
#                         dt_diff = dt_light_start - dt_light_end 
#                         print(dt, dt_diff.seconds)
#                         seconds_on += dt_diff.seconds
#                         dt_light_start = None

#             else:
#                 if (dt_light_start != None):
#                         dt_light_end = dt
#                         dt_diff = dt_light_start - dt_light_end
#                         print(dt, dt_diff.seconds)
#                         seconds_on += dt_diff.seconds
#                         dt_light_start = None

#         else:
#             if (dt_light_start != None):
#                 dt_light_end = dt
#                 dt_diff = dt_light_start - dt_light_end
#                 print(dt, dt_diff.seconds)
#                 seconds_on += dt_diff.seconds
#                 dt_light_start = None

#         eco = curs.fetchone()

#     return seconds_on */
#

# logs actions to the database
def log_action(source, state, filename, presence): # TODO change!!

    global database_name
    conn=sqlite3.connect(database_name)

    curs=conn.cursor()

    curs.execute("""INSERT INTO actions values(datetime('now'), (?), (?), (?), (?))""", (source, state, filename, presence))

    # commit the changes
    conn.commit()

    conn.close()
#

#calculates how much elecrticity used in total
def log_cost(state, seconds): #TODO !! change to log data
    global database_name
    conn=sqlite3.connect(database_name)

    curs=conn.cursor()

    curs.execute("""INSERT INTO cost (datetime, state, seconds) values (datetime('now'), (?), (?))""", (state, seconds))

    # commit the changes
    conn.commit()

    conn.close()
#

#sets light according to status
# def set_light(status):
#     global light
#     if status == True:
#         io.output(pin_relay, 0)
#         print("ON")
        
#     else:
#         print("OFF")
#         io.output(pin_relay, 1)

#     light = status
#     return

#

#button stuff
# def toggle_light():
#     print("TOGGLE")
#     global light
#     global time_press

#     time_press2 = datetime.now()
#     time_diff = time_press2-time_press
    
#     #delay toggle light
#     if (time_diff.seconds > 1):
#         time_press=time_press2
#         light = not light
#         set_light(light)
    
#     return
#

# # callback when pin_button event detected
# def my_callback(channel): 
#     global presence
#     print(channel) 
#     log_action(1,not light, '', presence)
#     toggle_light()
# #

#main.html root page
@app.route("/")
def main():
    now = datetime.now()

    timeString = now.strftime("%Y-%m-%d %H:%M")
    templateData = {
        'title' : 'Menu',
        'time' : timeString
    }
    return render_template('main.html', **templateData)
#

#Watch me mode - shows what you "burn"
@app.route("/WatchMe")
def WatchMe():
    global watt_count
    global kwh_COST

    global mode_operation
    mode_operation = 1

    global database_name
    conn=sqlite3.connect(database_name)

    prev_day = request.args.get('key',0, type =int)

    print(prev_day)

    today = datetime.now()
    today = datetime(int(today.year), int(today.month), int(today.day), 0, 0, 0)
    start_day = today - timedelta(days=prev_day)

    conn=sqlite3.connect(database_name)

    query = "SELECT  * from actions WHERE datetime BETWEEN  datetime('{start}','-1 days') AND  datetime('{start}','0 days') ORDER BY datetime DESC LIMIT 30".format(start=start_day.strftime("%Y-%m-%d"))
    curs=conn.cursor()
    curs= conn.execute(query)
    actions = curs.fetchall()

    wasted_sec = calculate(prev_day)

    query2 = "SELECT  SUM(seconds) from cost WHERE datetime BETWEEN  datetime('{start}','-1 days') AND  datetime('{start}','0 days') ORDER BY datetime DESC LIMIT 30".format(start=start_day.strftime("%Y-%m-%d"))
    curs= conn.execute(query2)
    total_secs = curs.fetchone()

    timeString = start_day.strftime("%Y-%m-%d")

    k_watt = watt_count / 1000.0
    hours = wasted_sec / 3600.0

    kwh = k_watt * hours
    kwh_cost = kwh * kwh_COST

    #total_hours =  total_secs[0] / 3600.0
    total_cost = kwh_COST
    #-----------------
    prev_day = request.args.get('key',0, type =int)

    today = datetime.now()
    today = datetime(int(today.year), int(today.month), int(today.day), 0, 0, 0)
    start_day = today - timedelta(days=prev_day)
    end_day = today - timedelta(days=prev_day+1)

    print(prev_day, start_day, end_day)

    #conn=sqlite3.connect(database_name)

    query = "SELECT * FROM cost WHERE datetime BETWEEN  datetime('{start}','-1 days') AND  datetime('{start}','0 days') ORDER BY datetime DESC LIMIT 30".format(start=start_day.strftime("%Y-%m-%d"))
    print (query)

    curs= conn.execute(query)
    cost = curs.fetchone()

    date_col = 0
    state_col = 1
    seconds_col=2

    labels = [] 
    values = []

    for i in range(0,24):
        labels.append(i)
        values.append(0)
        
    while cost != None:
        dt = datetime.strptime(cost[date_col], "%Y-%m-%d %H:%M:%S")

        hour = dt.hour
        values[hour] = values[hour] + cost[seconds_col] / 60.0

        #labels.append(dt)
        #values.append(cost[seconds_col])
        cost = curs.fetchone()
    
    templateData = {
        'title' : 'Watch Me Mode',
        'time' : timeString,
        'actions': actions,
        'sec': wasted_sec,
        'kwhC': kwh_cost,
        'kwh': kwh,
        'total_secs': total_secs[0],
        'total_cost': total_cost,
        'values' : values,
        'labels' : labels,
        'key' : prev_day,       
        }

    return render_template('WatchMe.html', **templateData)
#

#turns on - IR
# @app.route("/SavetheBear")
# def IR():
#     global light
#     global database_name
#     global ir_wait

#     global mode_operation
#     mode_operation = 2

#     if (light==True):
#         state = "is"
#     else:
#         state = "isn't"

#     conn=sqlite3.connect(database_name)
#     curs=conn.cursor()
#     curs= conn.execute("SELECT * FROM actions ORDER BY datetime DESC LIMIT 5")
#     actions = curs.fetchall()

#     now = datetime.now()
#     timeString = now.strftime("%Y-%m-%d %H:%M:%S")

#     templateData = {
#             'title' : "Save the Bear Mode",
#             'time' : timeString,
#             'status': light,
#             'presence': actions,
#             'state': state,
#             'wait': ir_wait
#     }

#     print("Setting Mode=", mode_operation)
   
#     return render_template('IR.html', **templateData)
# #

#turns light on
# @app.route("/AlwaysAroundOn")
# def on():
#     global light
#     global mode_operation
#     global li_start
#     global li_end

#     mode_operation = 1

#     print(presence)

#     set_light(True)
#     log_action(1,True,'', presence)
    
#     if (light==True):
#         state = "on"
#     else:
#         state = "off"

#     #start counting
#     li_start= datetime.now() 
    
#     now = datetime.now()
#     timeString = now.strftime("%Y-%m-%d %H:%M:%S")

#     templateData = {
#             'title' : "Always Around ON",
#             'time' : timeString,
#             'status': state
#     }

#     return render_template('on.html', **templateData)
# #

#turns light off
# @app.route("/AlwaysAroundOff")
# def off():
#     global light
#     global mode_operation
#     global li_start
#     global li_end
    
#     mode_operation = 1

#     set_light(False)
#     log_action(1,False,'', presence)

#     #stop counting
#     li_end = datetime.now()  
#     li_diff = li_end - li_start
#     log_cost(1 , li_diff.seconds) 
    
#     if (light==True):
#         state = "on"
#     else:
#         state = "off"

#     now = datetime.now()
#     timeString = now.strftime("%Y-%m-%d %H:%M:%S")

#     templateData = {
#             'title' : "Always Around Off",
#             'time' : timeString,
#             'status': state
#     }
   
#     return render_template('off.html', **templateData)
#

#turns on - IR seurity - ProtectMyTerritory
# @app.route("/ProtectMyTerritory")
# def IRsecure():
#     global presence
    
#     global mode_operation
#     mode_operation = 3

#     now = datetime.now()
#     timeString = now.strftime("%Y-%m-%d %H:%M:%S")

#     if (presence==True):
#         state = "has"
#     else:
#         state = "hasn't"
  
#     templateData = {
#           'title' : "Protect My Territory Mode",
#           'time' : timeString,
#           'state': state
#     }
   
#     return render_template('IRsecure.html', **templateData)
#


#Photo Album - ProtectMyTerritory 2
# @app.route("/Album")
# def album2():
#     global photo_counter 
#     global database_name
#     global mode_operation

#     mode_operation =0

#     now = datetime.now()
#     timeString = now.strftime("%Y-%m-%d %H:%M:%S")

#     conn=sqlite3.connect(database_name)
#     curs= conn.execute("SELECT * FROM actions WHERE source = 3 ORDER BY datetime DESC LIMIT 7")

#     photos = curs.fetchall() 

#     templateData = {
#             'title' : "Album",
#             'time' : timeString,
#             'photos' : photos,
#             'space' : "      ",
#     }
#     conn.close()


#     return render_template('album.html', **templateData)

# #Photo Album - ProtectMyTerritory 2
# @app.route("/Album2")
# def album():
#     global photo_counter 
#     global database_name
#     global mode_operation

#     mode_operation = 0

#     now = datetime.now()
#     timeString = now.strftime("%Y-%m-%d %H:%M:%S")

#     conn=sqlite3.connect(database_name)
#     curs= conn.execute("SELECT * FROM actions WHERE source = 3 ORDER BY datetime DESC LIMIT 35")

#     photos = curs.fetchall() 

#     templateData = {
#             'title' : "Album 2",
#             'time' : timeString,
#             'photos' : photos,
#             'space' : "      ",
#     }
#     conn.close()


#     return render_template('album2.html', **templateData)

class MyThread(Thread):
    def __init__(self, event):
        Thread.__init__(self)
        self.stopped = event

    def run(self):
        global t
        t =0
        global mode_operation
        global light
        global ir_wait
        global cam_wait
        global photo_dir
        global presence
        global li_start
        global li_end
        global seconds
        

        stateR = False

        time_ir_detect =  datetime.now()
               
        while not self.stopped.wait(2):
            #set_light(light)

            time_ir_detect2 = datetime.now()
            
            time_ir_diff = time_ir_detect2 - time_ir_detect

            if(time_ir_detect.hour != time_ir_detect2.hour):
                li_end= datetime.now() 
                li_diff = li_end-li_start
                log_cost(2,li_diff.seconds)

            #timeString = time_ir_detect2.strftime("%Y-%m-%d %H:%M")

            now = datetime.now()
            
            timeString = now.strftime("%Y-%m-%d %H:%M:%S")
            print(current_thread().name, mode_operation , timeString)

            if mode_operation == 2:

                if io.input(pin_ir):
                    time_ir_detect = time_ir_detect2
                    presence = True
                    
                    if light == False:
                        print("ON " + "datetime:" + timeString)
                        #presence = True
                        set_light (True)
                        log_action(2,True,'', presence)

                        #start counting
                        li_start= datetime.now() 
                    
                else:
                    presence = False
                    
                    if (time_ir_diff.seconds < ir_wait): 
                        continue

                    if light == True:
                        print("OFF " + "datetime:" + timeString )
                        #presence = False
                        set_light(False)
                        log_action(2,False,'', presence)

                        #stop counting
                        li_end= datetime.now() 
                        li_diff = li_end-li_start
                        log_cost(2,li_diff.seconds)

            if mode_operation == 3:
                
                if io.input(pin_ir):
                    presence = True

                    if (time_ir_diff.seconds < cam_wait): 
                        continue
                    cam = cv2.VideoCapture(0)
                    print("intrudor " + "datetime:" + timeString)
                    img = get_image(cam)
                    print("took photo")
                    photo = "pic_"+timeString+".png"
                    cv2.imwrite(photo_dir + photo, img)
                    time.sleep(5)
                    log_action(3,True,photo,presence)
                    time_ir_detect = time_ir_detect2
                    del(cam)
#



#set gpio mode
io.setmode(io.BCM)
io.setup(pin_relay, io.OUT)


#setup pin_button 
# connected to GND
io.setup(pin_button, io.IN, pull_up_down=io.PUD_UP)
#3.3V
#io.setup(pin_button, io.IN, pull_up_down=io.PUD_DOWN)

# The GPIO.add_event_detect() line below set things up so that  
# when a rising edge is detected on pin_button, regardless of whatever   
# else is happening in the program, the function "my_callback" will be run 

#GND  
io.add_event_detect(pin_button, io.FALLING, callback=my_callback) 
#3.3V
#io.add_event_detect(pin_button, io.RISING, callback=my_callback)

io.setup(pin_ir, io.IN)

set_light(False)


#main entry point of Flask
if __name__ == "__main__":
    print ("Inside Main")
    stopFlag = Event()
    thread = MyThread(stopFlag)
    thread.start()

    try:
        app.run(host='0.0.0.0', port=80, debug=True, use_reloader=False)
    except KeyboardInterrupt:  
            io.cleanup()  # clean up GPIO on CTRL+C exit 

    io.cleanup() # clean up GPIO on normal exit  

    # this will stop the timer
    stopFlag.set()
    del(cam)
    set_light(False)


        



