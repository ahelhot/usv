# Удобная система верстки v2 (usv)
- author: fe3dback@yandex.ru
- repo: https://github.com/ahelhot/usv

#### 1. Зачем нужно:
----
Данная тулза решает 99% проблем возникающих при верстке макетов. Позволяет легко разбить верстку на общие компоненты, которые могут быть использованы в любых других шаблонах. Для использования не нужно никаких настроек, особенных IDE и утилит.

#### 2. Что входит в пакет:
----
- [**jade(pug) шаблонизатор**](https://pugjs.org/language/tags.html)
- [**less препроцессор**](http://lesscss.org/features/)
- [**coffee препроцессор**](http://coffeescript.org/)
- тулзы для автоматической установки и настройки
- адаптивный фреймворк (js/css на mediaquery) // todo
- библиотека usv.js для удобной работы с шаблонами

#### 3. Установка:
----
##### Требования
Для работы требуется nodejs и npm. Установить можно с оффициального сайта.

##### Установка для каждого проекта
Создаем и переходим в **пустую папку** где будет проект и сам usv.
```
$ cd /some-empty/root-folder/
```

Скачиваем последнюю версию из git:
```
$ git clone https://github.com/ahelhot/usv.git
```

Устанавливаем с помощью usv:
```
$ python ./usv/usv-setup.py
```

Должна получится такая структура:
```
|- root-folder
   |- project *(git folder)*   # проект, git готов к работе
      |- work                  # шаблонизатор
         |- pug/*              # шаблоны
         |- store.js           # json, будет доступен в шаблонах
      |- build                 # конечная папка проекта
         |- assets/*           # скрипты, стили, шрифты..
    |- usv/*                   # этот скрипт, сборщик, модули
```

#### 4. Работа:
--------
#### 4.0 Сборщик
Для автоматической компиляции coffee, less, pug файлов используйте grunt.
```
$ cd /root-folder/usv
$ grunt
```

#### 4.1 Шаблоны (jade/pug)
##### 4.1.1 Какие проблемы решают шаблоны:
- мы используем одну верстку с разными данными. Например карточку товара, с разными названиями, картинками, описаниями и т.п.
- мы используем одни компоненты в разных страницах (например header, footer)
- все страницы наследуют общий layout (таким образом все стили и скрипты общие). Вместо верстки в страницах, мы только указываем какую часть layout'а они должны расширять
- короткий синтакс экономит время. К примеру:
```
.products
  .product
    .title Очередной товар
    .desc Очень полезная вещь
```
вместо:
```
<div class='products'>
  <div class='product'>
    <div class='title'>Очередной товар</div>
    <div class='desc'>Очень полезная вещь</div>
  </div>
</div>
```
- позволяет использовать компоненты с переменными:
```
mixin catalog-product(data)

    -
        var data = usv.prepare(data, {
            title: usv.oneOf([
                "Чайник", "Кофеварка", "Стиральная машина",
                "Холодильник", "Ноутбук"
            ]),
            image: usv.oneOf([
                "http://placehold.it/100x100",
                "http://placehold.it/100x140"
            ]),
            price: usv.range(500,2000)
        })

    .product
        .preview
            img(src=data.image)
        .title #{data.title}
        .price
            | Цена: #{data.price}
```
```
.products
    +catalog-product({title:"КОМБАЙН 9000"})
    +catalog-product
```
что мы получим:
```
<div class="products">
  <div class="product">
    <div class="preview"><img src="http://placehold.it/100x140"/></div>
    <div class="title">КОМБАЙН 9000</div>
    <div class="price">Цена: 1960</div>
  </div>
  <div class="product">
    <div class="preview"><img src="http://placehold.it/100x100"/></div>
    <div class="title">Чайник</div>
    <div class="price">Цена: 1962</div>
  </div>
</div>
```
##### 4.1.2 Использование store.js
В папке project/work есть файл store.js. Мы можете положить туда любые данные в json, они будут доступны по всему проекту в шаблонах.
Например так:
```
//in store.js
{title: "Hello Store!"}

//in template.pug
div.title #{store.title}

//Результат:
<div class="title">Hello Store!</div>
```

##### 4.1.4 Подробнее
- Синтакс - https://pugjs.org/language/tags.html
- пример: можно посмотреть пример работы, сразу после установки.

#### 5. Перенос всего в шаблон проекта:
--------
- Просто копируем папку build. Например для битрикса это
будет выглядеть так:
/build => /my-bitrix-project/local/templates/build
