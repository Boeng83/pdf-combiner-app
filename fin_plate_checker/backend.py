from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import math
import os
import json
from engine import compute_connection, compute_joint

try:
    from jsonschema import validate, ValidationError
    JSONSCHEMA_AVAILABLE = True
except Exception:
    JSONSCHEMA_AVAILABLE = False

app = Flask(__name__, static_folder='.')
CORS(app)


def float_or_default(v, default=0.0):
    try:
        return float(v)
    except Exception:
        return default


@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'message': "Calculation engine ready"})


@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json or {}

    # Validate against schema if jsonschema is available
    schema_path = os.path.join(os.path.dirname(__file__), 'calculate_schema.json')
    if JSONSCHEMA_AVAILABLE:
        try:
            with open(schema_path, 'r', encoding='utf-8') as f:
                schema = json.load(f)
            # Use the Request definition inside the schema
            request_schema = schema.get('definitions', {}).get('Request')
            if request_schema is not None:
                validate(instance=data, schema=request_schema)
        except ValidationError as ve:
            return jsonify({'error': 'validation_error', 'details': str(ve)}), 400
        except Exception:
            # if schema load/validate fails, continue without hard-blocking
            pass
    else:
        # jsonschema not installed — return hint in response header/body if desired
        pass

    # Delegate calculation to engine
    try:
        # attempt to load materials catalog if available
        mat_path = os.path.join(os.path.dirname(__file__), 'data', 'materials.json')
        if os.path.exists(mat_path):
            with open(mat_path, 'r', encoding='utf-8') as f:
                materials = json.load(f)
        else:
            materials = None
        # If caller provided a joint (multiple connections), delegate to compute_joint
        if isinstance(data, dict) and 'joint' in data:
            result = compute_joint(data.get('joint'), materials=materials)
        else:
            result = compute_connection(data, materials=materials)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': 'calculation_failed', 'details': str(e)}), 500


@app.route('/')
def index():
    # serve the frontend HTML file
    return send_from_directory(os.path.dirname(__file__), 'frontend.html')


@app.route('/schema')
def schema():
    """Serve the calculate_schema.json file for clients to discover request/response shapes."""
    return send_from_directory(os.path.dirname(__file__), 'calculate_schema.json', mimetype='application/json')


@app.route('/materials')
def materials():
    try:
        mat_path = os.path.join(os.path.dirname(__file__), 'data', 'materials.json')
        with open(mat_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': 'failed_to_load_materials', 'details': str(e)}), 500


@app.route('/validate', methods=['POST'])
def validate_payload():
    """Validate a provided JSON payload against the Request schema and return detailed errors."""
    payload = request.json or {}
    schema_path = os.path.join(os.path.dirname(__file__), 'calculate_schema.json')
    if not JSONSCHEMA_AVAILABLE:
        return jsonify({'error': 'jsonschema_not_installed', 'message': 'Install jsonschema in the environment to enable payload validation.'}), 501
    try:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        request_schema = schema.get('definitions', {}).get('Request')
        if request_schema is None:
            return jsonify({'error': 'schema_malformed', 'message': 'Request definition not found in schema.'}), 500
        validate(instance=payload, schema=request_schema)
        return jsonify({'valid': True})
    except ValidationError as ve:
        return jsonify({'valid': False, 'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': 'validation_failed', 'details': str(e)}), 500


if __name__ == '__main__':
    # Bind to all interfaces and use PORT environment variable when provided
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5001)), debug=True)
