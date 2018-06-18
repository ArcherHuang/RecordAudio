import os
from flask import json
from flask import Flask, request, redirect, url_for
from werkzeug import secure_filename

ALLOWED_EXTENSIONS = set(['ogg', 'wav', 'mp3'])
UPLOAD_FOLDER = os.path.basename('file')

inet_addr = "59.120.157.118"
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

	# print(request.values.get('file'))
	# print(request.form.get('file'))
	# print request.files['file']
	# return 'file uploaded successfully'

	# file = request.files['image']
	# f = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
	# file.save(f)
	# return 'file uploaded successfully'
	# submitted_file = request.form.get("file", False)
	submitted_file = request.files['file']
	# submitted_file = request.form['file']
	print submitted_file.filename
	
	if submitted_file and allowed_file(submitted_file.filename):
		filename = secure_filename(submitted_file.filename)
		submitted_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		return 'file uploaded successfully'
	else:
		return 'file uploaded fail'

if __name__ == '__main__': 
	app.debug = True
	app.run(host = inet_addr,port = 5000,ssl_context=('cert.pem', 'key.pem'))
	# app.run(
	# 	host = inet_addr,
	# 	port = 5000
	# )
