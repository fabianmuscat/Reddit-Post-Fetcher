from flask import Flask, request
from praw_wrapper import PrawWrapper
from flask_cors import CORS, cross_origin

# Create a Flask instance
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

prawWrapper = PrawWrapper("Thesis", "Thesis by u/Loud_Bullfrog849")

# Define a route and its corresponding request handler
@app.route('/posts', methods=['GET'])
@cross_origin()
def get_posts():
  limit = request.args.get('limit')
  try:
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    if limit:
      limit = int(limit)
      
    posts = prawWrapper.get_posts("BaldursGate3", limit=limit, start_date=start_date, end_date=end_date)
  except ValueError:
    posts = prawWrapper.get_posts("BaldursGate3", limit=10)
    
  return posts

# Run the server
if __name__ == '__main__':
    app.run()