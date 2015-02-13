#!/bin/bash
find *txt -type f -exec sed -i "s/^put\ /fut\ /g;" {} \;
