<?php
header("Content-Type: text/json");
?>

[
   {
      "id":"O1",
	  "text":"Ordner 1",
      "leaf":false,
	  "children":[
		{
			"value":"E1_1",
			"text":"Element 1.1",
			"leaf":true,
			"checked":false
		},
		{
			"value":"E1_2",
			"text":"Element 1.2",
			"leaf":true,
			"checked":false
		}
	  ]
   },
   {
	  "value":"E2",
      "text":"Element 2",
      "leaf":true,
	  "checked":false
   }
]