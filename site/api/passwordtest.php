<?php

require '/web/pinballpyramid/vendor/autoload.php';

$crypt = new PasswordLib\PasswordLib;

D::ump( $crypt->verifyPasswordHash('gen9tutu', '$2y$10$FNcobdxpEvEt/AA.JwWf1OswYeAxLIrkstHrd2XZnosB6xxA8oRxa') );

?>