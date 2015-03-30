#!/bin/bash
find *txt -type f -exec sed -i "/^tsi\ /d;" {} \;
