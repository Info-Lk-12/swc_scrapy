const CUSTOM_SERVICE_CONFIG_TEMPLATE = `[Unit]
Description=Custom Service
Wants=network-online.target
After=syslog.target network.target network-online.target

[Service]
Type=simple
User=root
ExecStartPre=/bin/sleep 2
WorkingDirectory=/root
ExecStart=/bin/echo "Hello World"
KillMode=process

# Give a reasonable amount of time for the server to start up/shut down
TimeoutSec=60

[Install]
WantedBy=multi-user.target`


export {CUSTOM_SERVICE_CONFIG_TEMPLATE}