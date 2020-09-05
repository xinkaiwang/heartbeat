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
  "arch": "x64",
  "totalMemoryMB": 2002,
  "uptimeMinutes": 4620,
  "memTotalMB": 2002,
  "memPercent": 62,
  "memMB": 1242,
  "cpu": 7,
  "cpuDetail": "6,3,13,5,2,13",
  "cpuCount": 2,
  "os": "Ubuntu 14.04.4 LTS",
  "rxKByte": 24,
  "txKByte": 24,
  "rxPacket": 111,
  "txPacket": 112,
  "diskUsedMB": 10860,
  "diskPercent": 29,
  "hbIntervalSeconds": 60,
  "host": "ubuntu-2gb-sfo1-01",
  "time": 1477622882321
}
```

## build with docker
```
export HEARTBEAT_VERSION=0.2.9
docker build --tag heartbeat:${HEARTBEAT_VERSION} .
docker tag heartbeat:${HEARTBEAT_VERSION} xinkaiw/heartbeat:${HEARTBEAT_VERSION}
docker push xinkaiw/heartbeat:${HEARTBEAT_VERSION}
```

## build with gcp build API
```
gcloud builds submit --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/heartbeat .
gcloud builds submit --tag gcr.io/poseidon-xwang/heartbeat .
```

## run with docker
```
docker run --detach --name heartbeat heartbeat:0.2.5
docker kill heartbeat
docker rm heartbeat
```

# TODO list
* better README :)
* detailed process list (cpu usage)
* buffer/retry when rain service temp outage