from flask import Flask, jsonify, request
from flask_cors import CORS
from query_data import querydata  # Import your querydata module
from confidence_score import confidence_calc

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/query', methods=['GET'])
def get_query():
    query = request.args.get('query', default="What is the meaning of life?", type=str)
    result = querydata(query)  # Get the result from querydata function

    # Extract the main response content (text generated)
    response_text = result['response'].content  # This is where the generated content lies

    # Extract logprobs from the response (list of tokens with logprob data)
    tokens = result['response'].response_metadata.get('logprobs', {}).get('content', [])
    
    # Extract logprobs for each token, if available
    logprobs = [token.get('logprob') for token in tokens if 'logprob' in token]

    # Extract sources, if provided in the response
    sources = result.get('sources', [])

    # Calculate confidence scores using the logprobs
    probabilities = confidence_calc(logprobs)

    # Return the response text, sources, and probabilities as JSON
    return jsonify({
        'response': response_text,
        'sources': sources,
        
        'probabilities': probabilities
    })

if __name__ == '__main__':
    app.run(port=8080)
