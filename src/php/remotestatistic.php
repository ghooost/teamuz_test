<?php 
switch($_REQUEST['mode']){
  case 'get':
    $fname=md5($_REQUEST['quest']).'.php';
    if(file_exists($fname)){
      require $fname;

    }
  break;
  case "set":
  break;
  case "md":
    echo md5($_REQUEST['quest']);
  break;
}
?>
