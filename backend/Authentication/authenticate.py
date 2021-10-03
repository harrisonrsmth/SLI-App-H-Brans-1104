from flask import Blueprint
from flask_cors import CORS, cross_origin
from flask import request
import sli_database



authenticate_endpoint = Blueprint('authenticate_endpoint',__name__)


