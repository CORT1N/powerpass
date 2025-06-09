FROM python:3.13.3-alpine3.22

WORKDIR /code

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /code/app

CMD ["fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0"]