Quick Render deployment

This repo includes a simple `render.yaml` to help create a Web Service, and `fin_plate_checker/Procfile` + `fin_plate_checker/requirements.txt`.

If you prefer the Render UI:
1. Sign in to https://dashboard.render.com
2. New -> Web Service
3. Connect your GitHub and choose this repository
4. Branch: main
5. Root Directory: fin_plate_checker
6. Build command: pip install -r fin_plate_checker/requirements.txt
7. Start command: gunicorn backend:app

Or use the `render.yaml` (may require adjusting for your account). Ensure the service has access to the `fin_plate_checker` root and that the `Procfile` exists there.
