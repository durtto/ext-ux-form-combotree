<?php
header("Content-Type: text/json");

$out=array();
$out["DS"]=array();

for ($i=0;$i<5;$i++) {
	$out["DS"][]=array(
		"ID"=>$i,
		"Val1"=>"TEST".($i*5),
		"Val2"=>"",
		"Val3"=>""
	);
}	

$out["DS"][0]["Val2"]="E2, E3_2";
$out["DS"][3]["Val2"]="E3_1,E3_8_1, E1_1";

$out["DS"][1]["Val3"]="E2";
$out["DS"][4]["Val3"]="E3_1, E3_3";

$out["success"]	= true;
$out["total"]=$i;

echo json_encode($out);
?>