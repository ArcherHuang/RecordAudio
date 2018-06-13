import os
from flask import Flask, request, redirect, url_for
from werkzeug import secure_filename

ALLOWED_EXTENSIONS = set(['ogg', 'wav', 'mp3'])
UPLOAD_FOLDER = os.path.basename('file')

inet_addr = "127.0.0.1"
app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
	return '.' in filename and \
		filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# *****************************************************************************************
# Read GET http://127.0.0.1:5000/api/v1.0/print
# *****************************************************************************************
@app.route("/api/v1.0/print", methods=['GET'])
def getMethod():  
    return json.dumps({"status": 200, "comment": "[ Get Method ] Hello World"})

# *****************************************************************************************
# POST http://ip:1688/api/v1.0/uploadFile
# Header Content-Type:multipart/form-data
# Body key: audioFile 
# Body value: file
# *****************************************************************************************
@app.route("/api/v1.0/uploadFile", methods=['POST'])
def upload():
	# file = request.files['image']
	# f = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
	# file.save(f)
	# return 'file uploaded successfully'

	submitted_file = request.files['audioFile']
	if submitted_file and allowed_file(submitted_file.filename):
		filename = secure_filename(submitted_file.filename)
		submitted_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		return 'file uploaded successfully'

if __name__ == '__main__': 
	app.debug = True
	app.run(
		host = inet_addr,
		port = 5000
	)
