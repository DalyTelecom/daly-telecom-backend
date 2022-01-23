# daly-telecom
### Шаги для локального запуска:
- создайте в корне проекта файл **.env** и заполните его по образцу **env.example**
- поднимите контейнер с базой данной командой **docker-compose up -d** (при первом запуске возможно понадобится **sudo**)
- запустите приложение командой **npm run dev**

По окончании работы не забудте остановить контейнер с базой данных командой **docker-compose down**
