<?php
header("Content-Type: text/json");

$out=array();
$out["DS"]=array();

for ($i=0;$i<5;$i++) {
	$out["DS"][]=array(
		"ID"=>$i,
		"Val1"=>"TEST".($i*5),
		"Val2"=>""
	);
}	


$out["success"]	= true;
$out["total"]=$i;

echo json_encode($out);
?>