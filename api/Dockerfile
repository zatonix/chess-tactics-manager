FROM python:3.9-slim

RUN pip install virtualenv
ENV VIRTUAL_ENV=/venv
RUN python -m virtualenv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV PYTHONUNBUFFERED=True

WORKDIR /app/

# Install depedencies
COPY requirements*.txt /app/
RUN pip install --no-cache-dir --upgrade -r requirements.txt -r requirements-dev.txt

# Copy the application's source code
COPY . /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]
