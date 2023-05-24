<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="<?php echo base_url(); ?>assets/img/oro_rescue_icon.ico" />
    <!-- CSS -->
    <?php 
    foreach ($css as $value) { ?>
        <link href="<?php echo $value; ?>" rel="stylesheet">
    <?php } ?>
    <title>CDO 911 :: <?php echo $title; ?></title>
  </head>
  <body>
