<?php
require_once 'config.php';


// Destroy all session data
session_unset();
session_destroy();

// Redirect to homepage
header('Location: ' . BASE_URL . 'index.html');
exit();
?>
