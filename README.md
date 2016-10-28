# hostagent

Show CPU/mem/disk/network detailed and summary on linux machine. And (optional) post host heartbeat message to rain service REST endpoint at 1 minute interval.


# Command-line
``` js
git clone https://github.com/xinkaiwang/heartbeat.git
cd heartbeat
cp config.default.js config.js
vi config.js
./index.js
```

# what's in hostagent heartbeat message?
* cpu usage
* mem usage
* disk usage
* network usage
* host name/os type/os version/uptime
```
{
  "event": "hostAgent",
  "host": "ubuntu-2gb-sfo1-01",
  "arch": "x64",
  "os": "Linux",
  "osRelease": "3.13.0-79-generic",
  "totalMemoryMB": 2002,
  "uptimeMinutes": 4012,
  "memTotalMB": 2002,
  "memPercent": 63,
  "memMB": 1261,
  "cpu": 7,
  "cpuDetail": "3,9,13,4,4,9",
  "cpuCount": 2,
  "rxKByte": 25,
  "txKByte": 25,
  "rxPacket": 134,
  "txPacket": 137,
  "diskPercent": 29,
  "hbIntervalSeconds": 60,
  "time": 1477586390050
}
```

# TODO list
* better README :)
* detailed process list (cpu usage)
* buffer/retry when rain service temp outage