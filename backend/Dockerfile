FROM python:3.8.1-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# copy requirements file
COPY ./src/requirements.txt /usr/src/app/requirements.txt
COPY ./CA.crt ./CA.crt
COPY ./key.key ./key.key

# install dependencies
RUN set -eux \
    && apk add --no-cache --virtual .build-deps build-base \
        libressl-dev libffi-dev gcc musl-dev python3-dev \
    && pip install --upgrade pip setuptools wheel \
    && pip install -r /usr/src/app/requirements.txt \
    && rm -rf /root/.cache/pip

# copy project
COPY ./src /usr/src/app/
WORKDIR /usr/src/app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--ssl-keyfile=./key.key", "--ssl-certfile=./CA.crt"]