<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<!--<xsl:output method="xml" version="1.0" encoding="utf-8"
		type="text/xhtml"/>-->
	<!--<xsl:output method="html" encoding="utf-8" 
		omit-xml-declaration="no"/>-->
	<!--doctype-system="about:legacy-compat"/>-->
<xsl:template match="/page">
	<html xmlns="http://www.w3.org/1999/xhtml" lang="en" dir="ltr">
<head>	
	<title>SPEL</title>
	<script defer="defer" type="text/javascript" src="spel.js" />
	<script defer="defer" type="text/javascript"> 
	document.getElementById("main").innerHTML = hello();
	</script>
</head>
<body>
	<div id="info">
		<xsl:value-of select="info" />
	</div>
	<hr/>
	<div id="main">
		<xsl:value-of select="main" />
	</div>
	<hr/>
	<div id="talk">
		<xsl:value-of select="talk" />
	</div>
	<hr/>
	<div id="say">
		<xsl:value-of select="say" />
	</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
