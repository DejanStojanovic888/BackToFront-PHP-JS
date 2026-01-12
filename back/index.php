<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { // za preflight request-ove. Prvo ide ovaj request da server testira da li moze da primi pravi request
    exit;   // to je request pre POST requesta(koji je automatski namesten)
}


$pdo = new PDO('mysql:host=localhost;dbname=backtofront;', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

if($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    $id = $_GET['id'];
    $text = $data->patka;

    $statement = $pdo->prepare("UPDATE tasks SET text = ? WHERE id = ?");
    $statement->execute([$text, $id]);

    $statement = $pdo->prepare("SELECT * FROM tasks");
    $statement->execute();
    $tasks = $statement->fetchAll();
    
    echo json_encode($tasks);
    exit;
}

if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    $statement = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $statement->execute([$id]);

    $statement = $pdo->prepare("SELECT * FROM tasks");
    $statement->execute();
    $tasks = $statement->fetchAll();

    echo json_encode($tasks);
    exit;
}

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    // echo json_encode(['message' => 'POST request primljen']); ovako hvatamo bugove kad nam ne radi POST(mora u JSON formatu jer ga tako ocekuje frontend)
    // die(); 

    $json = file_get_contents('php://input'); // sve sto je stiglo sa requestom(bice u stilu JSON-a jer smo zadali taj tip u frontendu)
    $data = json_decode($json); // dekodujemo JSON u objekat std klase
    $text = $data->patka;
    // $data = json_decode($json, true); // true - (assoc array) ili false(ili ako nema nista) - (object std klase) 
    // $text = $data['patka']; //$text = $data->text; (kada je obj std klase)

    $statement = $pdo->prepare("INSERT INTO tasks (text) VALUES (?)");
    $statement->execute([$data->patka]);

    $statement = $pdo->prepare("SELECT * FROM tasks");
    $statement->execute();
    $tasks = $statement->fetchAll();

    echo json_encode($tasks);
    exit;
}

$statement = $pdo->prepare("SELECT * FROM tasks");
$statement->execute();
$tasks = $statement->fetchAll();

// echo "Dejan";
// echo json_encode("Dejan");
echo json_encode($tasks);