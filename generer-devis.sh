#!/bin/bash
cd ~/wagnon-devis
node index.js
xdg-open pdf/devis.pdf >/dev/null 2>&1 &
