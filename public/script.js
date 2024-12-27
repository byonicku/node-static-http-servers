$(document).ready(function () {
	let currentPath = sessionStorage.getItem("currentPath") || "";
	let sortField = "name";
	let sortOrder = "asc";

	function fetchFiles(path = "") {
		$.getJSON(`/files?path=${encodeURIComponent(path)}`, function (files) {
			currentPath = path;
			sessionStorage.setItem("currentPath", currentPath);
			const fileList = $("#file-list");
			const backButton = $("#back-button");
			fileList.empty();
			if (path) {
				backButton.show();
			} else {
				backButton.hide();
			}
			files.sort((a, b) => {
				if (a.isDirectory && !b.isDirectory) return -1;
				if (!a.isDirectory && b.isDirectory) return 1;
				if (sortOrder === "asc") {
					return a[sortField] > b[sortField] ? 1 : -1;
				} else {
					return a[sortField] < b[sortField] ? 1 : -1;
				}
			});
			files.forEach((file) => {
				const row = $("<tr>");
				const nameCell = $("<td>");
				const link = $("<a>").text(file.name).attr("href", "#");
				link.on("click", function (e) {
					e.preventDefault();
					if (file.isDirectory) {
						fetchFiles(path + "/" + file.name);
					} else {
						window.open(`${path}/${file.name}`, "_blank");
					}
				});
				nameCell.append(link);
				row.append(nameCell);

				const typeCell = $("<td>").text(file.type);
				row.append(typeCell);

				const sizeCell = $("<td>").text(file.size);
				row.append(sizeCell);

				fileList.append(row);
			});
		}).fail(function (error) {
			console.error("Error fetching files:", error);
		});
	}

	$("#back-button").on("click", function () {
		const parentPath = currentPath.split("/").slice(0, -1).join("/");
		fetchFiles(parentPath);
	});

	$("#sort-name").on("click", function () {
		sortField = "name";
		sortOrder = sortOrder === "asc" ? "desc" : "asc";
		fetchFiles(currentPath);
	});

	$("#sort-type").on("click", function () {
		sortField = "type";
		sortOrder = sortOrder === "asc" ? "desc" : "asc";
		fetchFiles(currentPath);
	});

	$("#sort-size").on("click", function () {
		sortField = "size";
		sortOrder = sortOrder === "asc" ? "desc" : "asc";
		fetchFiles(currentPath);
	});

	fetchFiles(currentPath);
});
