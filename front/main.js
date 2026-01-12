let container = document.querySelector('.container');
let inputPlace = document.querySelector('input[name="text"]');
let saveBtn = document.querySelector('button');

saveBtn.addEventListener('click', addTask);

function addTask(e) {
	let text = inputPlace.value;
	let data = { patka: text }; // jer JSON format mora da ima key:value
	// new FormData() - ovo trenutno necemo raditi(simuliranje da je to forma)
	fetch('http://localhost:8888/index.php', { // Danilo je ovde imao http://localhost:8888/backtofront/back/index.php
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then(res => res.json())
		.then(displayTasks)
		// .then(data => {     ovako stavimo umesto ovoga iznad .then(dispayTasks) kada debugujemo
		// 	console.log('Success', data)
		// })
		.catch(err => console.error('Error adding task: ', err)
	);
}

fetch('http://localhost:8888/index.php')  // Danilo je ovde imao http://localhost:8888/backtofront/back/index.php
	.then(res => res.json())
	.then(data => {
		displayTasks(data);
	})
	.catch(err => console.error('Error fetching data: ', err)
);


function displayTasks(tasks) {
		let html = '';
		tasks.forEach(task => {
			html += `
			<div class="task" data-id="${task.id}">
				<h3>${task.text}</h3>
			</div>
			`;
		});
		container.innerHTML = html;
		let allTasks = document.querySelectorAll('.task');
		allTasks.forEach((task, index) => {
			task.addEventListener('click', deleteTask);
			allTasks[index].addEventListener('dblclick', editTask) // cuvamo referencu na svaki task u this
		});
}

function editTask(e) {
	let h3 = this.querySelector('h3');
	h3.setAttribute('contentEditable', 'true');
	h3.focus();
	h3.addEventListener('blur', saveEdit); // kada se izgubi fokus, poziva se funkcija
}

function saveEdit(e) {
	let newText = this.innerText;
	let id = this.parentElement.getAttribute('data-id');
	let data = { patka: newText };
	fetch(`http://localhost:8888/index.php?id=${id}`, { // Ovakva je praksa za PUT. Danilo je ovde imao http://localhost:8888/backtofront/back/index.php
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then(res => res.json())
		.then(displayTasks)
		.catch(err => console.error('Error editing task: ', err)
		);
	}

function deleteTask(e) {
	if(!e.altKey) return; // ako nije pritisnut alt, ne radi nista
	let id = this.getAttribute('data-id');
	fetch(`http://localhost:8888/index.php?id=${id}`, { // Ovakva je praksa za DELETE. Danilo je ovde imao http://localhost:8888/backtofront/back/index.php
		method: 'DELETE'
	})
		.then(res => res.json())
		.then(displayTasks)
		.catch(err => console.error('Error deleting task: ', err)
	);
}
