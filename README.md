![GithubCI](https://github.com/sergtyapkin/vue-frontend-template/actions/workflows/deploy.yml/badge.svg)

# Веб-вервис в докере с авто-деплоем на _Nginx_ и получением сертификатов _Letsencript_

Всё делается через команды `make`

### 1. Клонируем репозиторий:
```SHELL
git clone git@github.com:SergTyapkin/vue-frontend-template.git

```

### 2. Настраиваем вообще всё.
В самом начале нужно будет настроить `.env` файл, прописать правильный `DOMAIN_URL`
```SHELL
cd vue-frontend-template
make all
````

Всё. Наслаждаемся тем, что за нас всё сделали, сайт раздаётся, сертификаты обновляются.
Теперь `Github CI` сам будет проверять, собирается ли контейнер при **Pull Request**'ах, а при **Push**'ах в ветку `master` будет автоматически выполняться `make update` на сервере и обновлять деплой!
