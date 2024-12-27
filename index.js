var path = require("path");
var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

var dir = path.join(__dirname, "public");

app.use(express.static(dir));
app.use(bodyParser.json());

function formatSize(size) {
	if (size < 1024) return size + " B";
	if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
	if (size < 1024 * 1024 * 1024)
		return (size / (1024 * 1024)).toFixed(2) + " MB";
	return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

app.get("/files", function (req, res) {
	var currentPath = path.join(dir, req.query.path || "");
	fs.readdir(currentPath, { withFileTypes: true }, function (err, files) {
		if (err) {
			return res.status(500).json({ error: "Unable to scan directory" });
		}
		const fileDetails = files.map((file) => {
			const filePath = path.join(currentPath, file.name);
			const stats = fs.statSync(filePath);
			return {
				name: file.name,
				isDirectory: file.isDirectory(),
				size: file.isDirectory() ? "-" : formatSize(stats.size),
				type: file.isDirectory()
					? "Directory"
					: path.extname(file.name).substring(1) || "File",
			};
		});
		res.json(fileDetails);
	});
});

app.listen(3000, function () {
	console.log("Listening on http://localhost:3000/");
});
