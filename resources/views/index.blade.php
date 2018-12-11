<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Site</title>

        <link href="/main.css" rel="stylesheet" type="text/css">
    </head>
    <body>
        <div id="app"></div>

        <script src="/main.js"></script>
    </body>
</html>
