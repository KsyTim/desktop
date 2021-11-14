// есть ПЕРИОДИЧЕСКИЙ БАГ: когда перемещаем файл из папки в переполненную папку (внутри уже находятся максимум разрешенные 3 файла), то выкидывает файл на Рабочий стол, вместо того, чтобы вернуться на место, откуда перемещался => для этого (как вариант) в this.folder нужно записывать значение folder, но где получить именно значение dropZone пока неизвестно...

jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ) {
        this.addEventListener('touchstart', handle, { passive: !ns.includes('noPreventDefault') });
    }
};
jQuery.event.special.touchmove = {
    setup: function( _, ns, handle ) {
        this.addEventListener('touchmove', handle, { passive: !ns.includes('noPreventDefault') });
    }
};

   $(document).bind('mobileinit',function(){
       $.mobile.changePage.defaults.changeHash = false;
       $.mobile.hashListeningEnabled = false;
       $.mobile.pushStateEnabled = false;
   });

// jQuery.event.special.touchstart = {
//     setup: function( _, ns, handle ) {
//         this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
//     }
// };
// jQuery.event.special.touchmove = {
//     setup: function( _, ns, handle ) {
//         this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
//     }
// };
// jQuery.event.special.wheel = {
//     setup: function( _, ns, handle ){
//         this.addEventListener("wheel", handle, { passive: true });
//     }
// };
// jQuery.event.special.mousewheel = {
//     setup: function( _, ns, handle ){
//         this.addEventListener("mousewheel", handle, { passive: true });
//     }
// };


$(function () {
	var folderSort, openFolder, folderEnd, fromLocalStorage, dropPlace, mainDrop, droppableBody, fileToPageExtra, folder, file, fileExtra;
	const mainFunc = () => {
		// let folder;
		// $('.folder').draggable({
		// 	start: function () {
		// 		folder = $(this).find('p').prop('innerHTML');
		// 	}
		// });
		$('body').append(`
			<div class="drop"></div>
		`);
		let fileToPage = [];
		const fileRow = $('.file-row');
		const fileOnPage = $('.file');
		var droppableFolder;
		fromLocalStorage = () => {
			if (localStorage.getItem('value')) {
				fileToPage = JSON.parse(localStorage.getItem('value'));
				$.each(fileToPage, function (index, value) {
					const addFolder = (selector, amount) => {
						$(selector).append(`
							<div class="file-to_folder file-to_folder${amount}">
								<img src="img/pdf.png" alt="File" class="folder_img">
							</div>
						`);
					},
						addFoldersMain = (selector) => {
							if ($(selector).prop('childElementCount') === 2) {
								addFolder(selector, '_1st');
							} else if ($(selector).prop('childElementCount') === 3) {
								addFolder(selector, '_2nd');
							} else if ($(selector).prop('childElementCount') === 4) {
								addFolder(selector, '_3rd');
							}
						};
					if (value.folder === `Папка 1`) {
						addFoldersMain('#first');
					} else if (value.folder === `Папка 2`) {
						addFoldersMain('#second');
					} else if (value.folder === `Папка 3`) {
						addFoldersMain('#third');
					} else if (value.folder === `Папка 4`) {
						addFoldersMain('#fourth');
					} else if (value.folder === 'Рабочий стол') {
						fileRow.append(`
							<div class="file from-storage">
								<img src="img/pdf.png" alt="">
								<p>${this.file}</p>
							</div>
						`);
						$('.from-storage').draggable({
							start: function () {
								file = $(this).find('p').prop('innerHTML');
								fileToPage = JSON.parse(localStorage.getItem('value'));
								folder = 'Рабочий стол';
								dropPlace = 'Рабочий стол';
								$.each(fileToPage, function (index, value) {
									if (file === value.file) {
										fileToPage = JSON.parse(localStorage.getItem('value'));
										fileToPage.splice(index, 1);
										localStorage.clear();
										$.each(fileToPage, function (index, value) {
											let storage = JSON.parse(localStorage.getItem('value')) || [];
											storage.push(value);
											localStorage.setItem('value', JSON.stringify(storage));
										});
									}
								});
								if (dropPlace.substring(0, 5) === 'Папка'){
									mainDrop = dropPlace;
								} else if (dropPlace === 'Рабочий стол') {
									mainDrop = 'Рабочий стол';
								}
							}
						});
					}

					// неправильно, но суть та же, только удалять в другой момент
					// if (value.file === 'Файл 1') {
					// 	$('.file')[0].remove();
					// } else if (value.file === 'Файл 2') {
					// 	$('.file')[1].remove();
					// } else if (value.file === 'Файл 3') {
					// 	$('.file')[2].remove();
					// } else if (value.file === 'Файл 4') {
					// 	$('.file')[3].remove();
					// } else if (value.file === 'Файл 5') {
					// 	$('.file')[4].remove();
					// } else if (value.file === 'Файл 6') {
					// 	$('.file')[5].remove();
					// } else if (value.file === 'Файл 7') {
					// 	$('.file')[6].remove();
					// } else if (value.file === 'Файл 8') {
					// 	$('.file')[7].remove();
					// }
				});
			}
		};
		$('.file').draggable({
			start: function () {
				file = $(this).find('p').prop('innerHTML');
				fileToPage = JSON.parse(localStorage.getItem('value'));
				folder = 'Рабочий стол';
				dropPlace = 'Рабочий стол';
				$.each(fileToPage, function (index, value) {
					if (file === value.file) {
						fileToPage = JSON.parse(localStorage.getItem('value'));
						fileToPage.splice(index, 1);
						localStorage.clear();
						$.each(fileToPage, function (index, value) {
							let storage = JSON.parse(localStorage.getItem('value')) || [];
							storage.push(value);
							localStorage.setItem('value', JSON.stringify(storage));
							fileToPage = JSON.parse(localStorage.getItem('value')) || [];
							let desktopFolder = [];
							$.each(fileToPage, function (index, value) { 
								if (value.folder === 'Рабочий стол') {
									desktopFolder.push(this.file);
								}
							});
							$('.folder .file-to_folder').remove();	
							$.each(desktopFolder, function (index, value) { 
								$(`.file:contains("${value}")`).remove();
							});								
							fromLocalStorage();
						});
					}
				});
				if (dropPlace.substring(0, 5) === 'Папка'){
					mainDrop = dropPlace;
				} else if (dropPlace === 'Рабочий стол') {
					mainDrop = 'Рабочий стол';
				}
			}
		});
		if (localStorage.getItem('value')) {
			fileToPage = JSON.parse(localStorage.getItem('value'));
			$.each(fileToPage, function (index, value) {
				switch (value.file) {
					case 'Файл 1':
						fileOnPage[0].remove();
						break;
					case 'Файл 2':
						fileOnPage[1].remove();
						break;
					case 'Файл 3':
						fileOnPage[2].remove();
						break;
					case 'Файл 4':
						fileOnPage[3].remove();
						break;
					case 'Файл 5':
						fileOnPage[4].remove();
						break;
					case 'Файл 6':
						fileOnPage[5].remove();
						break;
					case 'Файл 7':
						fileOnPage[6].remove();
						break;
					case 'Файл 8':
						fileOnPage[7].remove();
						break;
				}
			});
		}
		fileToPage = JSON.parse(localStorage.getItem('value')) || [];
		let desktopFolder = [];
		$.each(fileToPage, function (index, value) { 
			if (value.folder === 'Рабочий стол') {
				desktopFolder.push(this.file);
			}
		});
		$('.folder .file-to_folder').remove();	
		$.each(desktopFolder, function (index, value) { 
			$(`.file:contains("${value}")`).remove();
		});								
		fromLocalStorage();
		$('.folder').droppable({
			drop: function () {	
				folderExtra = $(this).find('p').prop('innerHTML');
				const moveFile = () => {
					$('.file.ui-draggable-dragging').remove();
					$('.modal-overlay').css({
						visibility: 'visible',
    				opacity: '1'
					});
					$('.modal').css({
						visibility: 'visible',
						opacity: '1'
					});
					$('.modal').html('Файл успешно перемещен');
					setTimeout(function () {
						$('.modal-overlay').css({
							visibility: 'hidden',
							opacity: '0'
						});
						$('.modal').css({
							visibility: 'hidden',
							opacity: '0'
						});
					}, 1000);
				},
					// moveFolder = () => {
					// 	$('.folder.ui-draggable-dragging').remove();
					// 	$('.modal-container').css({
					// 		display: 'block',
					// 	});
					// 	$('.modal').html('Папка успешно перемещена');
					// 	setTimeout(function (){
					// 		$('.modal-container').css({
					// 			display: 'none',
					// 		});
					// 	}, 1000);
					// },
					fileData = {
						folder: `${$(this).prop('innerText')}`,
						file: file
					},
					// folderData = {
					// 	folder: `${$(this).prop('innerText')}`,
					// 	file: folder
					// },
					fileToStorage = () => {
						let storage = JSON.parse(localStorage.getItem('value')) || [];
						storage.push(fileData);
						localStorage.setItem('value', JSON.stringify(storage));
					}
					// , 
					// folderToStorage = () => {
					// 	let storage = JSON.parse(localStorage.getItem('value')) || [];
					// 	storage.push(folderData);
					// 	localStorage.setItem('value', JSON.stringify(storage));
					// }
					,
					addToPage = () => {
						if ($(this).closest('.folder').prop('children').length === 3) {
							$(this).append(`
								<div class="file-to_folder file-to_folder_2nd">
									<img src="img/pdf.png" alt="File" class="folder_img">
								</div>
							`);
							moveFile();
							fileToStorage();
						} else if ($(this).closest('.folder').prop('children').length === 4) {
							$(this).append(`
								<div class="file-to_folder file-to_folder_3rd">
									<img src="img/pdf.png" alt="File" class="folder_img">
								</div>
							`);
							moveFile();
							fileToStorage();
						} else if ($(this).closest('.folder').prop('children').length >= 5) {						
							$('.modal-overlay').css({
								visibility: 'visible',
								opacity: '1'
							});
							$('.modal').css({
								visibility: 'visible',
								opacity: '1'
							});
							$('.modal').html('В папку не может быть перемещено более трёх файлов');
							setTimeout(function () {
								$('.modal-overlay').css({
									visibility: 'hidden',
									opacity: '0'
								});
								$('.modal').css({
									visibility: 'hidden',
									opacity: '0'
								});
							}, 1000);
						} else if ($(this).closest('.folder').prop('children').length === 2) {
							$(this).append(`
								<div class="file-to_folder file-to_folder_1st">
									<img src="img/pdf.png" alt="File" class="folder_img">
								</div>
							`);
							moveFile();
							fileToStorage();
						}
					};
				addToPage();
				// moveFolder();
				// folderToStorage();
				// if (folder || file === data.folder) {
				// 	data.folder = `${$(this).prop('innerText')}`;
				// 	data.file = `${folder}`;
				// 	let storage = JSON.parse(localStorage.getItem('value')) || [];
				// 	storage.push(data);
				// 	localStorage.setItem('value', JSON.stringify(storage));
				// 	let keys = Object.keys(localStorage);
				// 	for(let key of keys) {
				// 		console.log(`${key}: ${localStorage.getItem(key)}`);
				// 	}
				// } else if (folder === data.file) {
				// 	data.folder = `${$(this).prop('innerText')}`;
				// 	data.file = `${file}`;
				// 	let storage = JSON.parse(localStorage.getItem('value')) || [];
				// 	storage.push(data);
				// 	localStorage.setItem('value', JSON.stringify(storage));
				// 	let keys = Object.keys(localStorage);
				// 	for(let key of keys) {
				// 		console.log(`${key}: ${localStorage.getItem(key)}`);
				// 	}
				// 	console.log(file);
				// 	console.log('data ' + data.file);
				// }
				if ($('.modal').html() === 'В папку не может быть перемещено более трёх файлов') {
					$.each(fileToPageExtra, function (index, value) {
						if (fileExtra === value.file) {
							fileToPage = JSON.parse(localStorage.getItem('value'));
							this.file = file;
							fileToPage.push(this);
							localStorage.setItem('value', JSON.stringify(fileToPage));
							fileToPage = JSON.parse(localStorage.getItem('value')) || [];
							let desktopFolder = [];
							$.each(fileToPage, function (index, value) { 
								if (value.folder === 'Рабочий стол') {
									desktopFolder.push(this.file);
								}
							});
							$('.folder .file-to_folder').remove();	
							$.each(desktopFolder, function (index, value) { 
								$(`.file:contains("${value}")`).remove();
							});								
							fromLocalStorage();
						}
					});
				}
				droppableFolder = this;
			}
		});
		$('.folder').click(function (e) {
			folderSort = $(this).find('p').prop('innerHTML');
			folder = $(this).find('p').prop('innerHTML');
			folderEnd = $(this).find('p').prop('innerHTML');
			e.preventDefault();
			const addFileToFolder = (selector, fileName) => {
				$(selector).append(`
					<div class="file">
						<img src="img/pdf.png" alt="">
						<p>${fileName}</p>
					</div>
				`);
			},
				addButtons = (selector) => {
					$(selector).append(`
						<div class="buttons">
							<a href="#" class="modal_close">
								<img src="./img/close.jpg" class="img-close" alt=""/>
							</a>
							<a href="#" class="modal_card" title="Расположить в формате по умолчанию">
								<img src="./img/cards_view.png" class="img-default" alt=""/>
							</a>
							<a href="#" class="modal_list" title="Расположить ввиде списка сортировки">
								<img src="./img/list_view.png" class="img-list" alt=""/>
							</a>
						</div>
					`);
				}; 
			openFolder = $(this).find('p').html();
			dropPlace = $(this).find('p').html();			
			let folders = [];
			$.ajax({
				type: "GET",
				url: "./send.php",
				data: { 'request': folder },
				dataType: "html",
				success: function () {
					$('.modal').empty();
					$('.modal-overlay').css({
						visibility: 'visible',
    				opacity: '1'
					});
					$('.modal').css({
						visibility: 'visible',
    				opacity: '1'
					});
					fileToPage = JSON.parse(localStorage.getItem('value'));
					if (fileToPage) {
						lastElem = fileToPage[fileToPage.length - 1];
					}
					$.each(fileToPage, function (index, value) {
						folders.push(value.folder);
						if (value.folder === openFolder) {
							let fileInOpenFolder = this.file;
							addFileToFolder('.modal', fileInOpenFolder);
						}
					});
					addButtons('.modal');
					$('.modal .file').draggable({
						start: function () {
							// console.log(folder);
							file = $(this).find('p').prop('innerHTML');
							fileExtra = $(this).find('p').prop('innerHTML');
							fileToPageExtra = JSON.parse(localStorage.getItem('value'));;
							$.each(fileToPage, function (index, value) {
								if (file === value.file) {
									fileToPage = JSON.parse(localStorage.getItem('value'));
									fileToPage.splice(index, 1);
									localStorage.clear();
									$.each(fileToPage, function (index, value) {
										let storage = JSON.parse(localStorage.getItem('value')) || [];
										storage.push(value);
										localStorage.setItem('value', JSON.stringify(storage));
									});
								}
							});
							const deleteFile = (selector) => {
								if ($(`${selector}  .file-to_folder`).length === 3) {
									$(`${selector} .file-to_folder_3rd`).remove();
								} else if ($(`${selector}  .file-to_folder`).length === 2) {
									$(`${selector} .file-to_folder_2nd`).remove();
								} else if ($(`${selector}  .file-to_folder`).length === 1) {
									$(`${selector} .file-to_folder_1st`).remove();
								} else if ($(`${selector}  .file-to_folder`).length === 0) {
									$(`${selector} .file-to_folder_1st`).remove();
								}
							}
							switch (+folder.substring(6, 7)) {
								case 1: {
									deleteFile('#first');
									break;
								}
								case 2: {
									deleteFile('#second');
									break;
								}
								case 3: {
									deleteFile('#third');
									break;
								}
								case 4: {
									deleteFile('#fourth');
									break;
								}
								default: {
									console.error('error');
								}
							}
							fileToPage = JSON.parse(localStorage.getItem('value')) || [];
							let desktopFolder = [];
							$.each(fileToPage, function (index, value) { 
								if (value.folder === 'Рабочий стол') {
									desktopFolder.push(this.file);
								}
							});
							$('.folder .file-to_folder').remove();	
							$.each(desktopFolder, function (index, value) { 
								$(`.file:contains("${value}")`).remove();
							});								
							fromLocalStorage();
							if (dropPlace.substring(0, 5) === 'Папка'){
								mainDrop = dropPlace;
							} else if (dropPlace === 'Рабочий стол') {
								mainDrop = 'Рабочий стол';
							}
						}
					});
					// let foldersNew = jQuery.makeArray(folders);
					// for (let i = 0; i < foldersNew.length; i++) {
					// 	if(!!true) {
					// 		$('.modal').html(`
					// 			<h3>Папка пуста!</h3>
					// 		`);
					// 	}
					// }
				},
				error: function () {
					$('.modal-overlay').css({
						visibility: 'visible',
    				opacity: '1'
					});
					$('.modal').css({
						visibility: 'visible',
						opacity: '1'
					});
					$('.modal').html(`
							<h3>Что-то пошло не так!</h3>
							<button class="modal_close"></button>`);
				}
			});
			// $('.modal_close').click(function (e) {
			// 	$('.modal-container').css({
			// 		display: 'none',
			// 	});
			// 	// $('.drop').remove();
			// });
			// $('.modal_list').click(function() {
			// 	console.log('hello');
			// 	$('.file').remove();
			// });
			// $('.modal'). click(function(e) {
			// 	e.preventDefault();
			// })
			// // $('.modal-container').click(function (e) {
			// // 	$('.modal-container').css({
			// // 		display: 'none',
			// // 	});
			// 	// $('.drop').remove();
			// });
			$('.modal').droppable({
				drop: function main() {
					let checkUP = JSON.parse(localStorage.getItem('value')) || [];
					const fileData = {
						folder: folder,
						file: file
					};
					let storage = JSON.parse(localStorage.getItem('value')) || [];
					$.each(storage, function (index, value) {
						if (file === value.file) {
							storage.splice(index, 1);
							localStorage.clear();
						} 
					});
					storage.push(fileData);
					$.each(storage, function (index, value) { 
						$.each(checkUP, function (indexOld, valueOld) { 
							if (value.file === valueOld.file && value.folder !=valueOld.folder) {
								storage.splice(index, 1);
								value = this;
								storage.push(value);
								localStorage.clear();
							}
						});
					});
					localStorage.setItem('value', JSON.stringify(storage));
					$('.file-to_folder').remove();
					$.each(storage, function (index, value) {
						const addFolder = (selector, amount) => {
							$(selector).append(`
								<div class="file-to_folder file-to_folder${amount}">
									<img src="img/pdf.png" alt="File" class="folder_img">
								</div>
							`);
						};
						addFoldersMain = (selector) => {
							if ($(selector).prop('childElementCount') === 2) {
								addFolder(selector, '_1st');
							} else if ($(selector).prop('childElementCount') === 3) {
								addFolder(selector, '_2nd');
							} else if ($(selector).prop('childElementCount') === 4) {
								addFolder(selector, '_3rd');
							}
						};
						if (value.folder === `Папка 1`) {
							addFoldersMain('#first');
						} else if (value.folder === `Папка 2`) {
							addFoldersMain('#second');
						} else if (value.folder === `Папка 3`) {
							addFoldersMain('#third');
						} else if (value.folder === `Папка 4`) {
							addFoldersMain('#fourth');
						}
					});
				}
			});
			// $('body').append(`
			// 	<div class="drop"></div>
			// `);
			$('.drop').droppable({
				accept: '.modal .file', 
				drop: function () {
					const storageOld = fileToPage.length;
					fileToPage = JSON.parse(localStorage.getItem('value')) || [];
					droppableBody = this;
					if (storageOld === fileToPage.length) {
						$.each(fileToPageExtra, function (index, value) { 
							if (folder === value.folder) {
								if (file === value.file) {
									fileToPageExtra.splice(index, 1);
									this.folder = 'Рабочий стол';
									fileToPageExtra.push(this);
									localStorage.setItem('value', JSON.stringify(fileToPageExtra));
									fileToPage = JSON.parse(localStorage.getItem('value')) || [];
									let desktopFolder = [];
									$.each(fileToPage, function (index, value) { 
										 if (value.folder === 'Рабочий стол') {
											desktopFolder.push(this.file);
										}
									});
									$('.folder .file-to_folder').remove();	
									$.each(desktopFolder, function (index, value) { 
										$(`.file:contains("${value}")`).remove();
									});		
									fromLocalStorage();
									$('.modal-overlay').css({
										visibility: 'hidden',
										opacity: '0'
									});
									$('.modal').css({
										visibility: 'hidden',
										opacity: '0'
									});
								}
							}
						});
					} 
					// $('.drop').remove();		
				}
			});
		});
		// $('.basket').droppable({ drop:function(){
		// 	$('.folder.ui-draggable-dragging').remove();
		// 	const data = {
		// 		folder: `${$(this).prop('innerText')}`,
		// 		file: `${folder}` 
		// 	};
		// 	if(data.file == 'undefined') {
		// 		alert('Вы не можете удалить файл')
		// 	} else {
		// 		let storage = JSON.parse(localStorage.getItem('value')) || [];
		// 		storage.push(data);
		// 		localStorage.setItem('value', JSON.stringify(storage));
		// 	}
		// }});
	};
	mainFunc();
	$('#reset').click(function () {
		const removeFile = () => {
			$(`.file-to_folder`).remove();
			$(`.file-row .file`).remove();
			$('.file-row').append(`
				<div class="file"><img src="img/pdf.png" alt=""><p>Файл 1</p></div>
				<div class="file"><img src="img/pdf.png" alt=""><p>Файл 2</p></div>
				<div class="file"><img src="img/pdf.png" alt=""><p>Файл 3</p></div>
				<div class="file"><img src="img/pdf.png" alt=""><p>Файл 4</p></div>
				<div class="file"><img src="img/pdf.png" alt=""><p>Файл 5</p></div>
				<div class="file"><img src="img/pdf.png" alt=""><p>Файл 6</p></div>
				<div class="file"><img src="img/pdf.png" alt=""><p>Файл 7</p></div>
				<div class="file"><img src="img/pdf.png" alt=""><p>Файл 8</p></div>
			`);
		}
		localStorage.clear();
		if (JSON.parse(localStorage.getItem('value')) === null) {
			removeFile();
			mainFunc();
		}
	});
	$(document).on('click', '.modal_close', function () {
		$('.modal-overlay').css({
			visibility: 'hidden',
			opacity: '0'
		});
		$('.modal').css({
			visibility: 'hidden',
			opacity: '0'
		});
	});
	$(document).on('click', '.modal_card', function () {
		$('.modal').empty();
		const addFileToFolder = (selector, fileName) => {
			$(selector).append(`
				<div class="file">
					<img src="img/pdf.png" alt="">
					<p>${fileName}</p>
				</div>
			`);
		},
			addButtons = (selector) => {
				$(selector).append(`
					<div class="buttons">
						<a href="#" class="modal_close">
							<img src="./img/close.jpg" class="img-close" alt=""/>
						</a>
						<a href="#" class="modal_card" title="Расположить в формате по умолчанию">
							<img src="./img/cards_view.png" class="img-default" alt=""/>
						</a>
						<a href="#" class="modal_list" title="Расположить ввиде списка сортировки">
							<img src="./img/list_view.png" class="img-list" alt=""/>
						</a>
					</div>
				`);
			}; 
		let fileToPage = JSON.parse(localStorage.getItem('value')),
			folders = [];
		$.each(fileToPage, function (index, value) {
			folders.push(value.folder);
			if (value.folder === openFolder) {
				let fileInOpenFolder = this.file;
				addFileToFolder('.modal', fileInOpenFolder);
			}
		});
		addButtons('.modal');
		$('.modal .file').draggable({
			start: function () {
				// console.log(folder);
				file = $(this).find('p').prop('innerHTML');
				fileExtra = $(this).find('p').prop('innerHTML');
				fileToPageExtra = JSON.parse(localStorage.getItem('value'));;
				$.each(fileToPage, function (index, value) {
					if (file === value.file) {
						fileToPage = JSON.parse(localStorage.getItem('value'));
						fileToPage.splice(index, 1);
						localStorage.clear();
						$.each(fileToPage, function (index, value) {
							let storage = JSON.parse(localStorage.getItem('value')) || [];
							storage.push(value);
							localStorage.setItem('value', JSON.stringify(storage));
						});
					}
				});
				const deleteFile = (selector) => {
					if ($(`${selector}  .file-to_folder`).length === 3) {
						$(`${selector} .file-to_folder_3rd`).remove();
					} else if ($(`${selector}  .file-to_folder`).length === 2) {
						$(`${selector} .file-to_folder_2nd`).remove();
					} else if ($(`${selector}  .file-to_folder`).length === 1) {
						$(`${selector} .file-to_folder_1st`).remove();
					} else if ($(`${selector}  .file-to_folder`).length === 0) {
						$(`${selector} .file-to_folder_1st`).remove();
					}
				}
				switch (+folderEnd.substring(6, 7)) {
					case 1: {
						deleteFile('#first');
						break;
					}
					case 2: {
						deleteFile('#second');
						break;
					}
					case 3: {
						deleteFile('#third');
						break;
					}
					case 4: {
						deleteFile('#fourth');
						break;
					}
					default: {
						console.error('error');
					}
				}
				fileToPage = JSON.parse(localStorage.getItem('value')) || [];
				let desktopFolder = [];
				$.each(fileToPage, function (index, value) { 
					if (value.folder === 'Рабочий стол') {
						desktopFolder.push(this.file);
					}
				});
				$('.folder .file-to_folder').remove();	
				$.each(desktopFolder, function (index, value) { 
					$(`.file:contains("${value}")`).remove();
				});								
				fromLocalStorage();
				if (dropPlace.substring(0, 5) === 'Папка'){
					mainDrop = dropPlace;
				} else if (dropPlace === 'Рабочий стол') {
					mainDrop = 'Рабочий стол';
				}
			}
		});
		$('.drop').droppable({
			accept: '.modal .file', 
			drop: function () {
				const storageOld = fileToPage.length;
				fileToPage = JSON.parse(localStorage.getItem('value')) || [];
				droppableBody = this;
				if (storageOld === fileToPage.length) {
					$.each(fileToPageExtra, function (index, value) { 
						if (folder === value.folder) {
							if (file === value.file) {
								fileToPageExtra.splice(index, 1);
								this.folder = 'Рабочий стол';
								fileToPageExtra.push(this);
								localStorage.setItem('value', JSON.stringify(fileToPageExtra));
								fileToPage = JSON.parse(localStorage.getItem('value')) || [];
								let desktopFolder = [];
								$.each(fileToPage, function (index, value) { 
										if (value.folder === 'Рабочий стол') {
										desktopFolder.push(this.file);
									}
								});
								$('.folder .file-to_folder').remove();	
								$.each(desktopFolder, function (index, value) { 
									$(`.file:contains("${value}")`).remove();
								});		
								fromLocalStorage();
								$('.modal-overlay').css({
									visibility: 'hidden',
									opacity: '0'
								});
								$('.modal').css({
									visibility: 'hidden',
									opacity: '0'
								});
							}
						}
					});
				} 
				// $('.drop').remove();		
			}
		});
		if ($('.modal').html() === 'В папку не может быть перемещено более трёх файлов') {
			$.each(fileToPageExtra, function (index, value) {
				if (fileExtra === value.file) {
					fileToPage = JSON.parse(localStorage.getItem('value'));
					this.file = file;
					fileToPage.push(this);
					localStorage.setItem('value', JSON.stringify(fileToPage));
					fileToPage = JSON.parse(localStorage.getItem('value')) || [];
					let desktopFolder = [];
					$.each(fileToPage, function (index, value) { 
						if (value.folder === 'Рабочий стол') {
							desktopFolder.push(this.file);
						}
					});
					$('.folder .file-to_folder').remove();	
					$.each(desktopFolder, function (index, value) { 
						$(`.file:contains("${value}")`).remove();
					});								
					fromLocalStorage();
				}
			});
		}
	});
	$(document).on('click', '.modal-overlay', function () {
		$('.modal-overlay').css({
			visibility: 'hidden',
			opacity: '0'
		});
		$('.modal').css({
			visibility: 'hidden',
			opacity: '0'
		});
	});
	$(document).on('click', '.modal_list', function () {
		$('.modal .file').remove();
		if ($('#sortable').length === 0) {
			$('.modal').append(`
				<ul id="sortable"></ul>
			`);
			$('#sortable').sortable({
				axis: "y",
				containment: "parent",
				sort: function (e, ui) {
				}
			});
			$('#sortable').disableSelection();
		}
		const fileToPage = JSON.parse(localStorage.getItem('value'));
		if ($('#sortable').prop('children').length === 0) {
			$.each(fileToPage, function (index, value) { 
				if (folderSort === value.folder) {
					$('#sortable').append(`
						<li>${value.file}</li>
					`)
				}
			});
		} 
	});
	const mediaExplain = () => {
		// const documentWidth = $(document).innerWidth();
		// if (documentWidth > 578) {
		// 	$('.file-row').css({
		// 		flexWrap: 'nowrap'
		// 	});
		// 	$('.modal').css({
		// 		padding: '60px'
		// 	});
		// 	$('.folder-row:not(.file-row)').css({
		// 		flexWrap: 'nowrap'
		// 	});
		// } else if (documentWidth > 481 && documentWidth < 577) {
		// 	$('.file-row').addClass('file-row_media-middle');
		// 	$('.file').addClass('file_media-middle');
		// 	$('.file img').addClass('file-img_media-middle');
		// 	$('.modal').addClass('modal_media-middle');
		// 	$('.modal .file').addClass('modal-file_media-middle');
		// 	$('.modal .file img').addClass('modal-file-img_media-middle');
		// } else if (documentWidth < 481) {
		// 	$('.folder-row:not(.file-row)').css({
		// 		flexWrap: 'wrap'
		// 	});
		// 	$('.folder').css({
		// 		width: '50%'
		// 	});
		// }
		if (window.matchMedia('(max-width: 480px)').matches) {
			$('.file-row').addClass('file-row_media-middle');
			$('.file').addClass('file_media-middle');
			$('.file img').addClass('file-img_media-middle');
			$('.modal').addClass('modal_media-middle');
			$('.modal .file').addClass('modal-file_media-middle');
			$('.modal .file img').addClass('modal-file-img_media-middle');
			$('.folder-row:not(.file-row)').addClass('folder-row_media-small');
			$('.folder').addClass('folder_media-small');
		} else if(window.matchMedia('(max-width: 578px)').matches) {
			$('.file-row').addClass('file-row_media-middle');
			$('.file').addClass('file_media-middle');
			$('.file img').addClass('file-img_media-middle');
			$('.modal').addClass('modal_media-middle');
			$('.modal .file').addClass('modal-file_media-middle');
			$('.modal .file img').addClass('modal-file-img_media-middle');
		} else {
			$('.file-row').removeClass('file-row_media-middle');
			$('.file').removeClass('file_media-middle');
			$('.file img').removeClass('file-img_media-middle');
			$('.modal').removeClass('modal_media-middle');
			$('.modal .file').removeClass('modal-file_media-middle');
			$('.modal .file img').removeClass('modal-file-img_media-middle');
			$('.folder-row:not(.file-row)').removeClass('folder-row_media-small');
			$('.folder').removeClass('folder_media-small');
		}
	};
	mediaExplain();
	$(window).resize(function() {
		mediaExplain();
	});
});