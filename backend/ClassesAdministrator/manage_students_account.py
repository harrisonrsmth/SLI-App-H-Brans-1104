from flask import Blueprint
from flask_cors import CORS, cross_origin

manage_stud_accounts = Blueprint('manage_stud_accounts',__name__)

@manage_stud_accounts.route("/api/createStudentAccount", methods=['POST'])
@cross_origin()
def test():
    return {"hello": "haha"}