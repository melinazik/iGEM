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

database_name = "/home/pi/bear/bear.db" ##TODO !! change


# logs actions to the database
def log_action(source, state, filename, presence): # TODO change to log data !!

    global database_name
    conn=sqlite3.connect(database_name)

    curs=conn.cursor()

    curs.execute("""INSERT INTO actions values(datetime('now'), (?), (?), (?), (?))""", (source, state, filename, presence))

    # commit the changes
    conn.commit()

    conn.close()
#

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
@app.route("/calc_page")
def calc():
    
    now = datetime.now()
    timeString = now.strftime("%Y-%m-%d %H:%M")

    global database_name 
    conn=sqlite3.connect(database_name)

    query = "SELECT  * from actions WHERE datetime BETWEEN  datetime('{start}','-1 days') AND  datetime('{start}','0 days') ORDER BY datetime DESC LIMIT 30".format(start=start_day.strftime("%Y-%m-%d"))
    
    curs=conn.cursor()
    curs= conn.execute(query)
    actions = curs.fetchall()
    #-----------------
    #     
    templateData = {
        'title' : 'calc page',
        'time' : timeString,
        'actions': actions,       
        }

    return render_template('calc_page.html', **templateData)
#

#main entry point of Flask
if __name__ == "__main__":
    print ("Inside Main")
    stopFlag = Event()

    try:
        app.run(host='0.0.0.0', port=80, debug=True, use_reloader=False)
    except KeyboardInterrupt:  
            print("keyboard stop")

     

   


        



