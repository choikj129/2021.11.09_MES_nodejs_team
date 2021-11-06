import pandas as pd
import json
import pymysql as mysql
import datetime as dt
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.font_manager as fm
from matplotlib import rc

with open("db.json","r") as f:
    data = json.load(f)

db = mysql.connect(
    host=data["host"],
    passwd=data["password"],
    user=data["user"],
    port=data["port"],
    db=data["database"]
)

cursor = db.cursor(mysql.cursors.DictCursor)
t = dt.datetime.now().strftime("%Y%m%d")
sql = "select * from monitoring"+t
cursor.execute(sql)
df = pd.DataFrame(cursor.fetchall())

mold_m = df["mold_temp"].mean()
melt_m = df["melt_temp"].mean()
hold_m = df["hold_pressure"].mean()
inj_m = df["injection_speed"].mean()
mold_s, melt_s, hold_s, inj_s = 0, 0, 0, 0

for i in range(len(df)):
    mold_s += ((df["mold_temp"][i]-mold_m)**2)/len(df)
    melt_s += ((df["melt_temp"][i]-melt_m)**2)/len(df)
    hold_s += ((df["hold_pressure"][i]-hold_m)**2)/len(df)
    inj_s += ((df["injection_speed"][i]-inj_m)**2)/len(df)
mold_s **= 0.5
melt_s **= 0.5
hold_s **= 0.5
inj_s **= 0.5

mold_set = np.array(sorted(list(df["mold_temp"])))
melt_set = np.array(sorted(list(df["melt_temp"])))
hold_set = np.array(sorted(list(df["hold_pressure"])))
inj_set = np.array(sorted(list(df["injection_speed"])))

mold_y = (1/np.sqrt(2*np.pi*mold_s**2)) * np.exp(-(mold_set-mold_m)**2/(2*mold_s**2))
melt_y = (1/np.sqrt(2*np.pi*melt_s**2)) * np.exp(-(melt_set-melt_m)**2/(2*melt_s**2))
hold_y = (1/np.sqrt(2*np.pi*hold_s**2)) * np.exp(-(hold_set-hold_m)**2/(2*hold_s**2))
inj_y = (1/np.sqrt(2*np.pi*inj_s**2)) * np.exp(-(inj_set-inj_m)**2/(2*inj_s**2))
mold_y0 = np.random.normal(mold_m, mold_s, 300)
melt_y0 = np.random.normal(melt_m, melt_s, 300)
hold_y0 = np.random.normal(hold_m, hold_s, 300)
inj_y0 = np.random.normal(inj_m, inj_s, 300)

font=fm.FontProperties(fname='C:/Windows/Fonts/H2GTRE.TTF').get_name()
rc('font',family=font)
fig, ax = plt.subplots(2,2, figsize = (20,20))

ax[0,0].tick_params(axis="x",colors="white", labelsize=20)
ax[0,0].spines['bottom'].set_color('white')
ax[0,0].set_facecolor("black")
ax[0,0].plot(melt_set,melt_y, color="white")
ax[0,0].hist(melt_y0, density=True, bins=30, color="mediumaquamarine")
ax[0,0].set_title("용융 온도", fontdict={'fontsize': 30, 'fontweight': 'bold'}, color="white")

ax[0,1].tick_params(axis="x",colors="white", labelsize=20)
ax[0,1].spines['bottom'].set_color('white')
ax[0,1].set_facecolor("black")
ax[0,1].plot(mold_set,mold_y, color="white")
ax[0,1].hist(mold_y0, density=True, bins=30, color="mediumaquamarine")
ax[0,1].set_title("금형 온도", fontdict={'fontsize': 30, 'fontweight': 'bold'}, color="white")

ax[1,0].tick_params(axis="x",colors="white", labelsize=20)
ax[1,0].spines['bottom'].set_color('white')
ax[1,0].set_facecolor("black")
ax[1,0].plot(inj_set,inj_y, color="white")
ax[1,0].hist(inj_y0, density=True, bins=30, color="mediumaquamarine")
ax[1,0].set_title("사출 속도", fontdict={'fontsize': 30, 'fontweight': 'bold'}, color="white")

ax[1,1].tick_params(axis="x",colors="white", labelsize=20)
ax[1,1].spines['bottom'].set_color('white')
ax[1,1].set_facecolor("black")
ax[1,1].plot(hold_set,hold_y, color="white")
ax[1,1].hist(hold_y0, density=True, bins=30, color="mediumaquamarine")
ax[1,1].set_title("보압", fontdict={'fontsize': 30, 'fontweight': 'bold'}, color="white")

plt.savefig("./public/img/chart/"+t+".png", facecolor="black")

mold = round(df[df["defect"]=="Y"]["mold_temp"].mean(),2)
melt = round(df[df["defect"]=="Y"]["melt_temp"].mean(),2)
hold = round(df[df["defect"]=="Y"]["hold_pressure"].mean(),2)
inj = round(df[df["defect"]=="Y"]["injection_speed"].mean(),2)
mold_s = round(mold_s,2)
melt_s = round(melt_s,2)
hold_s = round(hold_s,2)
inj_s = round(inj_s,2)

t = dt.datetime.now().strftime("%Y-%m-%d")
sql = "select setup_id from setup where date(date)=%s"
cursor = db.cursor(mysql.cursors.DictCursor)
cursor.execute(sql,(t))
id = cursor.fetchall()[0]["setup_id"]

sql = '''insert into 
optimum(setup_id, mold_m, melt_m, hold_m, injection_m, mold_s, melt_s, hold_s, injection_s, date) 
values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
'''
cursor = db.cursor()
cursor.execute(sql, (id, mold, melt, hold, inj, mold_s, melt_s, hold_s, inj_s, t))

sql = "update setup set quantity=%s where setup_id=%s"
cursor.execute(sql, (len(df),id))

db.commit()
db.close()