// Initialize data
const rootFolders = [
	{
		id: '2021',
		name: '2021',
		type: 'folder',
		children: [
			{
				id: '2021-illness',
				name: 'Illness',
				type: 'folder',
				children: [
					{
						id: '2021-illness-1',
						name: 'illness_2021_01',
						type: 'file',
						extension: '.pdf',
						size: 120 * 1024,
						createdDate: '2021-03-15',
					},
				],
			},
			{
				id: '2021-vacations',
				name: 'Vacations',
				type: 'folder',
				children: [],
			},
			{
				id: '2021-documents',
				name: 'Documents',
				type: 'folder',
				children: [],
			},
			{
				id: '2021-others',
				name: 'Others',
				type: 'folder',
				children: [],
			},
		],
	},
	{
		id: '2022',
		name: '2022',
		type: 'folder',
		children: [
			{
				id: '2022-illness',
				name: 'Illness',
				type: 'folder',
				children: [],
			},
			{
				id: '2022-vacations',
				name: 'Vacations',
				type: 'folder',
				children: [
					{
						id: '2022-vacations-1',
						name: 'vacation_request_2022_01',
						type: 'file',
						extension: '.docx',
						size: 45 * 1024,
						createdDate: '2022-06-05',
					},
				],
			},
			{
				id: '2022-documents',
				name: 'Documents',
				type: 'folder',
				children: [],
			},
			{
				id: '2022-others',
				name: 'Others',
				type: 'folder',
				children: [],
			},
		],
	},
	{
		id: '2023',
		name: '2023',
		type: 'folder',
		children: [
			{
				id: '2023-illness',
				name: 'Illness',
				type: 'folder',
				children: [],
			},
			{
				id: '2023-vacations',
				name: 'Vacations',
				type: 'folder',
				children: [],
			},
			{
				id: '2023-documents',
				name: 'Documents',
				type: 'folder',
				children: [],
			},
			{
				id: '2023-others',
				name: 'Others',
				type: 'folder',
				children: [],
			},
		],
	},
].sort((a, b) => b.name.localeCompare(a.name));

// DOM elements
const folderStructure = document.getElementById('folder-structure');
const breadcrumb = document.getElementById('breadcrumb');
const folderOverview = document.getElementById('folder-overview');

// Functions to populate folder structure, breadcrumb, and folder overview
function populateFolderStructure(folders = rootFolders, container = folderStructure) {
	container.innerHTML = '';

	folders.forEach((folder) => {
		const folderElement = document.createElement('button');
		folderElement.classList.add('list-group-item', 'list-group-item-action');
		folderElement.innerText = folder.name;
		folderElement.dataset.id = folder.id;
		folderElement.addEventListener('click', () => {
			populateBreadcrumb(folder);
			populateFolderOverview(folder.children);
		});

		container.appendChild(folderElement);
	});
}

function populateBreadcrumb(folder, folders = rootFolders) {
	breadcrumb.innerHTML = '';

	if (folder) {
		const path = [];
		let currentFolder = folder;
		while (currentFolder) {
			path.unshift(currentFolder);
			currentFolder = folders.find((f) => f.children.includes(currentFolder));
		}

		path.forEach((f, i) => {
			const folderIcon = document.createElement('i');
			folderIcon.className = i === path.length - 1 ? 'fas fa-folder-open' : 'fas fa-folder';
			folderIcon.style.margin = 'auto';
			folderIcon.style.marginRight = '4px';

			const breadcrumbItem = document.createElement('li');
			breadcrumbItem.dataset.id = folder.id;
			breadcrumbItem.classList.add('breadcrumb-item');
			breadcrumbItem.appendChild(folderIcon);
			breadcrumbItem.appendChild(document.createTextNode(f.name));

			if (i === path.length - 1) {
				breadcrumbItem.classList.add('active');
				breadcrumbItem.setAttribute('aria-current', 'page');
			} else {
				breadcrumbItem.style.cursor = 'pointer';
				breadcrumbItem.addEventListener('click', () => {
					populateBreadcrumb(f);
					populateFolderOverview(f.children);
				});
			}

			breadcrumb.appendChild(breadcrumbItem);
		});
	}
}

function populateFolderOverview(items) {
	const tbody = folderOverview.querySelector('tbody');
	tbody.innerHTML = '';

	items.forEach((item) => {
		const row = document.createElement('tr');
		const itemName = document.createElement('td');
		const itemIcon = document.createElement('i');
		const itemExtension = document.createElement('td');
		const itemSize = document.createElement('td');
		const itemCreatedDate = document.createElement('td');
		const itemAction = document.createElement('td');
		const deleteButton = document.createElement('button');
		const previewButton = document.createElement('button');
		const downloadButton = document.createElement('button');
		const btnGroup = document.createElement('div');
		btnGroup.classList.add('btn-group');

		itemIcon.classList.add('mr-2');
		itemExtension.innerText = item.type === 'file' ? getFileType(item.extension) : 'Folder';

		if (item.type === 'folder') {
			let folderSize = 0;
			item.children.forEach((subItem) => {
				if (subItem.type === 'file') {
					folderSize += subItem.size;
				}
			});
			// itemSize.innerText = `${folderSize / 1024} KB`;
			itemSize.innerText = formatFileSize(folderSize);
		} else if (item.type === 'file') {
			itemSize.innerText = formatFileSize(item.size);
			// itemSize.innerText = `${item.size / 1024} KB`;
		}

		// itemSize.innerText = item.type === 'file' ? item.size : '-';
		itemCreatedDate.innerText = item.createdDate || '-';
		deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
		deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
		deleteButton.setAttribute('data-toggle', 'tooltip');
		deleteButton.setAttribute('title', 'Delete');
		deleteButton.addEventListener('click', () => {
			// Implement delete functionality
		});

		itemAction.appendChild(deleteButton);
		row.appendChild(itemName);
		row.appendChild(itemExtension);
		row.appendChild(itemSize);
		row.appendChild(itemCreatedDate);
		row.appendChild(itemAction);
		row.classList.add('class', 'folder-row');

		let currentContextMenu = null;

		row.addEventListener('contextmenu', (event) => {
			event.preventDefault();

			// Close the current context menu, if there is one
			if (currentContextMenu) {
				document.body.removeChild(currentContextMenu);
				currentContextMenu = null;
			}

			const contextMenu = document.createElement('div');
			contextMenu.classList.add('context-menu');
			contextMenu.style.left = `${event.clientX}px`;
			contextMenu.style.top = `${event.clientY}px`;
			const previewMenuItem = document.createElement('div');
			previewMenuItem.classList.add('context-menu-item');
			previewMenuItem.innerText = 'Open';
			previewMenuItem.addEventListener('click', () => {
				// Implement preview functionality
				if (item.type === 'folder') {
					populateBreadcrumb(item);
					populateFolderOverview(item.children);
				}
			});
			const renameMenuItem = document.createElement('div');
			renameMenuItem.classList.add('context-menu-item');
			renameMenuItem.innerText = 'Rename';
			renameMenuItem.addEventListener('click', () => {
				const folderName = itemName.innerText;
				itemName.innerHTML = '';
				const input = document.createElement('input');
				input.type = 'text';
				input.value = folderName;
				input.addEventListener('keydown', (event) => {
					if (event.key === 'Enter') {
						event.preventDefault()
						const newFolderName = input.value;
						const folder = findFolderById(item.id);
						folder.name = newFolderName;
						itemName.innerText = newFolderName;
						populateFolderStructure();
						if (currentYearFolder) {
							populateBreadcrumb(currentYearFolder);
							populateFolderOverview(currentYearFolder.children);
							populateYears(currentYearFolder);
						} else {
							populateBreadcrumb();
							populateFolderOverview([]);
						}
						// populateBreadcrumb(folder)
						// populateFolderStructure();
						// populateFolderOverview(folder.children);
					}
				});
				itemIcon.className = 'mr-2 fas fa-folder icon-folder';
				itemName.appendChild(itemIcon);
				itemName.appendChild(input);
				input.focus();
			});
			const deleteMenuItem = document.createElement('div');
			deleteMenuItem.classList.add('context-menu-item');
			deleteMenuItem.innerText = 'Delete';
			deleteMenuItem.addEventListener('click', () => {
				// Implement delete functionality
			});
			contextMenu.appendChild(previewMenuItem);
			contextMenu.appendChild(renameMenuItem);
			contextMenu.appendChild(deleteMenuItem);
			document.body.appendChild(contextMenu);

			currentContextMenu = contextMenu;

			document.addEventListener('click', handleClickOutside, { once: true });
		});

		function handleClickOutside(event) {
			if (currentContextMenu && !document.body.contains(currentContextMenu)) {
				return;
			}

			if (document.body.contains(currentContextMenu)) {
				document.body.removeChild(currentContextMenu);
				currentContextMenu = null;
			}

			document.removeEventListener('click', handleClickOutside);
		}


		if (item.type === 'folder') {
			itemName.style.cursor = 'pointer';
			itemName.addEventListener('click', () => {
				populateBreadcrumb(item);
				populateFolderOverview(item.children);
			});
			itemIcon.className = 'mr-2 fas fa-folder icon-folder';
			itemName.appendChild(itemIcon);
		} else {
			switch (item.extension) {
				case '.docx':
					itemIcon.className = 'mr-2 fas fa-file-word icon-word';
					break;
				case '.xlsx':
					itemIcon.className = 'mr-2 fas fa-file-excel icon-excel';
					break;
				case '.pdf':
					itemIcon.className = 'mr-2 fas fa-file-pdf icon-pdf';
					break;
				default:
					itemIcon.className = 'mr-2 fas fa-file';
			}
			itemName.appendChild(itemIcon);
		}

		if (item.type === 'file') {
			previewButton.innerHTML = '<i class="fas fa-eye"></i>';
			previewButton.classList.add('btn', 'btn-primary', 'btn-sm');
			previewButton.setAttribute('data-toggle', 'tooltip');
			previewButton.setAttribute('title', 'Preview');
			previewButton.addEventListener('click', () => {
				// Implement preview functionality
			});

			downloadButton.innerHTML = '<i class="fas fa-download"></i>';
			downloadButton.classList.add('btn', 'btn-success', 'btn-sm');
			downloadButton.setAttribute('data-toggle', 'tooltip');
			downloadButton.setAttribute('title', 'Download');
			downloadButton.addEventListener('click', () => {
				// Implement download functionality
			});

			btnGroup.appendChild(previewButton);
			btnGroup.appendChild(downloadButton);
			btnGroup.appendChild(deleteButton);
			itemAction.appendChild(btnGroup);

			previewButton.addEventListener('click', () => {
				const fileUrl = `/path/to/files/${item.name}${item.extension}`; // Replace with the actual URL of the file
				window.open(fileUrl, '_blank');
			});

			downloadButton.addEventListener('click', () => {
				const fileUrl = `/path/to/files/${item.name}${item.extension}`; // Replace with the actual URL of the file
				const downloadLink = document.createElement('a');
				downloadLink.href = fileUrl;
				downloadLink.download = `${item.name}${item.extension}`;
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
			});
		}

		itemName.appendChild(itemIcon);
		itemName.appendChild(document.createTextNode(item.name));

		tbody.appendChild(row);
		$('[data-toggle="tooltip"]').tooltip();
	});
}

function formatFileSize(bytes, si = true, dp = 1) {
	let size = bytes;
	const thresh = si ? 1000 : 1024;
  
	if (Math.abs(bytes) < thresh) {
	  return `${bytes} B`;
	}
  
	const units = si
	  ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	  : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;
  
	do {
	  size /= thresh;
	  u += 1;
	} while (Math.round(Math.abs(size) * r) / r >= thresh && u < units.length - 1);
  
	return `${size.toFixed(dp)} ${units[u]}`;
  }

function populateYears() {
	folderStructure.innerHTML = '';
	rootFolders.forEach((folder) => {
		const listItem = document.createElement('a');
		listItem.innerText = folder.name;
		listItem.classList.add('list-group-item', 'list-group-item-action');

		if (breadcrumb.children.length > 0 && breadcrumb.children[0].textContent === folder.name) {
			listItem.classList.add('active');
		}

		listItem.addEventListener('click', () => {
			populateBreadcrumb(folder);
			populateFolderOverview(folder.children);
			populateYears();
		});

		folderStructure.appendChild(listItem);
	});
}

function handleFiles(files) {
	// Get the current folder from the breadcrumb
	const currentFolderElement = breadcrumb.querySelector('.breadcrumb-item.active');
	// const currentFolderId = currentFolderElement ? currentFolderElement.querySelector('span').dataset.id : null;
	const currentFolderId = currentFolderElement ? currentFolderElement.dataset.id : null;

	const currentFolder = findFolderById(currentFolderId);

	if (!currentFolder) {
		console.error('Current folder not found');
		return;
	}

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const newFile = {
			id: `${currentFolder.id}-${file.name}`,
			name: file.name,
			type: 'file',
			extension: file.name.slice(file.name.lastIndexOf('.')),
			size: file.size,
			createdDate: new Date().toISOString().slice(0, 10),
		};

		currentFolder.children.push(newFile);
	}

	populateFolderOverview(currentFolder.children);
}

function findFolderById(id, folders = rootFolders) {
	const stack = [...folders];

	while (stack.length) {
		const currentFolder = stack.pop();

		if (currentFolder.id === id) {
			return currentFolder;
		}

		if (currentFolder.children) {
			stack.push(...currentFolder.children);
		}
	}

	return null;
}


function getFileType(extension) {
	switch (extension) {
		case '.txt':
			return 'Text File';
		case '.pdf':
			return 'PDF File';
		case '.doc':
		case '.docx':
			return 'Word Document';
		case '.xls':
		case '.xlsx':
			return 'Excel Spreadsheet';
		case '.ppt':
		case '.pptx':
			return 'PowerPoint Presentation';
		case '.jpg':
		case '.jpeg':
		case '.png':
		case '.gif':
			return 'Image File';
		case '.mp3':
			return 'Audio File';
		case '.mp4':
			return 'Video File';
		case '.zip':
		case '.rar':
			return 'Archive File';
		default:
			return 'Unknown File Type';
	}
}

const currentYear = new Date().getFullYear();
const currentYearFolder = rootFolders.find((folder) => folder.name === currentYear.toString());

populateFolderStructure();
if (currentYearFolder) {
	populateBreadcrumb(currentYearFolder);
	populateFolderOverview(currentYearFolder.children);
	populateYears(currentYearFolder);
} else {
	populateBreadcrumb();
	populateFolderOverview([]);
}

document.addEventListener('DOMContentLoaded', () => {
	const searchIcon = document.getElementById('search-icon');
	const searchInput = document.getElementById('search-input');
	const searchContainer = document.getElementById('search-container');

	searchIcon.addEventListener('click', () => {
		searchInput.classList.toggle('d-none');
		if (!searchInput.classList.contains('d-none')) {
			searchInput.focus();
		}
	});

	let currentFolder;

	searchInput.addEventListener('input', (event) => {
		const searchTerm = event.target.value.toLowerCase();
		const activeYear = breadcrumb.children[0].textContent;
		const activeYearFolder = rootFolders.find((folder) => folder.name === activeYear);

		if (searchTerm) {
			if (!currentFolder && activeYearFolder) {
				currentFolder = activeYearFolder.children;
			}
			filterItems(searchTerm);
		} else {
			if (currentFolder) {
				populateFolderOverview(currentFolder);
			}
			currentFolder = null;
		}
	});

	function filterItems(searchTerm) {
		const activeYear = breadcrumb.children[0].textContent;
		const activeYearFolder = rootFolders.find((folder) => folder.name === activeYear);

		if (activeYearFolder) {
			const allItems = getAllItems(activeYearFolder.children);
			const matchedItems = allItems.filter((item) => item.name.toLowerCase().includes(searchTerm));
			populateFolderOverview(matchedItems);
		}
	}


	function getAllItems(folders) {
		let items = [];

		folders.forEach((folder) => {
			items.push(folder);
			if (folder.children && folder.children.length) {
				items = items.concat(getAllItems(folder.children));
			}
		});

		return items;
	}


	// Close search input when clicking outside of it
	document.addEventListener('click', (event) => {
		if (!searchContainer.contains(event.target) && !searchInput.classList.contains('d-none')) {
			searchInput.classList.add('d-none');
		}
	});
});

folderOverview.addEventListener('dragover', (event) => {
	event.preventDefault();
	folderOverview.classList.add('dragging');
});

folderOverview.addEventListener('dragleave', () => {
	folderOverview.classList.remove('dragging');
});

folderOverview.addEventListener('drop', (event) => {
	event.preventDefault();
	folderOverview.classList.remove('dragging');
	handleFiles(event.dataTransfer.files);
});