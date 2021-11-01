import pandas as pd
import json

df = pd.read_csv("./data.csv")

moldt = round(df["mold_temp"].mean(),2)
meltt = round(df["melt_temp"].mean(),2)
injs = round(df["injection_speed"].mean(),2)
holdp = round(df["hold_pressure"].mean(),2)
injt = round(df["injection_time"].mean(),2)
holdt = round(df["hold_time"].mean(),2)
fillt = round(df["filling_time"].mean(),2)
cyt = round(df["cycle_time"].mean(),2)
mean = [moldt, meltt, injs, holdp, injt, holdt, fillt, cyt]

dfli = {}
for i in df.loc[:, "mold_temp":"cycle_time"]:
    dfli[i] = 0

for e,i in enumerate(dfli):
    for j in range(len(df)):
        dfli[i] += ((df[i][j]-mean[e])**2)/499
    dfli[i] = [round(mean[e]-3*(dfli[i] ** (0.5)),2), mean[e], round(mean[e]+3*(dfli[i] ** (0.5)),2)]

print(json.dumps(dfli))