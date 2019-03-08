# THIS IS CONFIG FOR docker-compose.yml

import os
import sys


sys.path.append('/usr/src/app/webblog/')
reload = True
workers = 2
address = os.environ.get('BIND_ADDRESS', '0.0.0.0')
port = os.environ.get('BIND_PORT', '80')
bind = "%s:%s" % (address, port)
