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
		.then(dispayTasks)
		// .then(data => {     ovako stavimo umesto ovoga iznad .then(dispayTasks) kada debugujemo
		// 	console.log('Success', data)
		// })
		.catch(err => console.error('Error fetching data: ', err)
	);
}

fetch('http://localhost:8888/index.php')  // Danilo je ovde imao http://localhost:8888/backtofront/back/index.php
	.then(res => res.json())
	.then(data => {
		dispayTasks(data);
	})
	.catch(err => console.error('Error fetching data: ', err)
);




function dispayTasks(data) {
		let html = '';
		data.forEach(task => {
			html += `
			<div class="task">
				<h3>${task.text}</h3>
				
			</div>
			`;
		});
		container.innerHTML = html;
}
