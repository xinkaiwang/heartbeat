# hostagent

Show CPU/mem/disk/network detailed and summary on linux machine. And (optional) post those heartbeat message to rain service REST endpoint at 1 minute interval.


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

# TODO list
* better README :)
* detailed process list (cpu usage)
* buffer/retry when rain service temp outage