#!/bin/bash
echo '<?xml version="1.0" encoding="UTF-8"?>' > spel.xhtml
echo '<!DOCTYPE html>' >> spel.xhtml
xsltproc spel.xml >> spel.xhtml

