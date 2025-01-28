from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import matplotlib.pyplot as plt
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/plot', methods=['POST'])
def plot():
    # Receive data from frontend
    data = request.json
    x_data = data.get('x', [])
    y_data = data.get('y', [])

    if not x_data or not y_data:
        return jsonify({"error": "Data is missing"}), 400
    
    # Plotting the graph
    plt.figure(figsize=(6, 4))
    plt.plot(x_data, y_data, label='Data', color='blue')
    plt.xlabel('X-axis')
    plt.ylabel('Y-axis')
    plt.title('Data Plot')
    plt.legend()

    # Save the plot to a BytesIO object
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)  # Go to the beginning of the BytesIO object

    # Return the plot as an image
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
